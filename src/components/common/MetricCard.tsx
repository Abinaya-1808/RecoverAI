import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  variant?: 'emerald' | 'cyan' | 'violet' | 'amber' | 'rose' | 'slate';
  tooltip?: string;
  glow?: boolean;
  sparklineData?: number[];
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'positive',
  icon: Icon,
  variant = 'emerald',
  glow = false,
  sparklineData = [12, 18, 15, 24, 28, 22, 35, 40],
}) => {
  const variantStyles = {
    emerald: {
      card: 'hover:border-emerald-500/35 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      glow: 'shadow-[0_0_25px_-5px_rgba(16,185,129,0.25)] border-emerald-500/30',
      sparkline: '#10b981',
    },
    cyan: {
      card: 'hover:border-cyan-500/35 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      glow: 'shadow-[0_0_25px_-5px_rgba(6,182,212,0.25)] border-cyan-500/30',
      sparkline: '#06b6d4',
    },
    violet: {
      card: 'hover:border-violet-500/35 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]',
      iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
      glow: 'shadow-[0_0_25px_-5px_rgba(139,92,246,0.25)] border-violet-500/30',
      sparkline: '#8b5cf6',
    },
    amber: {
      card: 'hover:border-amber-500/35 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      glow: 'shadow-[0_0_25px_-5px_rgba(245,158,11,0.25)] border-amber-500/30',
      sparkline: '#f59e0b',
    },
    rose: {
      card: 'hover:border-rose-500/35 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      glow: 'shadow-[0_0_25px_-5px_rgba(244,63,94,0.25)] border-rose-500/30',
      sparkline: '#f43f5e',
    },
    slate: {
      card: 'hover:border-slate-600',
      iconBg: 'bg-slate-800 text-slate-300 border-slate-700',
      glow: '',
      sparkline: '#94a3b8',
    },
  };

  const style = variantStyles[variant];

  // Generate SVG path points for sparkline
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * 60;
      const y = 20 - ((val - min) / (max - min || 1)) * 16;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className={`glass-card p-4 rounded-xl border border-slate-800/80 transition-all duration-300 relative group overflow-hidden ${style.card} ${glow ? style.glow : ''}`}>
      
      {/* Top Row: Title & Icon */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`p-2 rounded-lg border ${style.iconBg} transition-transform group-hover:scale-110 duration-200`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      {/* Middle Row: Value & Sparkline */}
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-2xl font-extrabold tracking-tight text-white font-sans font-mono">
          {value}
        </div>

        {/* Mini SVG Sparkline */}
        <div className="w-16 h-6 opacity-75 group-hover:opacity-100 transition-opacity">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 60 20">
            <polyline
              fill="none"
              stroke={style.sparkline}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      {/* Bottom Row: Subtitle & Change Badge */}
      <div className="mt-2.5 flex items-center justify-between text-[11px]">
        {subtitle && (
          <span className="text-slate-400 font-medium truncate">{subtitle}</span>
        )}
        
        {change && (
          <div className={`flex items-center font-bold font-mono px-1.5 py-0.5 rounded ${
            changeType === 'positive' 
              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
              : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
          }`}>
            {changeType === 'positive' ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
            {change}
          </div>
        )}
      </div>

    </div>
  );
};
