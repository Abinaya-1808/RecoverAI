import React, { useState } from 'react';
import { 
  Building, CreditCard, Layers, CheckCircle2, ArrowRight, 
  Sparkles, BrainCircuit, ShieldCheck, Plug, Zap
} from 'lucide-react';

interface OnboardingWizardProps {
  onNavigate: (path: string) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('Apex SaaS Technologies');
  const [businessType, setBusinessType] = useState('B2B SaaS / Subscriptions');
  const [monthlyVolume, setMonthlyVolume] = useState('₹50L - ₹1Cr');
  const [avgPaymentValue, setAvgPaymentValue] = useState('12500');
  const [paymentProvider, setPaymentProvider] = useState('Stripe + Razorpay');
  const [isGeneratingBaseline, setIsGeneratingBaseline] = useState(false);

  const handleNext = () => {
    if (step < 7) {
      if (step === 6) {
        // Trigger AI baseline generation animation on step 7
        setIsGeneratingBaseline(true);
        setTimeout(() => setIsGeneratingBaseline(false), 1500);
      }
      setStep(step + 1);
    } else {
      onNavigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex items-center justify-center p-6 select-none relative">
      
      {/* Glow Backdrop */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-xl glass-card rounded-2xl border border-slate-700/80 p-8 shadow-2xl space-y-6">
        
        {/* Progress Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-400" />
            <span className="font-extrabold text-white text-sm">RecoverAI Onboarding</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
            Step {step} of 7
          </span>
        </div>

        {/* Step 1: Company Name */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-white">What is your company or organization name?</h3>
            <p className="text-xs text-slate-400">This will be your primary workspace identifier.</p>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Step 2: Business Type */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-white">Select your primary business model</h3>
            <div className="grid grid-cols-1 gap-2">
              {['B2B SaaS / Subscriptions', 'B2C Subscriptions & Consumer Apps', 'E-Commerce Recurring Orders', 'Digital Services & Agencies'].map((type) => (
                <button
                  key={type}
                  onClick={() => setBusinessType(type)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    businessType === type ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Monthly Transaction Volume */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-white">Estimated Monthly Transaction Volume</h3>
            <div className="grid grid-cols-2 gap-3">
              {['< ₹10L / mo', '₹10L - ₹50L / mo', '₹50L - ₹1Cr / mo', '₹1Cr+ / mo'].map((vol) => (
                <button
                  key={vol}
                  onClick={() => setMonthlyVolume(vol)}
                  className={`p-3 rounded-xl border text-center text-xs font-mono font-bold transition-all ${
                    monthlyVolume === vol ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {vol}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Average Payment Value */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-white">Average Payment / Subscription Value</h3>
            <p className="text-xs text-slate-400">Used for calculating expected recovery metrics.</p>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-500 font-mono text-xs">₹</span>
              <input
                type="number"
                value={avgPaymentValue}
                onChange={(e) => setAvgPaymentValue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Step 5: Payment Provider */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-white">Primary Payment Gateway Provider</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Stripe + Razorpay', 'Stripe Only', 'Razorpay Only', 'PayPal & Chargebee'].map((prov) => (
                <button
                  key={prov}
                  onClick={() => setPaymentProvider(prov)}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                    paymentProvider === prov ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {prov}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Connect Integration */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-white">Connect Gateway API Keys</h3>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span>Stripe Live Secret Key</span>
                <span className="text-[10px] text-emerald-400 font-mono">Connected (Encrypted)</span>
              </div>
              <input 
                type="password" 
                readOnly 
                value="sk_live_51Mxx99283719283719" 
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-400" 
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> 256-bit AES Encryption Verified
            </div>
          </div>
        )}

        {/* Step 7: AI Baseline Generation */}
        {step === 7 && (
          <div className="space-y-4 text-center py-4 animate-in fade-in duration-300">
            {isGeneratingBaseline ? (
              <div className="space-y-3">
                <BrainCircuit className="w-12 h-12 text-emerald-400 mx-auto animate-spin" />
                <h3 className="text-base font-bold text-white">Generating AI Recovery Baseline...</h3>
                <p className="text-xs text-slate-400">Scanning failure signals and calibrating ML recovery model.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-white">Your RecoverAI Command Center is Ready!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  We calibrated your baseline ML model for {companyName}. Baseline predicted recovery rate is <span className="text-emerald-400 font-bold font-mono">76.4%</span>.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={isGeneratingBaseline}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
        >
          <span>{step === 7 ? 'Enter Command Center' : 'Continue Step'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
