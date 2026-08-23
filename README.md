# RecoverAI — Intelligent Revenue Recovery & Payment Rescue System

> **Tagline**: Recover Lost Revenue. Automatically.  
> **Core Message**: AI-powered payment rescue that turns failed transactions into recovered revenue.  
> **Flow**: `AT RISK → INTELLIGENCE → ACTION → RECOVERY`

---

## 🌟 Overview

**RecoverAI** is a production-style, AI-native SaaS application designed to help businesses automatically diagnose, predict, and rescue lost revenue resulting from failed card payments, expired credit cards, bank clearing windows, NPCI limit ceilings, and subscription payment failures.

Instead of treating every payment decline identically with dumb retry routines, RecoverAI combines a **Random Forest Machine Learning model**, **deterministic strategy rules**, and **LLM natural language explanations** to execute targeted interventions (such as 1-Click Update Magic Links, 48-Hour Salary-Credit Retries, Backup Gateway Re-routing, or CS Concierge Escalation).

---

## 🏗️ Technology Stack & Architecture

### 1. Frontend Client
- **Framework**: React 18, TypeScript, Vite
- **Styling & UI System**: Vanilla CSS tokens + Tailwind CSS v3 (`Plus Jakarta Sans`, `JetBrains Mono`)
- **Data Visualization**: Recharts (interactive HSL area/bar/pie graphs)
- **Animations**: Framer Motion & Canvas Confetti
- **Icons**: Lucide React

### 2. Machine Learning Engine (`ml_service/`)
- **Language & Framework**: Python 3.11, FastAPI, Uvicorn
- **ML Algorithm**: `scikit-learn` `RandomForestClassifier` (100 estimators, max depth 10)
- **Model Evaluation Metrics**:
  - **Accuracy Score**: **83.70%**
  - **ROC-AUC Score**: **76.29%**
  - **Recall**: **99.00%**
  - **Weighted F1 Score**: **0.79**
- **Features Trained**: `amount`, `failure_reason`, `customer_ltv`, `past_successful_count`, `past_failed_count`, `engagement_score`, `days_since_failure`, `previous_recovery_success`, `subscription_status`, `payment_method`.

### 3. Backend Express API (`server/`)
- **Node.js Express Server**: Port `3001`
- **Payment Gateway**: Razorpay Test Mode SDK (`razorpay` npm package)
- **Webhooks**: `POST /api/razorpay/webhook` with HMAC-SHA256 signature verification
- **LLM Explanation Layer**: OpenAI / Groq / Gemini API integration for natural language explanation generation

### 4. Database & Auth (`supabase/`)
- **PostgreSQL Database**: 12 relational tables (`users`, `organizations`, `organization_members`, `customers`, `subscriptions`, `payments`, `recovery_predictions`, `recovery_actions`, `campaigns`, `campaign_actions`, `notifications`, `ai_insights`)
- **Security**: Row Level Security (RLS) policies for multi-tenant isolation

---

## ⚡ Quick Start Guide (Local Setup)

### Prerequisites
- Node.js (v18+)
- Python (v3.11+)

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install Python ML requirements
pip install -r ml_service/requirements.txt
```

### 2. Generate Dataset & Train ML Model
```bash
python ml_service/generate_data.py
python ml_service/train_model.py
```

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```

```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY
RAZORPAY_KEY_SECRET=YOUR_SECRET
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
GROQ_API_KEY=gsk_your_groq_key
```

### 4. Launch All Services Concurrently
```bash
npm run dev:all
# OR
npm start
```

This single command starts:
- 🎨 **Vite Frontend App**: `http://localhost:5173/`
- ⚡ **Express Backend Server**: `http://localhost:3001/api`
- 🤖 **Python FastAPI ML Engine**: `http://localhost:8000/predict`

---

## 🎛️ Dual-Mode Architecture (Demo Mode vs Live Production)

RecoverAI is built with a **Dual-Mode System**:

1. **Demo Mode ⚡ (Default)**:
   - Evaluators and hackathon judges can click **"Demo Mode"** in the top bar to test pre-seeded datasets, run the **Rescue Simulator**, test 4 preset scenarios, and trigger payment rescues without needing real money or live API keys.
2. **Live Production Mode 💳**:
   - Switches the app to ingest real-time **Razorpay Webhooks** (`POST /api/razorpay/webhook`), execute live Python ML predictions, and persist transaction records into Supabase PostgreSQL.

---

## ⚖️ Responsible AI & Disclaimer

- **Probabilistic Predictions**: RecoverAI ML model outputs are statistical probabilities ($0–100\%$) trained on synthetic payment recovery telemetry.
- **Human Oversight**: High-risk actions or low-confidence predictions allow manual review and override by Customer Success Account Managers.
- **Synthetic Data Disclosure**: Demo Mode utilizes synthetic datasets to protect real customer PII and maintain PCI-DSS compliance during public demonstrations.

---

## 📄 License
Licensed under the MIT License. Built for modern FinTech and SaaS payment rescue.
