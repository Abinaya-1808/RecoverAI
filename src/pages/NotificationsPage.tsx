import React from 'react';
import { Bell, AlertOctagon, AlertTriangle, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NotificationsPageProps {
  onNavigate: (path: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { notifications, markNotificationRead } = useApp();

  return (
    <div className="space-y-6 pb-12">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-400" />
            Notifications & Intelligence Alerts Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Critical payment decline warnings, automated rescue notifications, and ML model updates.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              markNotificationRead(n.id);
              if (n.actionLink) onNavigate(n.actionLink);
            }}
            className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer ${
              n.read ? 'border-slate-800 bg-slate-900/40 text-slate-400' : 'border-emerald-500/30 bg-emerald-500/5 text-slate-100 font-medium'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {n.type === 'critical' && <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
                {n.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
                {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                {n.type === 'ai_insight' && <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />}

                <div>
                  <h3 className="font-bold text-white text-sm">{n.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {n.actionLink && (
                  <span className="block text-xs font-semibold text-emerald-400 mt-2 flex items-center justify-end gap-1">
                    Take Action <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
