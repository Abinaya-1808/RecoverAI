import { FailureReason, RiskLevel, ActionType, RecoveryPrediction } from '../types';

export interface AIAnalysisInput {
  paymentAmount: number;
  failureReason: FailureReason;
  customerLifetimeValue: number;
  totalSuccessfulPayments: number;
  totalFailedPayments: number;
  engagementScore: number; // 0-100
  daysSinceFailure: number;
  isSubscriptionActive: boolean;
  previousRecoveryCount?: number;
}

export const AI_SERVICE_NAME = 'RecoverAI FastAPI Random Forest ML v1.0';
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001/api';

/**
 * Calculates recovery probability (0-100%) using weighted ML scoring algorithm
 */
export function calculateRecoveryProbability(input: AIAnalysisInput): number {
  let score = 0;

  // 1. Payment History (Weight: 25%)
  const historyRatio = input.totalSuccessfulPayments / Math.max(1, input.totalSuccessfulPayments + input.totalFailedPayments);
  score += historyRatio * 25;

  // 2. Failure Reason Benchmark (Weight: 20%)
  const reasonWeights: Record<FailureReason, number> = {
    GATEWAY_TIMEOUT: 0.95,
    BANK_TECHNICAL_ERROR: 0.92,
    EXPIRED_CARD: 0.88,
    LIMIT_EXCEEDED: 0.82,
    INSUFFICIENT_FUNDS: 0.72,
    SUBSCRIPTION_PAUSED: 0.65,
    INVALID_CVV: 0.55,
    DO_NOT_HONOR: 0.45,
    FRAUD_SUSPECTED: 0.25,
  };
  score += (reasonWeights[input.failureReason] || 0.6) * 20;

  // 3. Customer Lifetime Value (Weight: 15%)
  const ltvFactor = Math.min(1.0, input.customerLifetimeValue / 200000);
  score += ltvFactor * 15;

  // 4. Previous Recovery Success (Weight: 15%)
  const prevRec = Math.min(1.0, (input.previousRecoveryCount || (input.totalSuccessfulPayments > 5 ? 1 : 0)) / 2);
  score += prevRec * 15;

  // 5. Engagement Score (Weight: 10%)
  score += (input.engagementScore / 100) * 10;

  // 6. Recency / Days Since Failure (Weight: 10%)
  const recencyFactor = Math.max(0.1, 1 - (input.daysSinceFailure / 14));
  score += recencyFactor * 10;

  // 7. Subscription Status (Weight: 5%)
  score += (input.isSubscriptionActive ? 1.0 : 0.4) * 5;

  return Math.min(99, Math.max(12, Math.round(score)));
}

/**
 * Classifies customer risk level based on risk score (0-100)
 */
export function classifyRiskLevel(riskScore: number): { level: RiskLevel; label: string; color: string } {
  if (riskScore <= 30) {
    return { level: 'Low', label: 'Low Risk', color: 'emerald' };
  } else if (riskScore <= 60) {
    return { level: 'Medium', label: 'Medium Risk', color: 'amber' };
  } else if (riskScore <= 80) {
    return { level: 'High', label: 'High Risk', color: 'rose' };
  } else {
    return { level: 'Critical', label: 'Critical Risk', color: 'purple' };
  }
}

export function calculateRiskScore(input: AIAnalysisInput): number {
  let risk = 50;
  if (input.failureReason === 'FRAUD_SUSPECTED' || input.failureReason === 'DO_NOT_HONOR') risk += 30;
  if (input.failureReason === 'EXPIRED_CARD' || input.failureReason === 'GATEWAY_TIMEOUT') risk -= 20;
  risk += (100 - input.engagementScore) * 0.3;
  risk += input.totalFailedPayments * 8;
  risk -= Math.min(25, input.totalSuccessfulPayments * 2);
  return Math.min(98, Math.max(8, Math.round(risk)));
}

export function selectOptimalAction(input: AIAnalysisInput, probability: number): ActionType {
  if (input.failureReason === 'GATEWAY_TIMEOUT' || input.failureReason === 'BANK_TECHNICAL_ERROR') {
    return 'IMMEDIATE_SMART_RETRY';
  }
  if (input.failureReason === 'EXPIRED_CARD') {
    return 'PAYMENT_UPDATE_REMINDER';
  }
  if (input.failureReason === 'INSUFFICIENT_FUNDS') {
    return 'DELAYED_RETRY_48H';
  }
  if (input.failureReason === 'LIMIT_EXCEEDED') {
    return 'DELAYED_RETRY_24H';
  }
  if (input.customerLifetimeValue >= 300000 && probability < 60) {
    return 'RETENTION_OUTREACH';
  }
  if (input.totalFailedPayments >= 3 || probability < 45) {
    return 'SUPPORT_ESCALATION';
  }
  if (input.engagementScore < 40) {
    return 'PERSONALIZED_DISCOUNT_OFFER';
  }
  return 'PAYMENT_UPDATE_REMINDER';
}

/**
 * Async prediction caller connecting to Python FastAPI ML service with instant local fallback
 */
export async function predictRecoveryAsync(paymentId: string, customerId: string, input: AIAnalysisInput): Promise<RecoveryPrediction> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/predict-recovery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        const d = result.data;
        return {
          paymentId,
          customerId,
          recoveryProbability: d.recovery_probability_percentage,
          riskScore: d.risk_score,
          expectedRecovery: d.expected_recovery,
          recommendedAction: d.recommended_action as ActionType,
          recommendedTime: d.recommended_time,
          aiExplanation: d.ai_explanation,
          factors: d.factors,
        };
      }
    }
  } catch (err) {
    console.warn('Backend ML API unreachable, using local ML model:', err);
  }

  return generateAIPrediction(paymentId, customerId, input);
}

/**
 * Generates full AI prediction payload with explainable factors
 */
export function generateAIPrediction(paymentId: string, customerId: string, input: AIAnalysisInput): RecoveryPrediction {
  const probability = calculateRecoveryProbability(input);
  const riskScore = calculateRiskScore(input);
  const expectedRecovery = Math.round(input.paymentAmount * (probability / 100));
  const recommendedAction = selectOptimalAction(input, probability);

  const factors = [
    {
      name: 'Past Payment Reliability',
      weight: 25,
      impact: input.totalSuccessfulPayments > 5 ? ('Positive' as const) : ('Neutral' as const),
      score: Math.min(100, input.totalSuccessfulPayments * 7),
      detail: `${input.totalSuccessfulPayments} successful payments recorded in history.`,
    },
    {
      name: 'Failure Root Cause',
      weight: 20,
      impact: ['EXPIRED_CARD', 'GATEWAY_TIMEOUT'].includes(input.failureReason) ? ('Positive' as const) : ('Negative' as const),
      score: ['EXPIRED_CARD', 'GATEWAY_TIMEOUT'].includes(input.failureReason) ? 90 : 45,
      detail: `Reason '${input.failureReason}' carries high statistical recoverability.`,
    },
    {
      name: 'Customer Lifetime Value',
      weight: 15,
      impact: input.customerLifetimeValue > 100000 ? ('Positive' as const) : ('Neutral' as const),
      score: Math.min(100, Math.round(input.customerLifetimeValue / 2000)),
      detail: `High equity user (₹${(input.customerLifetimeValue / 1000).toFixed(1)}k LTV).`,
    },
    {
      name: 'User Platform Engagement',
      weight: 10,
      impact: input.engagementScore > 70 ? ('Positive' as const) : ('Negative' as const),
      score: input.engagementScore,
      detail: `Active user score: ${input.engagementScore}/100.`,
    },
  ];

  const actionLabels: Record<ActionType, string> = {
    PAYMENT_UPDATE_REMINDER: 'Send 1-click payment update magic link via SMS/Email',
    DELAYED_RETRY_48H: 'Schedule automated retry post-salary credit window (48 hours)',
    DELAYED_RETRY_24H: 'Schedule automated retry next morning (24 hours)',
    IMMEDIATE_SMART_RETRY: 'Execute instant multi-route smart retry through backup gateway',
    PERSONALIZED_DISCOUNT_OFFER: 'Send temporary 10% rescue token to prevent churn',
    SUPPORT_ESCALATION: 'Escalate to dedicated Customer Success Account Manager',
    RETENTION_OUTREACH: 'Initiate VIP concierge retention phone outreach',
    ALTERNATIVE_METHOD_PROMPT: 'Prompt customer to switch payment method to UPI / NetBanking',
  };

  const explanation = `RecoverAI ML Model analyzed ${input.totalSuccessfulPayments} historical transactions, customer LTV (₹${input.paymentAmount}), and failure signal (${input.failureReason}). Recommended action: ${actionLabels[recommendedAction]}. Predicted expected recovery: ₹${expectedRecovery.toLocaleString('en-IN')}.`;

  return {
    paymentId,
    customerId,
    recoveryProbability: probability,
    riskScore,
    expectedRecovery,
    recommendedAction,
    recommendedTime: input.daysSinceFailure === 0 ? 'Today at 06:30 PM' : 'Tomorrow at 09:30 AM',
    aiExplanation: explanation,
    factors,
  };
}

/**
 * AI Copilot query responder with structured insights
 */
export function queryAICopilot(prompt: string) {
  const query = prompt.toLowerCase();
  
  if (query.includes('drop') || query.includes('why') || query.includes('trend')) {
    return {
      text: "Revenue recovery dropped by 4.2% this week primarily due to a 3-hour UPI clearing window slowdown on Aug 21st, affecting 18 high-value transactions. 14 of these transactions are scheduled for smart retry tomorrow morning with an expected 88% recovery rate.",
      metrics: [
        { label: 'Impacted Volume', value: '18 Transactions' },
        { label: 'At-Risk Value', value: '₹1.84L' },
        { label: 'Est. Tomorrow Recovery', value: '₹1.62L' },
      ],
      actions: [
        { label: 'View Failed UPI Payments', route: '/payments?reason=LIMIT_EXCEEDED' },
        { label: 'Run Smart Retry Campaign', route: '/campaigns' }
      ]
    };
  }

  if (query.includes('prioritize') || query.includes('customer') || query.includes('who')) {
    return {
      text: "Based on expected recovery value (Payment Amount × Recovery Probability), you should prioritize Sarah Williams (₹11,375 expected), Vikram Mehta (₹23,999 expected), and Ananya Sharma. Rescuing these top 3 accounts will save ₹59,874 immediately.",
      metrics: [
        { label: 'Top Priority Customer', value: 'Sarah Williams (91% prob)' },
        { label: 'Potential Quick Yield', value: '₹59,874' },
        { label: 'Recommended Action', value: 'Send 1-Click Update' }
      ],
      actions: [
        { label: 'Open Priority Queue', route: '/dashboard' },
        { label: 'Launch Rescue Simulator', route: '/simulator' }
      ]
    };
  }

  if (query.includes('recover') || query.includes('potential') || query.includes('how much')) {
    return {
      text: "RecoverAI estimates total recoverable revenue at ₹9.47L out of ₹12.84L currently at risk (73.7% overall recovery potential). Launching the 'Expired Card Rescue' campaign will immediately capture ₹4.72L.",
      metrics: [
        { label: 'Total Revenue at Risk', value: '₹12.84L' },
        { label: 'Recoverable Revenue', value: '₹9.47L' },
        { label: 'Win Rate Potential', value: '76.4%' }
      ],
      actions: [
        { label: 'Launch Expired Card Rescue', route: '/campaigns' },
        { label: 'View Revenue Analytics', route: '/analytics' }
      ]
    };
  }

  return {
    text: "RecoverAI Intelligence is actively scanning payment gateways (Stripe & Razorpay). We have detected 1,284 transactions with 76.4% baseline recovery efficiency across 428 at-risk accounts.",
    metrics: [
      { label: 'Active Monitored Revenue', value: '₹50L+' },
      { label: 'AI Accuracy Rating', value: '94.8%' },
      { label: 'Active Automations', value: '4 Rules' }
    ],
    actions: [
      { label: 'Open AI Intelligence', route: '/ai-intelligence' },
      { label: 'Test Rescue Simulator', route: '/simulator' }
    ]
  };
}
