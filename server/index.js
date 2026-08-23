import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Razorpay Test Client
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

const isRazorpayConfigured = Boolean(
  process.env.RAZORPAY_KEY_ID && 
  process.env.RAZORPAY_KEY_SECRET && 
  process.env.RAZORPAY_KEY_ID !== 'rzp_test_placeholder_key'
);

let razorpay = null;
if (isRazorpayConfigured) {
  razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
  console.log('Razorpay Test Mode Client initialized successfully.');
} else {
  console.log('Notice: Razorpay API keys not provided in env. Server running in functional Demo Mode.');
}

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

// Root endpoint welcome message
app.get('/', (req, res) => {
  res.json({
    name: 'RecoverAI Backend API Engine',
    status: 'operational',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/predict-recovery',
      '/api/razorpay/create-order',
      '/api/razorpay/webhook'
    ]
  });
});

// Helper function to generate natural language explanation via AI or deterministic fallback
async function generateAIExplanation(data) {
  const { failureReason, amount, ltv, pastSuccessful, prob, action } = data;
  
  if (GROQ_API_KEY) {
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{
            role: 'user',
            content: `Explain in 2 sentences why RecoverAI predicted ${prob}% recovery probability for a payment failure of ₹${amount} due to ${failureReason}. Customer LTV is ₹${ltv} with ${pastSuccessful} past successful payments. Recommended action: ${action}.`
          }],
          max_tokens: 100,
        })
      });
      if (groqRes.ok) {
        const resData = await groqRes.json();
        return resData.choices[0]?.message?.content?.trim() || null;
      }
    } catch (e) {
      console.warn('Groq AI call notice:', e.message);
    }
  }

  if (OPENAI_API_KEY) {
    try {
      const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `Explain in 2 sentences why RecoverAI predicted ${prob}% recovery probability for a payment failure of ₹${amount} due to ${failureReason}. Customer LTV is ₹${ltv} with ${pastSuccessful} past successful payments. Recommended action: ${action}.`
          }],
          max_tokens: 100,
        })
      });
      if (openAiRes.ok) {
        const resData = await openAiRes.json();
        return resData.choices[0]?.message?.content?.trim() || null;
      }
    } catch (e) {
      console.warn('OpenAI call notice:', e.message);
    }
  }

  return `RecoverAI predicts a high recovery probability (${prob}%) because the customer has a strong payment history (${pastSuccessful} successful payments) and high lifetime value (₹${ltv.toLocaleString('en-IN')}). Since the failure reason is ${failureReason.replace(/_/g, ' ').toLowerCase()}, a ${action.replace(/_/g, ' ').toLowerCase()} is recommended.`;
}

// Health Check
app.get('/api/health', async (req, res) => {
  let mlHealth = 'offline';
  try {
    const mlRes = await fetch(`${ML_SERVICE_URL}/health`);
    if (mlRes.ok) {
      const data = await mlRes.json();
      mlHealth = data.status;
    }
  } catch (err) {
    mlHealth = 'offline (fallback active)';
  }

  res.json({
    status: 'healthy',
    server: 'RecoverAI Backend API Engine',
    razorpay_configured: isRazorpayConfigured,
    ml_service_url: ML_SERVICE_URL,
    ml_service_health: mlHealth,
    ai_key_present: Boolean(GEMINI_API_KEY || OPENAI_API_KEY || GROQ_API_KEY)
  });
});

// Endpoint 1: Predict Recovery via Python FastAPI ML Model Bridge
app.post('/api/predict-recovery', async (req, res) => {
  try {
    const payload = req.body;
    
    // Call Python FastAPI ML Service
    const mlResponse = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: payload.amount || 12500,
        failure_reason: payload.failureReason || 'EXPIRED_CARD',
        customer_ltv: payload.customerLifetimeValue || 245000,
        past_successful_count: payload.totalSuccessfulPayments || 14,
        past_failed_count: payload.totalFailedPayments || 1,
        engagement_score: payload.engagementScore || 92,
        days_since_failure: payload.daysSinceFailure || 0,
      }),
    });

    if (mlResponse.ok) {
      const prediction = await mlResponse.json();
      
      const customExplanation = await generateAIExplanation({
        failureReason: payload.failureReason || 'EXPIRED_CARD',
        amount: payload.amount || 12500,
        ltv: payload.customerLifetimeValue || 245000,
        pastSuccessful: payload.totalSuccessfulPayments || 14,
        prob: prediction.recovery_probability_percentage,
        action: prediction.recommended_action
      });

      if (customExplanation) {
        prediction.ai_explanation = customExplanation;
      }

      return res.json({ success: true, source: 'Python FastAPI RandomForest ML', data: prediction });
    }
    
    throw new Error(`ML Service responded with code ${mlResponse.status}`);
  } catch (err) {
    console.warn('ML Service bridge call fallback:', err.message);
    
    const amount = req.body.amount || 12500;
    const prob = req.body.failureReason === 'EXPIRED_CARD' ? 91 : 74;
    const expected = Math.round(amount * (prob / 100));

    return res.json({
      success: true,
      source: 'Fallback Rule Model',
      data: {
        recovery_probability: prob / 100,
        recovery_probability_percentage: prob,
        risk_score: 24,
        risk_level: 'Low',
        expected_recovery: expected,
        recommended_action: 'PAYMENT_UPDATE_REMINDER',
        recommended_time: 'Today at 06:30 PM',
        ai_explanation: `RecoverAI predicts a high recovery probability (${prob}%) because the customer has a strong payment history and high lifetime value. Since the failure reason is ${req.body.failureReason || 'EXPIRED_CARD'}, a 1-click payment update link is recommended.`,
        factors: [
          { name: 'Past Payment Reliability', weight: 25, impact: 'Positive', score: 88, detail: '14 past successful transactions' },
          { name: 'Failure Code Benchmark', weight: 20, impact: 'Positive', score: 90, detail: 'Card expiration carries high recoverability' },
        ]
      }
    });
  }
});

// Endpoint 2: Razorpay Test Order Creation
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'receipt_rec_01' } = req.body;
    
    if (isRazorpayConfigured && razorpay) {
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency,
        receipt,
        payment_capture: 1,
      });
      return res.json({ success: true, order });
    }

    return res.json({
      success: true,
      demo_mode: true,
      order: {
        id: `order_demo_${Date.now()}`,
        entity: 'order',
        amount: Math.round(amount * 100),
        currency,
        receipt,
        status: 'created',
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint 3: Razorpay Webhook Endpoint
app.post('/api/razorpay/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    
    if (isRazorpayConfigured && razorpayWebhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', razorpayWebhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature !== expectedSignature) {
        return res.status(400).json({ status: 'invalid_signature' });
      }
    }

    const event = req.body.event;
    console.log(`Received Razorpay Webhook Event: ${event}`);

    if (event === 'payment.failed') {
      const paymentEntity = req.body.payload.payment.entity;
      const txnId = paymentEntity.id;
      const amount = paymentEntity.amount / 100;
      const failureReason = paymentEntity.error_code || 'EXPIRED_CARD';
      const customerEmail = paymentEntity.email || 'customer@example.com';

      console.log(`Processing Failed Payment: ${txnId} for ${customerEmail} (₹${amount})`);

      try {
        const mlRes = await fetch(`${ML_SERVICE_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount,
            failure_reason: failureReason,
            customer_ltv: amount * 10,
            past_successful_count: 10,
            past_failed_count: 1,
            engagement_score: 85,
            days_since_failure: 0,
          }),
        });

        if (mlRes.ok) {
          const prediction = await mlRes.json();
          console.log(`AI Prediction for ${txnId}: ${prediction.recovery_probability_percentage}% probability, Action: ${prediction.recommended_action}`);
        }
      } catch (mlErr) {
        console.warn('ML Prediction error during webhook processing:', mlErr.message);
      }
    }

    res.json({ status: 'ok', event_processed: event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bind explicitly on '0.0.0.0' for Render host binding
app.listen(PORT, '0.0.0.0', () => {
  console.log(`RecoverAI Express Backend running on http://0.0.0.0:${PORT}`);
});
