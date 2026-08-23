import React from 'react';
import { 
  LayoutDashboard, ShieldAlert, CreditCard, Users, BrainCircuit, 
  BarChart3, Target, Cpu, PlayCircle, FileText, Plug, Settings, 
  Bot, LogOut, ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCopilot: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, onOpenCopilot }) => {
  const { user, organization } = useApp();

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Recovery Center', path: '/recovery-center', icon: ShieldAlert },
    { label: 'Failed Payments', path: '/payments', icon: CreditCard, badge: '128' },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'AI Intelligence', path: '/ai-intelligence', icon: BrainCircuit, highlight: true },
    { label: 'Revenue Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Recovery Campaigns', path: '/campaigns', icon: Target },
    { label: 'Automation Center', path: '/automation', icon: Cpu },
    { label: 'Rescue Simulator', path: '/simulator', icon: PlayCircle, star: true },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Integrations', path: '/integrations', icon: Plug },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#080d1a] border-r border-slate-800/80 h-screen sticky top-0 z-30 select-none">
      
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div 
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight flex items-center gap-1">
              Recover<span className="text-emerald-400 font-mono">AI</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-mono tracking-wider uppercase">
              Revenue Rescue OS
            </span>
          </div>
        </div>
      </div>

      {/* Organization Selector Badge */}
      <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-xs text-slate-300">
        <div className="truncate">
          <div className="text-[10px] uppercase font-mono text-slate-400">Organization</div>
          <div className="font-semibold text-white truncate">{organization.name}</div>
        </div>
        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
          PRO
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.star && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 animate-pulse">
                  STAR
                </span>
              )}

              {item.badge && !item.star && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* AI Copilot Launcher Button */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={onOpenCopilot}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-violet-600/20 border border-emerald-500/30 text-emerald-300 hover:border-emerald-500/60 transition-all group"
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>AI Copilot</span>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-8 h-8 rounded-full border border-emerald-500/40 object-cover shrink-0" 
          />
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">{user.name}</div>
            <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('/auth')}
          title="Sign Out"
          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

    </aside>
  );
};
