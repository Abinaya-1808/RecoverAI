import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, BrainCircuit } from 'lucide-react';
import { ActionType } from '../../types';

interface ExplanationBreakdownProps {
  explanation: string;
  recommendedAction: ActionType;
  factors?: {
    name: string;
    weight: number;
    impact: 'Positive' | 'Negative' | 'Neutral';
    score: number;
    detail: string;
  }[];
}

export const ExplanationBreakdown: React.FC<ExplanationBreakdownProps> = ({
  explanation,
  recommendedAction,
  factors = [],
}) => {
  const actionLabels: Record<ActionType, { title: string; desc: string }> = {
    PAYMENT_UPDATE_REMINDER: {
      title: 'Personalized Payment Update Reminder',
      desc: 'Send a 1-click magic link via SMS/WhatsApp & Email allowing card update without logging in.',
    },
    DELAYED_RETRY_48H: {
      title: 'Delayed Smart Retry (48 Hours)',
      desc: 'Schedule transaction re-attempt aligned with salary credit / bank clearing window.',
    },
    DELAYED_RETRY_24H: {
      title: 'Delayed Smart Retry (24 Hours)',
      desc: 'Schedule retry next morning at 09:30 AM post daily NPCI clearing ceiling.',
    },
    IMMEDIATE_SMART_RETRY: {
      title: 'Immediate Multi-Route Smart Retry',
      desc: 'Re-route transaction instantly through secondary gateway endpoint (Razorpay fallback).',
    },
    PERSONALIZED_DISCOUNT_OFFER: {
      title: 'Retention-Focused Discount Token',
      desc: 'Offer temporary 10% credit to re-engage user before churn risks elevate.',
    },
    SUPPORT_ESCALATION: {
      title: 'Dedicated CS Account Manager Escalation',
      desc: 'Route account directly to Customer Success team for human relationship outreach.',
    },
    RETENTION_OUTREACH: {
      title: 'VIP Concierge Phone Outreach',
      desc: 'Initiate priority call from senior account specialist.',
    },
    ALTERNATIVE_METHOD_PROMPT: {
      title: 'Alternative Payment Method Prompt (UPI/NetBanking)',
      desc: 'Prompt customer to switch card payment to instant UPI / Corporate NetBanking.',
    },
  };

  const currentAction = actionLabels[recommendedAction] || actionLabels.PAYMENT_UPDATE_REMINDER;

  return (
    <div className="glass-card p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <BrainCircuit className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              Why did RecoverAI recommend this strategy?
            </h4>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Explainable AI
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {explanation}
          </p>
        </div>
      </div>

      {/* Recommended Strategy Box */}
      <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-700/60 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
        <div>
          <div className="text-xs font-semibold text-emerald-400">
            Recommended Action: {currentAction.title}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentAction.desc}
          </p>
        </div>
      </div>

      {/* Factors List */}
      {factors.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Weighted Decision Signals
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {factors.map((f, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-xs flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-200 flex items-center gap-1">
                    {f.impact === 'Positive' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    {f.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                    {f.detail}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-emerald-400 font-bold">{f.weight}% weight</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Human-in-the-loop oversight enabled
        </span>
        <span className="font-mono text-slate-400">Model Accuracy: 94.8%</span>
      </div>
    </div>
  );
};
