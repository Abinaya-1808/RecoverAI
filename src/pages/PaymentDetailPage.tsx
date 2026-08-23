import React from 'react';
import { 
  X, CreditCard, User, Sparkles, CheckCircle2, ShieldCheck, 
  BrainCircuit, Clock, AlertTriangle, ArrowRight, Play 
} from 'lucide-react';
import { Payment } from '../types';
import { useApp } from '../context/AppContext';
import { RiskBadge, PaymentStatusBadge } from '../components/common/Badge';
import { ProbabilityMeter } from '../components/common/ProbabilityMeter';
import { ExplanationBreakdown } from '../components/common/ExplanationBreakdown';

interface PaymentDetailPageProps {
  payment: Payment | null;
  onClose: () => void;
  onNavigateCustomer?: (customerId: string) => void;
  onNavigateSimulator?: () => void;
}

export const PaymentDetailPage: React.FC<PaymentDetailPageProps> = ({ 
  payment, onClose, onNavigateCustomer, onNavigateSimulator 
}) => {
  const { formatCurrency, rescuePayment } = useApp();

  if (!payment) return null;

  const handleRescue = async () => {
    await rescuePayment(payment.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl glass-card rounded-2xl border border-slate-700/80 p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono">{payment.transactionId}</h2>
                <PaymentStatusBadge status={payment.status} />
                <RiskBadge level={payment.riskLevel} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Customer: <span className="text-white font-semibold">{payment.customerName}</span> ({payment.customerEmail})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Payment Amount</div>
            <div className="text-xl font-extrabold text-white font-mono mt-1">{formatCurrency(payment.amount)}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Failure Reason</div>
            <div className="text-sm font-bold text-rose-400 font-mono mt-1">{payment.failureReason}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Recovery Prob.</div>
            <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1">{payment.recoveryProbability}%</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Expected Yield</div>
            <div className="text-xl font-extrabold text-cyan-400 font-mono mt-1">
              {formatCurrency(payment.expectedRecoveryValue || Math.round(payment.amount * (payment.recoveryProbability / 100)))}
            </div>
          </div>
        </div>

        {/* Gateway Log & Technical Telemetry */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
            <span>Gateway Response Payload Log</span>
            <span>Attempt #{payment.attemptNumber}</span>
          </div>
          <p className="text-xs font-mono text-rose-300 bg-slate-900 p-2.5 rounded border border-slate-800">
            {payment.gatewayResponse}
          </p>
        </div>

        {/* Explainable AI Diagnosis Section */}
        <ExplanationBreakdown
          explanation={payment.aiExplanation}
          recommendedAction={payment.recommendedAction}
          factors={[
            { name: 'Payment History', weight: 25, impact: 'Positive', score: 88, detail: '14 past successful transactions recorded' },
            { name: 'Failure Code Benchmark', weight: 20, impact: 'Positive', score: 92, detail: `Reason '${payment.failureReason}' carries high recovery statistical yield` },
            { name: 'Account Equity', weight: 15, impact: 'Positive', score: 85, detail: 'High equity SaaS account' },
          ]}
        />

        {/* Action Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Failed at: {new Date(payment.failedAt).toLocaleString()}
          </div>

          <div className="flex items-center gap-3">
            {onNavigateSimulator && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateSimulator();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" /> Test in Simulator
              </button>
            )}

            {payment.status !== 'RECOVERED' ? (
              <button
                onClick={handleRescue}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Rescue Payment Now ({formatCurrency(payment.amount)})
              </button>
            ) : (
              <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Payment Rescued & Recovered 🎉
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
