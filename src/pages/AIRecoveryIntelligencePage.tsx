import React, { useState } from 'react';
import { 
  BrainCircuit, Cpu, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, 
  Activity, ToggleLeft, ToggleRight, Sliders, Layers, RefreshCw 
} from 'lucide-react';
import { ProbabilityMeter } from '../components/common/ProbabilityMeter';
import { ExplanationBreakdown } from '../components/common/ExplanationBreakdown';
import { FailureReason } from '../types';
import { calculateRecoveryProbability, selectOptimalAction } from '../services/aiService';

interface AIRecoveryIntelligencePageProps {
  onNavigate: (path: string) => void;
}

export const AIRecoveryIntelligencePage: React.FC<AIRecoveryIntelligencePageProps> = ({ onNavigate }) => {
  const [requireHumanApproval, setRequireHumanApproval] = useState(false);

  // Interactive Sandbox Sliders for Judges
  const [sandboxAmount, setSandboxAmount] = useState(24999);
  const [sandboxPastWins, setSandboxPastWins] = useState(18);
  const [sandboxEngagement, setSandboxEngagement] = useState(88);
  const [sandboxReason, setSandboxReason] = useState<FailureReason>('EXPIRED_CARD');
  const [activeNode, setActiveNode] = useState<number>(4);

  // Derived Sandbox Calculation
  const sandboxProbability = calculateRecoveryProbability({
    paymentAmount: sandboxAmount,
    failureReason: sandboxReason,
    customerLifetimeValue: sandboxAmount * 12,
    totalSuccessfulPayments: sandboxPastWins,
    totalFailedPayments: 1,
    engagementScore: sandboxEngagement,
    daysSinceFailure: 0,
    isSubscriptionActive: true,
  });

  const sandboxAction = selectOptimalAction({
    paymentAmount: sandboxAmount,
    failureReason: sandboxReason,
    customerLifetimeValue: sandboxAmount * 12,
    totalSuccessfulPayments: sandboxPastWins,
    totalFailedPayments: 1,
    engagementScore: sandboxEngagement,
    daysSinceFailure: 0,
    isSubscriptionActive: true,
  }, sandboxProbability);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-emerald-400" />
            AI Recovery Intelligence & Decision Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Weighted ML scoring models, decision trees, and responsible AI governance.
          </p>
        </div>

        {/* Responsible AI Human Override Toggle */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-medium">Human Approval Required</span>
          <button 
            onClick={() => setRequireHumanApproval(!requireHumanApproval)}
            className="text-emerald-400 hover:scale-105 transition-transform"
          >
            {requireHumanApproval ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* INTERACTIVE ML MODEL SANDBOX FOR HACKATHON JUDGES */}
      <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-950 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 mb-1">
              <Sliders className="w-3 h-3 text-emerald-400" /> Interactive Judge Sandbox
            </div>
            <h2 className="text-lg font-bold text-white">Live ML Probability Calibration Sandbox</h2>
            <p className="text-xs text-slate-400">Tweak parameters below to see the ML model re-calculate probabilities in real time.</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-mono">Simulated ML Score</span>
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">{sandboxProbability}%</span>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
          
          <div className="space-y-2">
            <div className="flex justify-between text-slate-300 font-medium">
              <span>Payment Amount</span>
              <span className="font-mono font-bold text-white">₹{sandboxAmount.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="2499" 
              max="99999" 
              step="2500"
              value={sandboxAmount} 
              onChange={(e) => setSandboxAmount(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-slate-300 font-medium">
              <span>Past Successful Wins</span>
              <span className="font-mono font-bold text-white">{sandboxPastWins} payments</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="40" 
              value={sandboxPastWins} 
              onChange={(e) => setSandboxPastWins(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-slate-300 font-medium">
              <span>User Engagement Score</span>
              <span className="font-mono font-bold text-white">{sandboxEngagement}/100</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={sandboxEngagement} 
              onChange={(e) => setSandboxEngagement(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-slate-300 font-medium">
              <span>Failure Reason Signal</span>
              <span className="font-mono font-bold text-emerald-400">{sandboxReason}</span>
            </div>
            <select
              value={sandboxReason}
              onChange={(e) => setSandboxReason(e.target.value as FailureReason)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono"
            >
              <option value="EXPIRED_CARD">EXPIRED_CARD (High Yield)</option>
              <option value="GATEWAY_TIMEOUT">GATEWAY_TIMEOUT (High Yield)</option>
              <option value="INSUFFICIENT_FUNDS">INSUFFICIENT_FUNDS (Med Yield)</option>
              <option value="DO_NOT_HONOR">DO_NOT_HONOR (Low Yield)</option>
              <option value="FRAUD_SUSPECTED">FRAUD_SUSPECTED (Critical Risk)</option>
            </select>
          </div>

        </div>

        {/* Live Calculation Gauge Bar */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <ProbabilityMeter probability={sandboxProbability} size="lg" />
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Recommended Action Output: <span className="text-emerald-400 font-bold font-mono">{sandboxAction.replace(/_/g, ' ')}</span></span>
            <span>Expected Recovery: <span className="text-cyan-400 font-bold font-mono">₹{Math.round(sandboxAmount * (sandboxProbability / 100)).toLocaleString()}</span></span>
          </div>
        </div>

      </div>

      {/* Model Scoring Weights Grid */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" /> ML Probability Scoring Model Inputs (Weights)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-sans font-bold">Past Payment Reliability</div>
            <div className="text-emerald-400 font-bold text-base">25% Weight</div>
            <div className="text-[10px] text-slate-500 font-sans">Ratio of successful past billings</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-sans font-bold">Failure Reason Signal</div>
            <div className="text-cyan-400 font-bold text-base">20% Weight</div>
            <div className="text-[10px] text-slate-500 font-sans">Card expiry vs insufficient funds</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-sans font-bold">Customer LTV Equity</div>
            <div className="text-violet-400 font-bold text-base">15% Weight</div>
            <div className="text-[10px] text-slate-500 font-sans">Historical cumulative revenue</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-sans font-bold">Past Rescue Success</div>
            <div className="text-amber-400 font-bold text-base">15% Weight</div>
            <div className="text-[10px] text-slate-500 font-sans">Historical response to magic links</div>
          </div>
        </div>
      </div>

      {/* Animated AI Decision Engine Graph Visualization */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
              AI Decision Pipeline Graph Node Architecture
            </h3>
            <p className="text-xs text-slate-400">Live signal flow from payment gateway error to intervention execution</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
            Output: 91% Probability
          </span>
        </div>

        {/* Node Graph Flow */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-center text-xs font-mono">
          {[
            { id: 1, node: 'Input Signals', desc: 'Gateway Code EXPIRED_CARD', color: 'border-slate-700 bg-slate-900' },
            { id: 2, node: 'Payment Intel', desc: '14 Past Successful Payments', color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' },
            { id: 3, node: 'Customer Intel', desc: '₹2.45L High Equity Account', color: 'border-violet-500/40 bg-violet-500/10 text-violet-300' },
            { id: 4, node: 'Risk Engine', desc: 'Low Risk Rating (24/100)', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
            { id: 5, node: 'Recovery ML', desc: 'Calculated 91% Probability', color: 'border-emerald-500/60 bg-emerald-500/20 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
            { id: 6, node: 'Action Output', desc: '1-Click Magic Link SMS', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
          ].map((item) => (
            <div 
              key={item.id} 
              onClick={() => setActiveNode(item.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${item.color} ${activeNode === item.id ? 'ring-2 ring-emerald-400 scale-105' : ''}`}
            >
              <div className="font-bold font-sans text-xs text-white">{item.node}</div>
              <div className="text-[10px] text-slate-300 font-mono leading-tight mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Explainable AI Sample */}
      <ExplanationBreakdown
        explanation="The payment failed because the customer's card expired (EXPIRED_CARD). The customer has made 14 successful payments previously and has high engagement. RecoverAI predicts a 91% recovery probability."
        recommendedAction="PAYMENT_UPDATE_REMINDER"
      />

    </div>
  );
};
