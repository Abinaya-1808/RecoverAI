import React from 'react';

interface ProbabilityMeterProps {
  probability: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ProbabilityMeter: React.FC<ProbabilityMeterProps> = ({
  probability,
  size = 'md',
  showLabel = true,
}) => {
  const getColor = (val: number) => {
    if (val >= 80) return { bg: 'bg-emerald-500', text: 'text-emerald-400', shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]' };
    if (val >= 60) return { bg: 'bg-cyan-500', text: 'text-cyan-400', shadow: 'shadow-[0_0_12px_rgba(6,182,212,0.5)]' };
    if (val >= 40) return { bg: 'bg-amber-500', text: 'text-amber-400', shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]' };
    return { bg: 'bg-rose-500', text: 'text-rose-400', shadow: 'shadow-[0_0_12px_rgba(244,63,94,0.5)]' };
  };

  const color = getColor(probability);

  const barHeights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold mb-1">
          <span className="text-slate-400">Recovery Probability</span>
          <span className={`${color.text} font-bold font-mono`}>{probability}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden border border-white/5 ${barHeights[size]}`}>
        <div 
          className={`h-full ${color.bg} ${color.shadow} transition-all duration-700 ease-out rounded-full`}
          style={{ width: `${probability}%` }}
        />
      </div>
    </div>
  );
};
