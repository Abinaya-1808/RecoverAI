import numpy as np
import pandas as pd

def generate_synthetic_dataset(num_samples=5000, seed=42):
    np.random.seed(seed)
    
    failure_reasons = [
        'EXPIRED_CARD', 
        'INSUFFICIENT_FUNDS', 
        'GATEWAY_TIMEOUT', 
        'DO_NOT_HONOR', 
        'LIMIT_EXCEEDED', 
        'INVALID_CVV',
        'BANK_TECHNICAL_ERROR',
        'FRAUD_SUSPECTED'
    ]
    
    data = []
    for i in range(num_samples):
        reason = np.random.choice(failure_reasons, p=[0.30, 0.25, 0.15, 0.10, 0.08, 0.05, 0.05, 0.02])
        amount = float(np.random.choice([2499, 4999, 8900, 12500, 24999, 49999, 89999]))
        past_successful = int(np.random.poisson(12))
        past_failed = int(np.random.poisson(1.5))
        customer_ltv = float(amount * (past_successful + 1) + np.random.uniform(0, 50000))
        engagement = float(np.random.beta(5, 2) * 100) # skewed towards higher engagement
        days_since_failure = int(np.random.exponential(2))
        
        # Ground truth recovery probability generation model
        base_prob = 0.5
        if reason in ['EXPIRED_CARD', 'GATEWAY_TIMEOUT', 'BANK_TECHNICAL_ERROR']:
            base_prob += 0.35
        elif reason in ['INSUFFICIENT_FUNDS', 'LIMIT_EXCEEDED']:
            base_prob += 0.15
        elif reason == 'FRAUD_SUSPECTED':
            base_prob -= 0.40
            
        base_prob += (past_successful / 30) * 0.20
        base_prob -= (past_failed / 10) * 0.15
        base_prob += (engagement / 100) * 0.10
        base_prob -= (days_since_failure / 14) * 0.15
        
        final_prob = np.clip(base_prob, 0.05, 0.98)
        recovered = 1 if np.random.rand() < final_prob else 0
        
        data.append({
            'amount': amount,
            'failure_reason': reason,
            'customer_ltv': customer_ltv,
            'past_successful_count': past_successful,
            'past_failed_count': past_failed,
            'engagement_score': round(engagement, 1),
            'days_since_failure': days_since_failure,
            'recovered': recovered
        })
        
    df = pd.DataFrame(data)
    df.to_csv('ml_service/payment_recovery_dataset.csv', index=False)
    print(f"Generated synthetic payment recovery dataset with {len(df)} rows. Saved to ml_service/payment_recovery_dataset.csv")

if __name__ == '__main__':
    generate_synthetic_dataset()
