import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Calendar, Filter, Download } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { useApp } from '../context/AppContext';

interface RevenueAnalyticsPageProps {
  onNavigate: (path: string) => void;
}

export const RevenueAnalyticsPage: React.FC<RevenueAnalyticsPageProps> = ({ onNavigate }) => {
  const { formatCurrency, totals } = useApp();

  const failureReasonData = [
    { name: 'Expired Card', value: 45, color: '#10b981' },
    { name: 'Insufficient Funds', value: 28, color: '#f59e0b' },
    { name: 'Gateway Timeout', value: 15, color: '#06b6d4' },
    { name: 'Do Not Honor', value: 8, color: '#f43f5e' },
    { name: 'Limit Exceeded', value: 4, color: '#8b5cf6' },
  ];

  const interventionData = [
    { name: '1-Click Magic Link', recovered: 420000 },
    { name: 'Smart Retry 48h', recovered: 280000 },
    { name: 'Instant Gateway Switch', recovered: 340000 },
    { name: 'VIP Outreach', recovered: 190000 },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            Revenue Recovery Analytics & Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive financial reporting on recovered revenue, churn prevention, and strategy yield.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/reports')}
          className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500 text-xs font-bold text-white flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4 text-emerald-400" /> Export CSV / PDF Report
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <div className="text-xs uppercase font-mono text-slate-400">Total Recovered ARR</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">{formatCurrency(totals.revenueRecovered || 723000)}</div>
          <div className="text-[11px] text-emerald-400 mt-1">+14.2% vs last month</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5">
          <div className="text-xs uppercase font-mono text-slate-400">Overall Recovery Rate</div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">76.4%</div>
          <div className="text-[11px] text-slate-400 mt-1">Industry avg: 22%</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5">
          <div className="text-xs uppercase font-mono text-slate-400">Average Rescue Time</div>
          <div className="text-2xl font-extrabold text-violet-400 font-mono mt-1">18.4 hrs</div>
          <div className="text-[11px] text-slate-400 mt-1">82% rescued within 24h</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <div className="text-xs uppercase font-mono text-slate-400">Involuntary Churn Prevented</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">312 Accounts</div>
          <div className="text-[11px] text-slate-400 mt-1">Worth ₹9.47L ARR</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Intervention Yield Bar Chart */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Recovered Revenue by Intervention Type</h3>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interventionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px' }} />
                <Bar dataKey="recovered" name="Recovered Amount" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Failure Reasons Pie Chart */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Failure Reasons Breakdown</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={failureReasonData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {failureReasonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
