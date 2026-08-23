import React from 'react';
import { ShieldAlert, Zap, Cpu, ArrowRight, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RiskBadge, PaymentStatusBadge } from '../components/common/Badge';

interface RecoveryCenterPageProps {
  onNavigate: (path: string) => void;
  onSelectPayment: (payment: any) => void;
}

export const RecoveryCenterPage: React.FC<RecoveryCenterPageProps> = ({ onNavigate, onSelectPayment }) => {
  const { payments, totals, formatCurrency, rescuePayment } = useApp();

  const atRiskPayments = payments.filter(p => p.status === 'FAILED' || p.status === 'RECOVERING');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
            Payment Recovery Operations Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time rescue monitoring, active automation rules, and intervention queue.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/simulator')}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all"
        >
          Launch Rescue Simulator
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
          <div className="text-[10px] uppercase font-mono text-slate-400">Active Unresolved Failures</div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono mt-1">{atRiskPayments.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{formatCurrency(totals.revenueAtRisk)} exposed</div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
          <div className="text-[10px] uppercase font-mono text-slate-400">In-Progress Interventions</div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">142</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Automated retry loops active</div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
          <div className="text-[10px] uppercase font-mono text-slate-400">Rescued Today</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">₹84,500</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">7 transactions rescued</div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-violet-500/20 bg-violet-500/5">
          <div className="text-[10px] uppercase font-mono text-slate-400">Active Automations</div>
          <div className="text-2xl font-extrabold text-violet-400 font-mono mt-1">4 Rules</div>
          <div className="text-[10px] text-slate-400 mt-0.5">100% operational uptime</div>
        </div>
      </div>

      {/* Intervention Queue */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" /> Active Intervention Feed
        </h3>

        <div className="space-y-3">
          {atRiskPayments.slice(0, 5).map((pay) => (
            <div 
              key={pay.id}
              onClick={() => onSelectPayment(pay)}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{pay.customerName}</span>
                  <RiskBadge level={pay.riskLevel} />
                  <span className="text-[10px] font-mono text-slate-400">Txn: {pay.transactionId}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Failed: <span className="text-rose-400 font-mono">{pay.failureReason}</span> • Recommended Strategy: <span className="text-emerald-400 font-bold">{pay.recommendedAction.replace(/_/g, ' ')}</span>
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="font-mono font-bold text-white text-sm">{formatCurrency(pay.amount)}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">{pay.recoveryProbability}% prob</div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    rescuePayment(pay.id);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
                >
                  Rescue Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
