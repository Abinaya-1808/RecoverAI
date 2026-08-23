import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, accuracy_score
import joblib

def train():
    dataset_path = 'ml_service/payment_recovery_dataset.csv'
    if not os.path.exists(dataset_path):
        from generate_data import generate_synthetic_dataset
        generate_synthetic_dataset()
        
    df = pd.read_csv(dataset_path)
    
    # One-hot encode failure_reason
    df_encoded = pd.get_dummies(df, columns=['failure_reason'], drop_first=False)
    
    X = df_encoded.drop(columns=['recovered'])
    y = df_encoded['recovered']
    
    feature_names = list(X.columns)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=4,
        random_state=42
    )
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    y_proba = clf.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_proba)
    
    print(f"=== Model Training Evaluation ===")
    print(f"Accuracy Score: {acc:.4f}")
    print(f"ROC-AUC Score:  {auc:.4f}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))
    
    joblib.dump(clf, 'ml_service/model.joblib')
    joblib.dump(feature_names, 'ml_service/feature_names.joblib')
    print("Saved trained model to ml_service/model.joblib and features to ml_service/feature_names.joblib")

if __name__ == '__main__':
    train()
