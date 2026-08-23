import React, { useState } from 'react';
import { Cpu, Plus, Play, Pause, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AutomationCenterPageProps {
  onNavigate: (path: string) => void;
}

export const AutomationCenterPage: React.FC<AutomationCenterPageProps> = ({ onNavigate }) => {
  const { automationRules, toggleAutomationRule, createAutomationRule, formatCurrency } = useApp();
  const [showBuilder, setShowBuilder] = useState(false);

  // Rule Builder state
  const [ruleName, setRuleName] = useState('Custom Expired Card Auto-Rescue');
  const [conditionReason, setConditionReason] = useState('EXPIRED_CARD');
  const [minProb, setMinProb] = useState(70);
  const [action, setAction] = useState('PAYMENT_UPDATE_REMINDER');
  const [waitHours, setWaitHours] = useState(24);

  const handleCreateRule = () => {
    createAutomationRule({
      name: ruleName,
      description: `IF failure == ${conditionReason} AND prob > ${minProb}% THEN ${action} WAIT ${waitHours}h`,
      conditionReason: conditionReason as any,
      minProbability: minProb,
      action: action as any,
      waitHours,
    });
    setShowBuilder(false);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-emerald-400" />
            Automation Center & Visual Rule Builder
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build autonomous trigger workflows: IF failure condition THEN rescue action.
          </p>
        </div>

        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Build New Rule
        </button>
      </div>

      {/* Visual Rule Builder Box */}
      {showBuilder && (
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-6 animate-in fade-in duration-200">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" /> Visual Rule Logic Builder
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] text-slate-400 uppercase font-sans">IF Failure Condition</div>
              <select 
                value={conditionReason}
                onChange={(e) => setConditionReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-bold"
              >
                <option value="EXPIRED_CARD">EXPIRED_CARD</option>
                <option value="INSUFFICIENT_FUNDS">INSUFFICIENT_FUNDS</option>
                <option value="GATEWAY_TIMEOUT">GATEWAY_TIMEOUT</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] text-slate-400 uppercase font-sans">AND Min Probability</div>
              <input 
                type="number" 
                value={minProb} 
                onChange={(e) => setMinProb(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-emerald-400 font-bold"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] text-slate-400 uppercase font-sans">THEN Action</div>
              <select 
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-bold"
              >
                <option value="PAYMENT_UPDATE_REMINDER">1-Click Update Link</option>
                <option value="DELAYED_RETRY_48H">Retry in 48h</option>
                <option value="IMMEDIATE_SMART_RETRY">Immediate Smart Retry</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] text-slate-400 uppercase font-sans">WAIT Delay Window</div>
              <input 
                type="number" 
                value={waitHours} 
                onChange={(e) => setWaitHours(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-bold"
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={() => setShowBuilder(false)} 
              className="px-4 py-2 rounded-xl bg-slate-900 text-xs text-slate-400"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateRule} 
              className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Save & Activate Automation Rule
            </button>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="space-y-4">
        {automationRules.map((rule) => (
          <div key={rule.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">{rule.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  rule.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                }`}>
                  {rule.isActive ? 'ACTIVE' : 'PAUSED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{rule.description}</p>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <div className="text-right font-mono text-xs">
                <div className="text-slate-400">Triggers: <span className="text-white font-bold">{rule.triggerCount}</span></div>
                <div className="text-emerald-400 font-bold">Rescued: {formatCurrency(rule.recoveredAmount)}</div>
              </div>

              <button
                onClick={() => toggleAutomationRule(rule.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  rule.isActive ? 'bg-slate-800 text-rose-400 border border-slate-700' : 'bg-emerald-500 text-slate-950'
                }`}
              >
                {rule.isActive ? 'Pause Rule' : 'Activate Rule'}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
