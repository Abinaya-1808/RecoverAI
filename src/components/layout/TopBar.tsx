import React, { useState } from 'react';
import { 
  Search, Bell, Bot, RefreshCw, CheckCircle, Flame, 
  ChevronDown, ArrowUpRight, DollarSign, IndianRupee, ShieldCheck, Zap, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TopBarProps {
  onNavigate: (path: string) => void;
  onOpenCopilot: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onNavigate, onOpenCopilot }) => {
  const { 
    notifications, markNotificationRead, currency, setCurrency, 
    isDemoMode, setIsDemoMode, loadDemoData, resetDemoData, totals
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onNavigate(`/payments?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="h-16 bg-[#080d1a]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-20">
      
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search customers, transactions, failure codes (Ctrl + K)..."
          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
        />
      </form>

      {/* Mode Switcher & Action Controls */}
      <div className="flex items-center gap-3">
        
        {/* DUAL MODE TOGGLE: Demo Mode vs Live Production Mode */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 font-semibold">
            {isDemoMode ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span className="text-amber-300 font-mono text-[11px]">Demo Mode</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-emerald-300 font-mono text-[11px]">Live Production</span>
              </>
            )}
          </div>

          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            title={isDemoMode ? "Switch to Live Production Mode" : "Switch to Demo Mode"}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {isDemoMode ? <ToggleLeft className="w-6 h-6 text-amber-400" /> : <ToggleRight className="w-6 h-6 text-emerald-400" />}
          </button>

          {isDemoMode && (
            <button 
              onClick={resetDemoData}
              title="Reset Demo Dataset"
              className="text-slate-400 hover:text-emerald-400 transition-colors ml-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setCurrency('INR')}
            className={`px-2 py-0.5 rounded font-mono font-bold transition-colors ${
              currency === 'INR' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            ₹ INR
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-2 py-0.5 rounded font-mono font-bold transition-colors ${
              currency === 'USD' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            $ USD
          </button>
        </div>

        {/* Copilot Quick Launch Button */}
        <button
          onClick={onOpenCopilot}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-xl border border-slate-700/80 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-emerald-400" /> Notifications & Alerts
                </h4>
                <button
                  onClick={() => onNavigate('/notifications')}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2 my-2 max-h-72 overflow-y-auto pr-1">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.actionLink) onNavigate(n.actionLink);
                    }}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      n.read ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-slate-800/80 border-slate-700 text-slate-200 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span>{n.title}</span>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
