import React, { useState } from 'react';
import { Plug, CheckCircle2, ShieldCheck, ArrowRight, X } from 'lucide-react';

interface IntegrationsPageProps {
  onNavigate: (path: string) => void;
}

export const IntegrationsPage: React.FC<IntegrationsPageProps> = ({ onNavigate }) => {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const integrations = [
    { name: 'Stripe', category: 'Payment Gateway', status: 'Connected', desc: 'Sync card failure codes, webhook telemetry, and customer billing profiles.', icon: '⚡' },
    { name: 'Razorpay', category: 'Payment Gateway', status: 'Connected', desc: 'UPI AutoPay mandate rescue, HDFC/ICICI debit card retry loops, and 3DS authentication.', icon: '🇮🇳' },
    { name: 'PayPal', category: 'Payment Gateway', status: 'Available', desc: 'Global recurring agreement failure recovery and express checkout rescue.', icon: '🅿️' },
    { name: 'Shopify', category: 'E-Commerce', status: 'Available', desc: 'Recover abandoned recurring subscription orders directly inside checkout.', icon: '🛍️' },
    { name: 'Chargebee', category: 'Subscription Mgmt', status: 'Available', desc: 'Deep sync with dunning schedules, invoice status, and churn retention workflows.', icon: '🐝' },
    { name: 'Salesforce', category: 'Enterprise CRM', status: 'Available', desc: 'Automatically route high-value failed accounts to account owners.', icon: '☁️' },
    { name: 'HubSpot', category: 'Marketing Automation', status: 'Available', desc: 'Trigger personalized email rescue workflows and task escalations.', icon: '🟠' },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Plug className="w-6 h-6 text-emerald-400" />
            Integrations & Payment Gateway Connectors
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Connect your payment processors, billing systems, and enterprise CRMs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <div key={item.name} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  item.status === 'Connected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{item.name}</h3>
                <div className="text-[10px] text-slate-500 font-mono uppercase">{item.category}</div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>

            <button
              onClick={() => setSelectedIntegration(item.name)}
              className={`w-full py-2 rounded-xl font-extrabold text-xs transition-all ${
                item.status === 'Connected' ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-500/40' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              }`}
            >
              {item.status === 'Connected' ? 'Manage Settings' : 'Connect Integration'}
            </button>
          </div>
        ))}
      </div>

      {/* Connect Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-card rounded-2xl border border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Connect {selectedIntegration} Integration</h3>
              <button onClick={() => setSelectedIntegration(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block text-slate-300 font-medium">API Secret Key / Webhook Secret</label>
              <input 
                type="password" 
                defaultValue="sk_live_51Mxx99283719283719"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono" 
              />
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> OAuth 2.0 & Encrypted Webhook Signature Active
              </div>
            </div>

            <button
              onClick={() => setSelectedIntegration(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg"
            >
              Test Connection & Save
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
