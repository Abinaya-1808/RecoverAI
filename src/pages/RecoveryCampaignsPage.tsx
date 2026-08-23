import React, { useState } from 'react';
import { Target, Plus, Play, Pause, Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Campaign } from '../types';

interface RecoveryCampaignsPageProps {
  onNavigate: (path: string) => void;
}

export const RecoveryCampaignsPage: React.FC<RecoveryCampaignsPageProps> = ({ onNavigate }) => {
  const { campaigns, createCampaign, formatCurrency } = useApp();
  const [showBuilder, setShowBuilder] = useState(false);

  // Campaign Builder State
  const [builderStep, setBuilderStep] = useState(1);
  const [name, setName] = useState('UPI Mandate Auto-Rescue');
  const [targetSegment, setTargetSegment] = useState('All Customers with Expired Cards (LTV > ₹50,000)');
  const [estimatedRevenue, setEstimatedRevenue] = useState(472000);
  const [customersCount, setCustomersCount] = useState(218);
  const [predictedSuccessRate, setPredictedSuccessRate] = useState(82);

  const handleLaunchCampaign = () => {
    createCampaign({
      name,
      description: 'Automated AI recovery campaign flow',
      targetSegment,
      customersTargeted: customersCount,
      revenueAtRisk: estimatedRevenue,
      predictedRecovery: Math.round(estimatedRevenue * (predictedSuccessRate / 100)),
    });
    setShowBuilder(false);
    setBuilderStep(1);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            Automated Recovery Campaigns
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Segment targeted rescue workflows with AI timing & messaging optimization.
          </p>
        </div>

        <button
          onClick={() => setShowBuilder(true)}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create New Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((camp) => (
          <div key={camp.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  camp.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {camp.status}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Created {camp.createdAt}</span>
              </div>

              <h3 className="font-bold text-white text-base">{camp.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{camp.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 font-mono text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-sans">Targeted</div>
                <div className="font-bold text-white mt-0.5">{camp.customersTargeted} accounts</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-sans">Recovered Yield</div>
                <div className="font-bold text-emerald-400 mt-0.5">{formatCurrency(camp.actualRecovered || camp.predictedRecovery)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Builder Multi-Step Modal */}
      {showBuilder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass-card rounded-2xl border border-slate-700 p-6 md:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Create AI Recovery Campaign Flow</h3>
              </div>
              <button onClick={() => setShowBuilder(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Builder Steps */}
            {builderStep === 1 && (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-300">Campaign Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />

                <label className="block text-xs font-bold text-slate-300">Target Audience Segment</label>
                <select
                  value={targetSegment}
                  onChange={(e) => setTargetSegment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="All Customers with Expired Cards (LTV > ₹50,000)">All Customers with Expired Cards (LTV &gt; ₹50,000)</option>
                  <option value="Insufficient Funds B2C Monthly Accounts">Insufficient Funds B2C Monthly Accounts</option>
                  <option value="Enterprise VIP High Risk Accounts">Enterprise VIP High Risk Accounts</option>
                </select>
              </div>
            )}

            {builderStep === 2 && (
              <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-4 text-center">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">AI Expected Revenue Rescue Preview</h4>

                <div className="grid grid-cols-3 gap-4 font-mono">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-sans">Estimated Revenue Recovery</div>
                    <div className="text-lg font-extrabold text-emerald-400 mt-1">{formatCurrency(estimatedRevenue)}</div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-sans">Targeted Customers</div>
                    <div className="text-lg font-extrabold text-white mt-1">{customersCount}</div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-sans">Predicted Success Rate</div>
                    <div className="text-lg font-extrabold text-violet-400 mt-1">{predictedSuccessRate}%</div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowBuilder(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              {builderStep === 1 ? (
                <button
                  onClick={() => setBuilderStep(2)}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-1.5"
                >
                  Review AI Forecast <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleLaunchCampaign}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" /> Launch Campaign Now
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
