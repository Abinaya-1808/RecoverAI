import React, { useState } from 'react';
import { 
  PlayCircle, Sparkles, BrainCircuit, ShieldCheck, CheckCircle2, 
  ArrowRight, Zap, RefreshCw, AlertCircle, Terminal, Layers 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FailureReason, RiskLevel, ActionType } from '../types';
import { 
  calculateRecoveryProbability, calculateRiskScore, 
  classifyRiskLevel, selectOptimalAction, generateAIPrediction 
} from '../services/aiService';
import { ProbabilityMeter } from '../components/common/ProbabilityMeter';
import { ExplanationBreakdown } from '../components/common/ExplanationBreakdown';

interface RescueSimulatorPageProps {
  onNavigate: (path: string) => void;
}

export const RescueSimulatorPage: React.FC<RescueSimulatorPageProps> = ({ onNavigate }) => {
  const { formatCurrency, rescuePayment } = useApp();

  // Input Parameter States
  const [customerName, setCustomerName] = useState('Sarah Williams');
  const [paymentAmount, setPaymentAmount] = useState(12500);
  const [failureReason, setFailureReason] = useState<FailureReason>('EXPIRED_CARD');
  const [lifetimeValue, setLifetimeValue] = useState(245000);
  const [successfulPayments, setSuccessfulPayments] = useState(14);
  const [failedPayments, setFailedPayments] = useState(1);
  const [subscriptionType, setSubscriptionType] = useState('Enterprise Growth Tier');
  const [daysSinceFailure, setDaysSinceFailure] = useState(0);
  const [engagementScore, setEngagementScore] = useState(92);

  // Simulator Workflow States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);

  const [isRescuing, setIsRescuing] = useState(false);
  const [rescueStep, setRescueStep] = useState(0);
  const [hasRescued, setHasRescued] = useState(false);

  // Preset scenarios loader for quick judge testing
  const loadPresetScenario = (scenario: number) => {
    setHasRescued(false);
    if (scenario === 1) {
      setCustomerName('Sarah Williams');
      setPaymentAmount(12500);
      setFailureReason('EXPIRED_CARD');
      setLifetimeValue(245000);
      setSuccessfulPayments(14);
      setFailedPayments(1);
      setEngagementScore(92);
    } else if (scenario === 2) {
      setCustomerName('Priya Iyer');
      setPaymentAmount(24999);
      setFailureReason('LIMIT_EXCEEDED');
      setLifetimeValue(560000);
      setSuccessfulPayments(26);
      setFailedPayments(2);
      setEngagementScore(79);
    } else if (scenario === 3) {
      setCustomerName('Elena Rostova');
      setPaymentAmount(49999);
      setFailureReason('BANK_TECHNICAL_ERROR');
      setLifetimeValue(890000);
      setSuccessfulPayments(28);
      setFailedPayments(1);
      setEngagementScore(94);
    } else {
      setCustomerName('Rohan Deshmukh');
      setPaymentAmount(12500);
      setFailureReason('FRAUD_SUSPECTED');
      setLifetimeValue(120000);
      setSuccessfulPayments(4);
      setFailedPayments(3);
      setEngagementScore(32);
    }
  };

  // Derived AI Calculation
  const aiInput = {
    paymentAmount,
    failureReason,
    customerLifetimeValue: lifetimeValue,
    totalSuccessfulPayments: successfulPayments,
    totalFailedPayments: failedPayments,
    engagementScore,
    daysSinceFailure,
    isSubscriptionActive: true,
  };

  const prediction = generateAIPrediction('sim_pay_01', 'sim_cust_01', aiInput);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setHasAnalyzed(false);
    setHasRescued(false);
    setAnalysisStep(1);

    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => {
        if (prev >= 5) {
          clearInterval(stepInterval);
          setIsAnalyzing(false);
          setHasAnalyzed(true);
          return 5;
        }
        return prev + 1;
      });
    }, 300);
  };

  const handleRescuePayment = async () => {
    setIsRescuing(true);
    setRescueStep(1); // FAILED

    setTimeout(() => setRescueStep(2), 500); // INITIATED
    setTimeout(() => setRescueStep(3), 1000); // RETRY

    setTimeout(async () => {
      setRescueStep(4); // SUCCESS
      setHasRescued(true);
      setIsRescuing(false);

      // Trigger context global revenue update & confetti
      await rescuePayment('pay_1001');
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Hackathon Star Interactive Feature</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold text-white flex items-center gap-2">
            <PlayCircle className="w-7 h-7 text-emerald-400" />
            AI Revenue Rescue Simulator
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            See how RecoverAI turns a failed payment into recovered revenue in real time.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/dashboard')}
          className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white hover:border-emerald-500/50 transition-all"
        >
          View Dashboard Totals
        </button>
      </div>

      {/* Preset Scenario Chips */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800/80 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mr-2">
          <Layers className="w-4 h-4 text-emerald-400" /> Quick Judge Scenarios:
        </span>
        <button
          onClick={() => loadPresetScenario(1)}
          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
        >
          Preset 1: Card Expiry (91% Prob)
        </button>
        <button
          onClick={() => loadPresetScenario(2)}
          className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
        >
          Preset 2: UPI Limit (82% Prob)
        </button>
        <button
          onClick={() => loadPresetScenario(3)}
          className="px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-semibold transition-colors"
        >
          Preset 3: Bank Outage (96% Prob)
        </button>
        <button
          onClick={() => loadPresetScenario(4)}
          className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
        >
          Preset 4: Fraud Flag (31% Risk)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Input Panel */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" /> Simulation Parameters
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Payment Amount (₹)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Failure Reason</label>
                <select
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value as FailureReason)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="EXPIRED_CARD">EXPIRED_CARD</option>
                  <option value="INSUFFICIENT_FUNDS">INSUFFICIENT_FUNDS</option>
                  <option value="GATEWAY_TIMEOUT">GATEWAY_TIMEOUT</option>
                  <option value="DO_NOT_HONOR">DO_NOT_HONOR</option>
                  <option value="LIMIT_EXCEEDED">LIMIT_EXCEEDED</option>
                  <option value="BANK_TECHNICAL_ERROR">BANK_TECHNICAL_ERROR</option>
                  <option value="FRAUD_SUSPECTED">FRAUD_SUSPECTED</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Customer LTV (₹)</label>
                <input
                  type="number"
                  value={lifetimeValue}
                  onChange={(e) => setLifetimeValue(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Successful Payments</label>
                <input
                  type="number"
                  value={successfulPayments}
                  onChange={(e) => setSuccessfulPayments(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Days Since Failure</label>
                <input
                  type="number"
                  value={daysSinceFailure}
                  onChange={(e) => setDaysSinceFailure(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Engagement Score (0-100)</label>
                <input
                  type="number"
                  value={engagementScore}
                  onChange={(e) => setEngagementScore(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isAnalyzing ? (
                <span>Analyzing Telemetry Signals...</span>
              ) : (
                <>
                  <BrainCircuit className="w-4 h-4" />
                  <span>Analyze with RecoverAI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Execution & Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Real-time Terminal Execution Scanner */}
          {isAnalyzing && (
            <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-slate-950 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Terminal className="w-4 h-4 animate-pulse" />
                  <span>RecoverAI Live Terminal Scanner</span>
                </div>
                <span className="text-[10px] text-slate-500">Latency: 0.12s</span>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className={`flex items-center gap-2 ${analysisStep >= 1 ? 'text-emerald-400' : 'text-slate-600'}`}>
                  <span>[0.08s]</span> <CheckCircle2 className="w-3.5 h-3.5" /> Parsing gateway error signal code '{failureReason}'...
                </div>
                <div className={`flex items-center gap-2 ${analysisStep >= 2 ? 'text-emerald-400' : 'text-slate-600'}`}>
                  <span>[0.18s]</span> <CheckCircle2 className="w-3.5 h-3.5" /> Fetching customer telemetry ({successfulPayments} past wins, ₹{lifetimeValue.toLocaleString()} LTV)...
                </div>
                <div className={`flex items-center gap-2 ${analysisStep >= 3 ? 'text-emerald-400' : 'text-slate-600'}`}>
                  <span>[0.26s]</span> <CheckCircle2 className="w-3.5 h-3.5" /> Computing customer churn risk rating score...
                </div>
                <div className={`flex items-center gap-2 ${analysisStep >= 4 ? 'text-emerald-400' : 'text-slate-600'}`}>
                  <span>[0.34s]</span> <CheckCircle2 className="w-3.5 h-3.5" /> Evaluating weighted recovery probability model...
                </div>
                <div className={`flex items-center gap-2 ${analysisStep >= 5 ? 'text-emerald-400 font-bold' : 'text-slate-600'}`}>
                  <span>[0.42s]</span> <CheckCircle2 className="w-3.5 h-3.5 font-bold" /> Strategy selected: Optimal 1-Click Magic Link intervention ready!
                </div>
              </div>
            </div>
          )}

          {/* AI Result Card */}
          {hasAnalyzed && !isAnalyzing && (
            <div className="glass-card p-6 rounded-2xl border border-emerald-500/40 bg-slate-900/90 space-y-6 shadow-2xl animate-in fade-in duration-300">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" /> AI Diagnosis Result
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded border border-emerald-500/30">
                  ML Model Confidence: High
                </span>
              </div>

              {/* Result Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-400 font-mono">Recovery Prob.</div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                    {prediction.recoveryProbability}%
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-400 font-mono">Customer Risk</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">
                    Low Risk
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-400 font-mono">Best Contact Time</div>
                  <div className="text-xs font-bold text-slate-200 mt-1 font-mono">
                    Today, 6:30 PM
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-400 font-mono">Expected Recovery</div>
                  <div className="text-xl font-extrabold text-cyan-400 font-mono mt-1">
                    {formatCurrency(prediction.expectedRecovery)}
                  </div>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <div className="text-xs font-bold text-emerald-300">Recommended Action:</div>
                <div className="text-sm font-extrabold text-white">
                  Personalized Payment Update Reminder (1-Click Magic Link)
                </div>
              </div>

              {/* Explainable AI */}
              <ExplanationBreakdown
                explanation={prediction.aiExplanation}
                recommendedAction={prediction.recommendedAction}
                factors={prediction.factors}
              />

              {/* Rescue Flow Step Animation Bar */}
              {isRescuing && (
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 font-mono text-xs">
                  <div className="text-emerald-400 font-bold text-center">Executing Payment Rescue...</div>
                  <div className="flex items-center justify-around">
                    <span className={rescueStep >= 1 ? 'text-rose-400 font-bold' : 'text-slate-600'}>FAILED</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className={rescueStep >= 2 ? 'text-cyan-400 font-bold' : 'text-slate-600'}>INITIATED</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className={rescueStep >= 3 ? 'text-amber-400 font-bold' : 'text-slate-600'}>RETRY</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className={rescueStep >= 4 ? 'text-emerald-400 font-extrabold' : 'text-slate-600'}>SUCCESS</span>
                  </div>
                </div>
              )}

              {/* RESCUE PAYMENT CTA BUTTON */}
              {!hasRescued ? (
                <button
                  onClick={handleRescuePayment}
                  disabled={isRescuing}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 fill-slate-950" />
                  <span>RESCUE PAYMENT NOW ({formatCurrency(paymentAmount)})</span>
                </button>
              ) : (
                <div className="p-6 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-center space-y-2 shadow-[0_0_40px_rgba(16,185,129,0.4)] animate-in zoom-in-95 duration-300">
                  <div className="text-2xl font-black text-emerald-300 font-mono flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    {formatCurrency(paymentAmount)} RECOVERED 🎉
                  </div>
                  <p className="text-xs text-slate-200 font-semibold">
                    Payment successfully rescued! Your main dashboard metrics have been updated dynamically.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
