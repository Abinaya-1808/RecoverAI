import React from 'react';
import { 
  ArrowLeft, User, CreditCard, Sparkles, BrainCircuit, 
  Calendar, CheckCircle2, AlertTriangle, ShieldCheck, Mail, Phone, Building 
} from 'lucide-react';
import { Customer } from '../types';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/common/Badge';
import { ProbabilityMeter } from '../components/common/ProbabilityMeter';
import { MetricCard } from '../components/common/MetricCard';

interface Customer360PageProps {
  customer: Customer | null;
  onBack: () => void;
  onNavigateSimulator?: () => void;
}

export const Customer360Page: React.FC<Customer360PageProps> = ({ customer, onBack, onNavigateSimulator }) => {
  const { formatCurrency, subscriptions, payments } = useApp();

  if (!customer) return null;

  const customerSub = subscriptions.find(s => s.customerId === customer.id) || {
    planName: 'Enterprise Growth Tier',
    amount: customer.revenueAtRisk || 12500,
    billingCycle: 'Monthly',
    status: customer.status === 'At Risk' ? 'Past Due' : 'Active',
    renewalDate: '2026-09-01',
  };

  const customerPayments = payments.filter(p => p.customerId === customer.id);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Customers List
        </button>

        <span className="text-xs font-mono text-emerald-400">Customer ID: {customer.id}</span>
      </div>

      {/* Customer Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src={customer.avatarUrl} alt={customer.name} className="w-16 h-16 rounded-2xl border-2 border-emerald-500/40 object-cover shadow-lg" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">{customer.name}</h2>
              <RiskBadge level={customer.riskLevel} />
            </div>
            <p className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-slate-500" /> {customer.company}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-500" /> {customer.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-500" /> {customer.phone}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateSimulator && (
            <button
              onClick={onNavigateSimulator}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all"
            >
              Test Rescue Scenario
            </button>
          )}
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Lifetime Value</div>
          <div className="text-base font-extrabold text-white font-mono mt-1">{formatCurrency(customer.lifetimeValue)}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Successful Payments</div>
          <div className="text-base font-extrabold text-emerald-400 font-mono mt-1">{customer.totalSuccessfulPayments}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Failed Payments</div>
          <div className="text-base font-extrabold text-rose-400 font-mono mt-1">{customer.totalFailedPayments}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Revenue at Risk</div>
          <div className="text-base font-extrabold text-rose-400 font-mono mt-1">{formatCurrency(customer.revenueAtRisk)}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Recovery Prob.</div>
          <div className="text-base font-extrabold text-emerald-400 font-mono mt-1">{customer.recoveryProbability}%</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Churn Risk</div>
          <div className="text-base font-extrabold text-violet-400 font-mono mt-1">{customer.churnProbability}%</div>
        </div>
      </div>

      {/* AI Customer Intelligence Box */}
      <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">AI Customer Intelligence & Strategy Recommendation</h3>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed space-y-2">
          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Recommended Strategy
          </div>
          <p>
            This customer has a strong payment history ({customer.totalSuccessfulPayments} past wins) but recently experienced card expiration friction. Avoid aggressive discounting. Recommend a personalized payment-update reminder followed by an automatic retry after 24 hours.
          </p>
        </div>
      </div>

      {/* Subscription & History Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Subscription Info */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Subscription</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Plan Name</span>
              <span className="font-bold text-white">{customerSub.planName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Monthly Amount</span>
              <span className="font-mono font-bold text-emerald-400">{formatCurrency(customerSub.amount)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Status</span>
              <span className="font-semibold text-rose-400">{customerSub.status}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Next Renewal</span>
              <span className="font-mono text-slate-300">{customerSub.renewalDate}</span>
            </div>
          </div>
        </div>

        {/* History Timeline */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Payment Telemetry</h3>
          <div className="space-y-3">
            {customerPayments.length > 0 ? (
              customerPayments.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white font-mono">{p.transactionId}</div>
                    <div className="text-[10px] text-slate-400">{p.failureReason}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-white">{formatCurrency(p.amount)}</div>
                    <span className="text-[10px] text-emerald-400 font-bold">{p.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 py-4 text-center">No recent payment declines recorded.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
