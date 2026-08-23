import React, { useState } from 'react';
import { BrainCircuit, ArrowRight, ShieldCheck, Mail, Lock, User, Building } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthPageProps {
  onNavigate: (path: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('alex.vance@revtech.io');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Alex Vance');
  const [company, setCompany] = useState('Apex SaaS Technologies');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // If Supabase is configured, try Supabase authentication
    if (isSupabaseConfigured) {
      try {
        if (mode === 'signup') {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name, company } }
          });
          if (error) throw error;
        } else if (mode === 'login') {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
        }
      } catch (err: any) {
        console.warn('Supabase auth notice (using demo fallback):', err.message);
      }
    }

    // Demo Mode instant redirect
    setTimeout(() => {
      setLoading(false);
      if (mode === 'signup') {
        onNavigate('/onboarding');
      } else {
        onNavigate('/dashboard');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex items-center justify-center p-6 select-none relative overflow-hidden">
      
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass-card rounded-2xl border border-slate-700/80 p-8 shadow-2xl space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div 
            onClick={() => onNavigate('/')} 
            className="inline-flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-6 h-6 text-slate-950" />
            </div>
            <span className="font-extrabold text-white text-xl tracking-tight">
              Recover<span className="text-emerald-400 font-mono">AI</span>
            </span>
          </div>

          <h2 className="text-lg font-bold text-white">
            {mode === 'login' && 'Sign in to your RecoverAI workspace'}
            {mode === 'signup' && 'Create your RecoverAI account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="text-xs text-slate-400">
            Intelligent revenue recovery command platform
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Demo Account Ready
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Email: alex.vance@revtech.io (Pre-filled)
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    placeholder="Alex Vance"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company / Organization</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    placeholder="Apex SaaS Technologies"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="name@company.com"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In to Command Center'}
                  {mode === 'signup' && 'Create Account & Continue'}
                  {mode === 'forgot' && 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation Switcher */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
          {mode === 'login' ? (
            <>
              <button onClick={() => setMode('signup')} className="hover:text-emerald-400">
                Need an account? Sign Up
              </button>
              <button onClick={() => setMode('forgot')} className="hover:text-emerald-400">
                Forgot password?
              </button>
            </>
          ) : (
            <button onClick={() => setMode('login')} className="hover:text-emerald-400 mx-auto">
              Back to Login
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
