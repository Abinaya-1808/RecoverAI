import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Customer, Payment, Subscription, Campaign, AutomationRule, 
  NotificationItem, AIInsight, UserProfile, Organization, Currency 
} from '../types';
import { 
  mockUser, mockOrganization, mockCustomers, mockSubscriptions, 
  mockPayments, mockCampaigns, mockAutomationRules, mockNotifications, mockAIInsights 
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppContextType {
  user: UserProfile;
  organization: Organization;
  customers: Customer[];
  payments: Payment[];
  subscriptions: Subscription[];
  campaigns: Campaign[];
  automationRules: AutomationRule[];
  notifications: NotificationItem[];
  insights: AIInsight[];
  currency: Currency;
  setCurrency: (c: Currency) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  formatCurrency: (amount: number) => string;
  rescuePayment: (paymentId: string) => Promise<{ success: boolean; amount: number; customerName: string }>;
  loadDemoData: () => void;
  resetDemoData: () => void;
  markNotificationRead: (id: string) => void;
  toggleAutomationRule: (id: string) => void;
  createCampaign: (campaign: Partial<Campaign>) => void;
  createAutomationRule: (rule: Partial<AutomationRule>) => void;
  totals: {
    revenueAtRisk: number;
    recoverableRevenue: number;
    revenueRecovered: number;
    recoveryRate: number;
    customersAtRiskCount: number;
    failedPaymentsCount: number;
    customersRescuedCount: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'recoverai_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [organization, setOrganization] = useState<Organization>(mockOrganization);
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_customers');
    return saved ? JSON.parse(saved) : mockCustomers;
  });
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_payments');
    return saved ? JSON.parse(saved) : mockPayments;
  });
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(mockAutomationRules);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [insights] = useState<AIInsight[]>(mockAIInsights);
  const [currency, setCurrency] = useState<Currency>('INR');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Sync state to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_payments', JSON.stringify(payments));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_customers', JSON.stringify(customers));
  }, [payments, customers]);

  // Derived Totals
  const revenueAtRisk = payments
    .filter(p => p.status === 'FAILED' || p.status === 'RECOVERING')
    .reduce((sum, p) => sum + p.amount, 0);

  const revenueRecovered = payments
    .filter(p => p.status === 'RECOVERED')
    .reduce((sum, p) => sum + p.amount, 0);

  const recoverableRevenue = payments
    .filter(p => p.status === 'FAILED' || p.status === 'RECOVERING')
    .reduce((sum, p) => sum + Math.round(p.amount * (p.recoveryProbability / 100)), 0);

  const totalPaymentsCount = payments.length;
  const recoveredPaymentsCount = payments.filter(p => p.status === 'RECOVERED').length;
  const recoveryRate = totalPaymentsCount > 0 ? Number(((recoveredPaymentsCount / totalPaymentsCount) * 100).toFixed(1)) : 76.4;

  const customersAtRiskCount = customers.filter(c => c.status === 'At Risk').length;
  const failedPaymentsCount = payments.filter(p => p.status === 'FAILED' || p.status === 'RECOVERING').length;
  const customersRescuedCount = customers.filter(c => c.status === 'Recovered').length + recoveredPaymentsCount;

  // Currency formatter
  const formatCurrency = (amount: number): string => {
    if (currency === 'USD') {
      const usdAmount = amount / 83;
      if (usdAmount >= 100000) return `$${(usdAmount / 100000).toFixed(1)}L`;
      if (usdAmount >= 1000) return `$${(usdAmount / 1000).toFixed(1)}k`;
      return `$${Math.round(usdAmount).toLocaleString('en-US')}`;
    }
    if (currency === 'EUR') {
      const eurAmount = amount / 90;
      if (eurAmount >= 1000) return `€${(eurAmount / 1000).toFixed(1)}k`;
      return `€${Math.round(eurAmount).toLocaleString('de-DE')}`;
    }
    // Default INR ₹
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Rescue payment action function (STAR FUNCTION)
  const rescuePayment = async (paymentId: string) => {
    const targetPayment = payments.find(p => p.id === paymentId);
    if (!targetPayment) {
      return { success: false, amount: 0, customerName: '' };
    }

    const rescuedAmount = targetPayment.amount;

    // Update payment
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'RECOVERED',
          recoveredAt: new Date().toISOString(),
        };
      }
      return p;
    }));

    // Update customer status
    setCustomers(prev => prev.map(c => {
      if (c.id === targetPayment.customerId) {
        return {
          ...c,
          status: 'Recovered',
          revenueAtRisk: Math.max(0, c.revenueAtRisk - rescuedAmount),
        };
      }
      return c;
    }));

    // Add success notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      type: 'success',
      title: 'Payment Successfully Rescued! 🎉',
      message: `Recovered ${formatCurrency(rescuedAmount)} from ${targetPayment.customerName} via ${targetPayment.recommendedAction.replace(/_/g, ' ')}.`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6', '#3b82f6']
      });
    } catch (e) {
      // Ignore if confetti fails
    }

    return {
      success: true,
      amount: rescuedAmount,
      customerName: targetPayment.customerName,
    };
  };

  const loadDemoData = () => {
    setPayments(mockPayments);
    setCustomers(mockCustomers);
    localStorage.removeItem(LOCAL_STORAGE_KEY + '_payments');
    localStorage.removeItem(LOCAL_STORAGE_KEY + '_customers');
  };

  const resetDemoData = () => {
    setPayments(mockPayments);
    setCustomers(mockCustomers);
    localStorage.removeItem(LOCAL_STORAGE_KEY + '_payments');
    localStorage.removeItem(LOCAL_STORAGE_KEY + '_customers');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const toggleAutomationRule = (id: string) => {
    setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const createCampaign = (campaignData: Partial<Campaign>) => {
    const newCamp: Campaign = {
      id: `camp_${Date.now()}`,
      name: campaignData.name || 'New AI Campaign',
      description: campaignData.description || 'Custom automated recovery campaign',
      targetSegment: campaignData.targetSegment || 'Target Audience',
      status: 'Active',
      customersTargeted: campaignData.customersTargeted || 120,
      revenueAtRisk: campaignData.revenueAtRisk || 450000,
      predictedRecovery: campaignData.predictedRecovery || 360000,
      actualRecovered: 0,
      successRate: 82.0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCampaigns(prev => [newCamp, ...prev]);
  };

  const createAutomationRule = (ruleData: Partial<AutomationRule>) => {
    const newRule: AutomationRule = {
      id: `rule_${Date.now()}`,
      name: ruleData.name || 'New Custom Automation Rule',
      description: ruleData.description || 'Custom trigger rule',
      conditionReason: ruleData.conditionReason || 'EXPIRED_CARD',
      minProbability: ruleData.minProbability || 70,
      action: ruleData.action || 'PAYMENT_UPDATE_REMINDER',
      waitHours: ruleData.waitHours || 24,
      fallbackAction: ruleData.fallbackAction || 'SUPPORT_ESCALATION',
      isActive: true,
      triggerCount: 0,
      recoveredAmount: 0,
    };
    setAutomationRules(prev => [newRule, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      user,
      organization,
      customers,
      payments,
      subscriptions,
      campaigns,
      automationRules,
      notifications,
      insights,
      currency,
      setCurrency,
      isDemoMode,
      setIsDemoMode,
      formatCurrency,
      rescuePayment,
      loadDemoData,
      resetDemoData,
      markNotificationRead,
      toggleAutomationRule,
      createCampaign,
      createAutomationRule,
      totals: {
        revenueAtRisk,
        recoverableRevenue,
        revenueRecovered,
        recoveryRate,
        customersAtRiskCount,
        failedPaymentsCount,
        customersRescuedCount,
      }
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
