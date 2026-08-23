import React from 'react';
import { LayoutDashboard, CreditCard, PlayCircle, BarChart3, Bot } from 'lucide-react';

interface MobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCopilot: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPath, onNavigate, onOpenCopilot }) => {
  const items = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Payments', path: '/payments', icon: CreditCard },
    { label: 'Simulator', path: '/simulator', icon: PlayCircle, star: true },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080d1a]/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;

        return (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenCopilot}
        className="flex flex-col items-center gap-1 p-1.5 text-emerald-400 font-bold text-[10px]"
      >
        <Bot className="w-5 h-5 animate-pulse" />
        <span>Ask AI</span>
      </button>
    </div>
  );
};
