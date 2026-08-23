export type FailureReason = 
  | 'EXPIRED_CARD'
  | 'INSUFFICIENT_FUNDS'
  | 'GATEWAY_TIMEOUT'
  | 'DO_NOT_HONOR'
  | 'FRAUD_SUSPECTED'
  | 'LIMIT_EXCEEDED'
  | 'INVALID_CVV'
  | 'BANK_TECHNICAL_ERROR'
  | 'SUBSCRIPTION_PAUSED';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type PaymentStatus = 
  | 'FAILED'
  | 'RECOVERING'
  | 'RECOVERED'
  | 'LOST'
  | 'SCHEDULED'
  | 'MANUAL_REVIEW';

export type ActionType = 
  | 'PAYMENT_UPDATE_REMINDER'
  | 'DELAYED_RETRY_24H'
  | 'DELAYED_RETRY_48H'
  | 'IMMEDIATE_SMART_RETRY'
  | 'PERSONALIZED_DISCOUNT_OFFER'
  | 'SUPPORT_ESCALATION'
  | 'RETENTION_OUTREACH'
  | 'ALTERNATIVE_METHOD_PROMPT';

export type Currency = 'INR' | 'USD' | 'EUR';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  avatarUrl?: string;
  customerSince: string;
  lifetimeValue: number;
  engagementScore: number; // 0 - 100
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  churnProbability: number; // %
  recoveryProbability: number; // %
  status: 'Active' | 'At Risk' | 'Churned' | 'Recovered';
  revenueAtRisk: number;
  totalSuccessfulPayments: number;
  totalFailedPayments: number;
}

export interface Subscription {
  id: string;
  customerId: string;
  planName: string;
  amount: number;
  currency: Currency;
  billingCycle: 'Monthly' | 'Annual';
  status: 'Active' | 'Past Due' | 'Canceled' | 'Paused';
  startDate: string;
  renewalDate: string;
}

export interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subscriptionId?: string;
  transactionId: string;
  amount: number;
  currency: Currency;
  paymentMethod: string;
  status: PaymentStatus;
  failureReason: FailureReason;
  failureCode: string;
  gatewayResponse: string;
  attemptNumber: number;
  createdAt: string;
  failedAt: string;
  recoveredAt?: string;
  recoveryProbability: number; // %
  riskLevel: RiskLevel;
  recommendedAction: ActionType;
  expectedRecoveryValue: number;
  aiExplanation: string;
}

export interface RecoveryPrediction {
  paymentId: string;
  customerId: string;
  recoveryProbability: number;
  riskScore: number;
  expectedRecovery: number;
  recommendedAction: ActionType;
  recommendedTime: string;
  aiExplanation: string;
  factors: {
    name: string;
    weight: number;
    impact: 'Positive' | 'Negative' | 'Neutral';
    score: number;
    detail: string;
  }[];
}

export interface RecoveryAction {
  id: string;
  paymentId: string;
  customerId: string;
  customerName: string;
  actionType: ActionType;
  status: 'Pending' | 'Scheduled' | 'In Progress' | 'Completed' | 'Failed';
  scheduledAt: string;
  executedAt?: string;
  result?: string;
  recoveredAmount?: number;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  targetSegment: string;
  status: 'Active' | 'Paused' | 'Draft' | 'Completed';
  customersTargeted: number;
  revenueAtRisk: number;
  predictedRecovery: number;
  actualRecovered: number;
  successRate: number;
  createdAt: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  conditionReason?: FailureReason | 'ALL';
  minProbability?: number;
  action: ActionType;
  waitHours?: number;
  fallbackAction?: ActionType;
  isActive: boolean;
  triggerCount: number;
  recoveredAmount: number;
}

export interface NotificationItem {
  id: string;
  type: 'critical' | 'warning' | 'success' | 'ai_insight';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionLink?: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'urgent';
  category: 'payment_trend' | 'risk_warning' | 'opportunity' | 'model_update';
  createdAt: string;
  affectedCustomersCount?: number;
  potentialRevenueImpact?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: 'Owner' | 'Admin' | 'Member';
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  monthlyTransactionVolume: string;
  averagePaymentValue: number;
  currency: Currency;
  primaryProvider: string;
}
