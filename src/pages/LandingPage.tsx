import React from 'react';
import { 
  BrainCircuit, ArrowRight, ShieldCheck, Zap, BarChart3, Play, 
  CheckCircle2, Sparkles, AlertCircle, RefreshCw, ChevronRight, Lock, Cpu, Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { formatCurrency } = useApp();

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* 1. Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('/')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <BrainCircuit className="w-5 h-5 text-slate-950" />
          </div>
          <span className="font-extrabold text-white text-lg tracking-tight">
            Recover<span className="text-emerald-400 font-mono">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
          <button onClick={() => onNavigate('/ai-intelligence')} className="hover:text-emerald-400 transition-colors">AI Intelligence</button>
          <a href="#problem" className="hover:text-emerald-400 transition-colors">Problem</a>
          <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
          <button onClick={() => onNavigate('/auth')} className="hover:text-emerald-400 transition-colors">Login</button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/simulator')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:border-emerald-500/50 transition-all"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" /> Demo Simulator
          </button>

          <button
            onClick={() => onNavigate('/dashboard')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center gap-1.5"
          >
            Start Recovering Revenue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Copy */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>AI-Powered Payment Rescue System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Recover Lost Revenue. <br />
            <span className="gradient-text-emerald">Automatically.</span>
          </h1>

          <p className="text-slate-300 text-base leading-relaxed">
            RecoverAI uses intelligent payment failure analysis, customer behavior telemetry, and AI-powered strategy selection to rescue failed payments before they become lost revenue.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2"
            >
              Launch Recovery Center <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/simulator')}
              className="px-6 py-3.5 rounded-xl glass-card border border-slate-700 hover:border-emerald-500/50 text-white font-bold text-sm transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" /> Watch AI Rescue Demo
            </button>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex items-center gap-8 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> PCI-DSS Level 1 Compliant
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" /> Stripe & Razorpay Plug & Play
            </div>
          </div>
        </div>

        {/* Right Animated Dashboard Preview */}
        <div className="lg:col-span-6 relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-violet-500/20 blur-xl opacity-75 animate-pulse-subtle"></div>
          
          <div className="relative glass-card rounded-2xl border border-slate-700/80 p-6 shadow-2xl space-y-6">
            
            {/* Live Status Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold text-white">Live AI Rescue Engine</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                76.4% Baseline Recovery Rate
              </span>
            </div>

            {/* Preview KPI Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Revenue at Risk</div>
                <div className="text-xl font-extrabold text-rose-400 font-mono mt-1">₹12.84L</div>
                <div className="text-[10px] text-slate-500 mt-0.5">1,284 failed payments</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Recoverable Revenue</div>
                <div className="text-xl font-extrabold text-cyan-400 font-mono mt-1">₹9.47L</div>
                <div className="text-[10px] text-slate-500 mt-0.5">73.7% ML confidence</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Recovered</div>
                <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1">₹7.23L</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">+₹84.5k today</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Recovery Rate</div>
                <div className="text-xl font-extrabold text-violet-400 font-mono mt-1">76.4%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Industry avg: 22%</div>
              </div>
            </div>

            {/* Animated Particle Pipeline Flow */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30">
              <div className="text-xs font-bold text-white mb-3 flex items-center justify-between">
                <span>Payment Rescue Pipeline Flow</span>
                <span className="text-[10px] font-mono text-emerald-400">Automated</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono relative">
                <div className="flex flex-col items-center gap-1 z-10">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center font-bold">
                    FAIL
                  </div>
                  <span className="text-[10px] text-slate-400">Failed</span>
                </div>

                <div className="flex-1 h-0.5 bg-gradient-to-r from-rose-500 via-cyan-500 to-emerald-500 mx-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/80 w-1/3 animate-pulse"></div>
                </div>

                <div className="flex flex-col items-center gap-1 z-10">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold">
                    AI
                  </div>
                  <span className="text-[10px] text-slate-400">Analyzed</span>
                </div>

                <div className="flex-1 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/80 w-1/3 animate-pulse"></div>
                </div>

                <div className="flex flex-col items-center gap-1 z-10">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                    WIN
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">Rescued</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* 3. Problem Section */}
      <section id="problem" className="py-20 px-6 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Every Failed Payment Is a <span className="gradient-text-emerald">Recovery Opportunity.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              A failed payment does not mean lost revenue. Standard retry routines fail because they treat every failure identically. RecoverAI diagnoses the exact root cause, understands customer risk, and triggers the optimal intervention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-3">
              <div className="text-3xl font-extrabold font-mono text-rose-400">9% - 15%</div>
              <h3 className="font-bold text-white text-sm">Failed Card Payments</h3>
              <p className="text-xs text-slate-400">Of all SaaS monthly recurring billing transactions fail globally due to expired cards & bank limits.</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-3">
              <div className="text-3xl font-extrabold font-mono text-amber-400">₹12.8L+</div>
              <h3 className="font-bold text-white text-sm">Revenue At Risk</h3>
              <p className="text-xs text-slate-400">Average recurring ARR exposed to accidental payment churn every single month.</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 space-y-3">
              <div className="text-3xl font-extrabold font-mono text-violet-400">40%</div>
              <h3 className="font-bold text-white text-sm">Involuntary Churn</h3>
              <p className="text-xs text-slate-400">Of total SaaS customer churn is involuntary — caused by payment friction, not product dissatisfaction.</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
              <div className="text-3xl font-extrabold font-mono text-emerald-400">76.4%</div>
              <h3 className="font-bold text-white text-sm">AI Recovery Yield</h3>
              <p className="text-xs text-slate-400">RecoverAI's benchmark rescue success rate across smart retries, 1-click update links & outreach.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. AI Intelligence Section (Explicit ID & Navigation) */}
      <section id="ai-intelligence" className="py-20 px-6 border-t border-slate-800/80 bg-slate-950/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-emerald-400" /> Core ML Intelligence Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Three Core Pillars of RecoverAI Intelligence</h2>
            <p className="text-slate-400 text-xs">Transforming raw payment failure signals into predicted revenue recovery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 w-fit">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg">1. Payment Failure Intelligence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Diagnoses why payments fail by analyzing gateway error codes, card expiration windows, bank clearing hours, and NPCI daily limit ceilings.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg">2. Recovery Prediction Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Random Forest ML scoring model calculates exact recovery probability (0–100%) and customer churn risk based on 20+ historical signals.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg">3. Smart Intervention Selection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Selects optimal intervention: 1-Click Update Magic Link, 48h Delayed Retry, Instant Gateway Re-routing, or CS Concierge Escalation.
              </p>
            </div>

          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onNavigate('/ai-intelligence')}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all inline-flex items-center gap-2"
            >
              <BrainCircuit className="w-4 h-4" /> Open Full AI Recovery Intelligence Engine <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. How It Works Pipeline (5 Steps) */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">5-Step Intelligent Rescue Pipeline</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How RecoverAI Operates</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          
          {[
            { step: '01', title: 'Detect', desc: 'Identify failed or at-risk transactions across Stripe, Razorpay & PayPal instantly.', color: 'emerald' },
            { step: '02', title: 'Understand', desc: 'AI analyzes 20+ signals: gateway codes, card expiry date, and past payment reliability.', color: 'cyan' },
            { step: '03', title: 'Predict', desc: 'Calculate exact recovery probability (0-100%) and customer churn risk rating.', color: 'violet' },
            { step: '04', title: 'Act', desc: 'Select optimal recovery action (Smart Retry, 1-Click Update Link, or CS Escalation).', color: 'amber' },
            { step: '05', title: 'Recover', desc: 'Track payment rescue in real time and monitor recovered revenue on your dashboard.', color: 'emerald' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3">
              <div className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded w-fit border border-emerald-500/20">
                STEP {item.step}
              </div>
              <h3 className="font-bold text-white text-base">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* 6. Pricing Section */}
      <section id="pricing" className="py-20 px-6 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Performance-Based Pricing</h2>
            <p className="text-slate-400 text-xs">We only earn when you recover revenue. Zero financial risk.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
              <div>
                <h3 className="font-bold text-white text-lg">Starter</h3>
                <p className="text-xs text-slate-400">For startups under ₹10L ARR</p>
                <div className="text-3xl font-extrabold text-white font-mono mt-4">Free</div>
                <div className="text-[11px] text-slate-500">Up to ₹50k rescued / mo</div>
              </div>
              <button 
                onClick={() => onNavigate('/dashboard')}
                className="w-full py-2.5 rounded-xl border border-slate-700 hover:border-emerald-500 text-xs font-bold text-white transition-all"
              >
                Start Free Trial
              </button>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.15)] space-y-6 relative">
              <span className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                Most Popular
              </span>
              <div>
                <h3 className="font-bold text-white text-lg">Growth AI</h3>
                <p className="text-xs text-slate-400">For scaling SaaS businesses</p>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-4">5% <span className="text-xs text-slate-400 font-sans">of recovered ARR</span></div>
                <div className="text-[11px] text-slate-400">Full AI Rescue Engine & Copilot</div>
              </div>
              <button 
                onClick={() => onNavigate('/dashboard')}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all"
              >
                Launch Recovery Center
              </button>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
              <div>
                <h3 className="font-bold text-white text-lg">Enterprise</h3>
                <p className="text-xs text-slate-400">For high-volume payment platforms</p>
                <div className="text-3xl font-extrabold text-white font-mono mt-4">Custom</div>
                <div className="text-[11px] text-slate-500">Dedicated Account Manager</div>
              </div>
              <button 
                onClick={() => onNavigate('/dashboard')}
                className="w-full py-2.5 rounded-xl border border-slate-700 hover:border-emerald-500 text-xs font-bold text-white transition-all"
              >
                Contact Sales
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Final CTA Footer */}
      <footer className="py-16 px-6 border-t border-slate-800 bg-[#05080e] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-extrabold text-white">Don't let failed payments become lost revenue.</h3>
              <p className="text-slate-400 text-xs mt-1">Let RecoverAI rescue them today.</p>
            </div>
            <button
              onClick={() => onNavigate('/dashboard')}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all"
            >
              Launch RecoverAI Command Center
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <div>© 2026 RecoverAI Inc. All rights reserved. Built for modern FinTech & SaaS.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300">Terms of Service</a>
              <a href="#" className="hover:text-slate-300">Security Audit</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
