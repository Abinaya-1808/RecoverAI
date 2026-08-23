import React, { useState } from 'react';
import { Settings, User, Building, Bell, BrainCircuit, ShieldCheck, CreditCard, Users, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SettingsPageProps {
  onNavigate: (path: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { user, organization } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'ai' | 'security' | 'team'>('profile');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-400" />
            System & Workspace Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage organization configuration, AI recovery thresholds, and team permissions.
          </p>
        </div>

        {savedMsg && (
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Settings Saved Successfully
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'profile', label: 'User Profile', icon: User },
          { id: 'company', label: 'Company Info', icon: Building },
          { id: 'ai', label: 'AI Preferences', icon: BrainCircuit },
          { id: 'security', label: 'Security & RLS', icon: ShieldCheck },
          { id: 'team', label: 'Team Members', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors ${
                activeTab === tab.id 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6 max-w-2xl">
        
        {activeTab === 'profile' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm">Personal Profile</h3>
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <input type="text" defaultValue={user.name} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Email Address</label>
              <input type="email" defaultValue={user.email} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold" />
            </div>
          </div>
        )}

        {activeTab === 'company' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm">Organization Details</h3>
            <div>
              <label className="block text-slate-400 mb-1">Company Name</label>
              <input type="text" defaultValue={organization.name} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Industry Sector</label>
              <input type="text" defaultValue={organization.industry} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold" />
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm">AI Rescue Engine Parameters</h3>
            <div>
              <label className="block text-slate-400 mb-1">Minimum Probability Threshold for Automatic Rescue (%)</label>
              <input type="number" defaultValue="70" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold" />
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm">Supabase PostgreSQL Row Level Security</h3>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono">
              RLS Policy Status: ACTIVE (Users only access authorized organization payload)
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm">Team Members</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">Alex Vance</div>
                  <div className="text-[10px] text-slate-400">alex.vance@revtech.io</div>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Owner</span>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all"
        >
          Save Changes
        </button>

      </form>

    </div>
  );
};
