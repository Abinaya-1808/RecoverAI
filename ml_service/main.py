import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np
import joblib

app = FastAPI(
    title="RecoverAI ML Service API",
    description="Random Forest Prediction Engine for Payment Recovery Probability",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "ml_service/model.joblib"
FEATURES_PATH = "ml_service/feature_names.joblib"

clf = None
feature_names = None

@app.on_event("startup")
def load_model():
    global clf, feature_names
    if os.path.exists(MODEL_PATH) and os.path.exists(FEATURES_PATH):
        clf = joblib.load(MODEL_PATH)
        feature_names = joblib.load(FEATURES_PATH)
        print("ML Service successfully loaded RandomForest model and features.")
    else:
        print("Warning: Model file not found on startup. Training model automatically...")
        from ml_service.train_model import train
        train()
        clf = joblib.load(MODEL_PATH)
        feature_names = joblib.load(FEATURES_PATH)

class PredictionInput(BaseModel):
    amount: float = Field(..., example=12500.0)
    failure_reason: str = Field(..., example="EXPIRED_CARD")
    customer_ltv: float = Field(..., example=245000.0)
    past_successful_count: int = Field(..., example=14)
    past_failed_count: int = Field(..., example=1)
    engagement_score: float = Field(..., example=92.0)
    days_since_failure: int = Field(..., example=0)

class FactorDetail(BaseModel):
    name: str
    weight: int
    impact: str
    score: int
    detail: str

class PredictionOutput(BaseModel):
    recovery_probability: float
    recovery_probability_percentage: int
    risk_score: int
    risk_level: str
    expected_recovery: float
    recommended_action: str
    recommended_time: str
    ai_explanation: str
    factors: list[FactorDetail]

def select_recommended_action(failure_reason: str, ltv: float, prob: float, engagement: float) -> str:
    if failure_reason in ['GATEWAY_TIMEOUT', 'BANK_TECHNICAL_ERROR']:
        return 'IMMEDIATE_SMART_RETRY'
    if failure_reason == 'EXPIRED_CARD':
        return 'PAYMENT_UPDATE_REMINDER'
    if failure_reason == 'INSUFFICIENT_FUNDS':
        return 'DELAYED_RETRY_48H'
    if failure_reason == 'LIMIT_EXCEEDED':
        return 'DELAYED_RETRY_24H'
    if ltv >= 300000 and prob < 60:
        return 'RETENTION_OUTREACH'
    if engagement < 40:
        return 'PERSONALIZED_DISCOUNT_OFFER'
    return 'PAYMENT_UPDATE_REMINDER'

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "RecoverAI Python ML Engine",
        "model_loaded": clf is not None,
        "model_type": "RandomForestClassifier(n_estimators=100)"
    }

@app.post("/predict", response_model=PredictionOutput)
def predict(data: PredictionInput):
    if clf is None or feature_names is None:
        raise HTTPException(status_code=500, detail="ML model is not initialized.")

    # Create input dictionary with default 0s for missing one-hot encoded columns
    input_dict = {col: 0 for col in feature_names}
    
    input_dict['amount'] = data.amount
    input_dict['customer_ltv'] = data.customer_ltv
    input_dict['past_successful_count'] = data.past_successful_count
    input_dict['past_failed_count'] = data.past_failed_count
    input_dict['engagement_score'] = data.engagement_score
    input_dict['days_since_failure'] = data.days_since_failure
    
    reason_col = f"failure_reason_{data.failure_reason}"
    if reason_col in input_dict:
        input_dict[reason_col] = 1
        
    input_df = pd.DataFrame([input_dict])[feature_names]
    
    # Predict probability of class 1 (Recovery)
    proba = float(clf.predict_proba(input_df)[0][1])
    prob_pct = int(round(proba * 100))
    prob_pct = max(10, min(99, prob_pct)) # normalized bounds
    
    # Risk calculation
    risk_score = int(round(100 - prob_pct + (data.past_failed_count * 5)))
    risk_score = max(5, min(98, risk_score))
    
    if risk_score <= 30:
        risk_level = "Low"
    elif risk_score <= 60:
        risk_level = "Medium"
    elif risk_score <= 80:
        risk_level = "High"
    else:
        risk_level = "Critical"

    expected_recovery = round(data.amount * (prob_pct / 100.0), 2)
    action = select_recommended_action(data.failure_reason, data.customer_ltv, prob_pct, data.engagement_score)
    
    factors = [
        FactorDetail(
            name="Past Payment Reliability",
            weight=25,
            impact="Positive" if data.past_successful_count > 5 else "Neutral",
            score=min(100, data.past_successful_count * 7),
            detail=f"{data.past_successful_count} past successful transactions recorded."
        ),
        FactorDetail(
            name="Failure Code Benchmark",
            weight=20,
            impact="Positive" if data.failure_reason in ['EXPIRED_CARD', 'GATEWAY_TIMEOUT', 'BANK_TECHNICAL_ERROR'] else "Negative",
            score=90 if data.failure_reason in ['EXPIRED_CARD', 'GATEWAY_TIMEOUT'] else 45,
            detail=f"Reason '{data.failure_reason}' carries specific statistical recovery yield."
        ),
        FactorDetail(
            name="Customer LTV Equity",
            weight=15,
            impact="Positive" if data.customer_ltv > 100000 else "Neutral",
            score=min(100, int(data.customer_ltv / 2000)),
            detail=f"High equity user (₹{data.customer_ltv:,.0f} LTV)."
        ),
        FactorDetail(
            name="User Platform Engagement",
            weight=10,
            impact="Positive" if data.engagement_score > 70 else "Negative",
            score=int(data.engagement_score),
            detail=f"Active user score: {data.engagement_score}/100."
        ),
    ]

    action_labels = {
        "PAYMENT_UPDATE_REMINDER": "Send 1-click payment update magic link via SMS/Email",
        "DELAYED_RETRY_48H": "Schedule automated retry post-salary credit window (48 hours)",
        "DELAYED_RETRY_24H": "Schedule automated retry next morning (24 hours)",
        "IMMEDIATE_SMART_RETRY": "Execute instant multi-route smart retry through backup gateway",
        "PERSONALIZED_DISCOUNT_OFFER": "Send temporary 10% rescue token to prevent churn",
        "SUPPORT_ESCALATION": "Escalate to dedicated Customer Success Account Manager",
        "RETENTION_OUTREACH": "Initiate VIP concierge retention phone outreach",
        "ALTERNATIVE_METHOD_PROMPT": "Prompt customer to switch payment method to UPI / NetBanking",
    }

    explanation = f"FastAPI Random Forest ML Model analyzed {data.past_successful_count} historical transactions, customer LTV (₹{data.amount:,.0f}), and failure signal ({data.failure_reason}). Recommended action: {action_labels.get(action, action)}. Predicted expected recovery: ₹{expectedRecovery:,.0f}."

    return PredictionOutput(
        recovery_probability=proba,
        recovery_probability_percentage=prob_pct,
        risk_score=risk_score,
        risk_level=risk_level,
        expected_recovery=expected_recovery,
        recommended_action=action,
        recommended_time="Today at 06:30 PM" if data.days_since_failure == 0 else "Tomorrow at 09:30 AM",
        ai_explanation=explanation,
        factors=factors
    )

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
