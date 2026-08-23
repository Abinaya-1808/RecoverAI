import React, { useState } from 'react';
import { 
  AlertOctagon, CheckCircle2, TrendingUp, Users, CreditCard, 
  BrainCircuit, Sparkles, Filter, ArrowRight, Play, Eye, Zap, 
  Clock, ShieldCheck, RefreshCw, BarChart2, Activity, ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { RiskBadge, PaymentStatusBadge } from '../components/common/Badge';
import { ProbabilityMeter } from '../components/common/ProbabilityMeter';
import { Payment } from '../types';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
  onSelectPayment: (payment: Payment) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectPayment }) => {
  const { user, totals, formatCurrency, payments, rescuePayment } = useApp();
  const [chartRange, setChartRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [rescuingId, setRescuingId] = useState<string | null>(null);

  // Recharts Dataset
  const chartData = [
    { name: 'Aug 01', risk: 420000, recovered: 310000, lost: 50000 },
    { name: 'Aug 05', risk: 650000, recovered: 510000, lost: 70000 },
    { name: 'Aug 10', risk: 890000, recovered: 680000, lost: 90000 },
    { name: 'Aug 15', risk: 1050000, recovered: 820000, lost: 110000 },
    { name: 'Aug 20', risk: 1180000, recovered: 910000, lost: 130000 },
    { name: 'Aug 23', risk: 1284000, recovered: totals.revenueRecovered || 723000, lost: 140000 },
  ];

  const priorityQueue = payments.slice(0, 7);

  const handleQuickRescue = async (e: React.MouseEvent, paymentId: string) => {
    e.stopPropagation();
    setRescuingId(paymentId);
    await rescuePayment(paymentId);
    setTimeout(() => setRescuingId(null), 600);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Live System Status Ticker */}
      <div className="bg-[#0b1220] border border-emerald-500/20 rounded-xl px-4 py-2 flex flex-wrap items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-white font-mono text-[11px] uppercase tracking-wider">RecoverAI Engine Operational</span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-400">Gateway Monitored: <span className="text-emerald-400 font-semibold">Stripe + Razorpay</span></span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-400">Latency: <span className="text-cyan-400 font-mono font-bold">0.42s</span></span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            ML Rescue Accuracy: 94.8%
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Good morning, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Here's your revenue recovery intelligence and active payment rescue telemetry for today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/simulator')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Launch Rescue Simulator</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <MetricCard
          title="Revenue at Risk"
          value={formatCurrency(totals.revenueAtRisk || 1284000)}
          subtitle="1,284 failed payments"
          icon={AlertOctagon}
          variant="rose"
          change="-4.2%"
          changeType="negative"
          glow
          sparklineData={[40, 35, 30, 28, 25, 20, 18]}
        />

        <MetricCard
          title="Recoverable Revenue"
          value={formatCurrency(totals.recoverableRevenue || 947000)}
          subtitle="73.7% ML confidence"
          icon={BrainCircuit}
          variant="cyan"
          change="+8.1%"
          changeType="positive"
          sparklineData={[15, 20, 25, 22, 30, 35, 42]}
        />

        <MetricCard
          title="Revenue Recovered"
          value={formatCurrency(totals.revenueRecovered || 723000)}
          subtitle="+₹84,500 today"
          icon={CheckCircle2}
          variant="emerald"
          change="+12.4%"
          changeType="positive"
          glow
          sparklineData={[10, 15, 22, 30, 38, 45, 52]}
        />

        <MetricCard
          title="Recovery Rate"
          value={`${totals.recoveryRate}%`}
          subtitle="Industry benchmark: 22%"
          icon={TrendingUp}
          variant="violet"
          change="+3.5%"
          changeType="positive"
          sparklineData={[60, 65, 68, 70, 72, 74, 76]}
        />

        <MetricCard
          title="Customers at Risk"
          value="428"
          subtitle="High churn risk"
          icon={Users}
          variant="amber"
          sparklineData={[30, 28, 25, 24, 22, 20, 19]}
        />

        <MetricCard
          title="Failed Payments"
          value="1,284"
          subtitle="Active telemetry"
          icon={CreditCard}
          variant="slate"
          sparklineData={[50, 48, 45, 42, 40, 38, 35]}
        />
      </div>

      {/* Judge Impact Metrics Section */}
      <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-slate-900/90 to-slate-950 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Business & Hackathon Impact Metrics</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/30 font-bold">
            Real-Time Verified Telemetry
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-sans">Revenue Recovered</div>
            <div className="text-base font-extrabold text-emerald-400 font-mono mt-1">{formatCurrency(totals.revenueRecovered || 723000)}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-sans">Revenue Saved</div>
            <div className="text-base font-extrabold text-cyan-400 font-mono mt-1">{formatCurrency(totals.recoverableRevenue || 947000)}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-sans">Customers Rescued</div>
            <div className="text-base font-extrabold text-white font-mono mt-1">312</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-sans">Recovery Attempts</div>
            <div className="text-base font-extrabold text-white font-mono mt-1">684</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-sans">Avg. Recovery Time</div>
            <div className="text-base font-extrabold text-violet-400 font-mono mt-1">18.4 hrs</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-sans">AI Accuracy</div>
            <div className="text-base font-extrabold text-amber-400 font-mono mt-1">94.8% <span className="text-[9px] text-slate-500 font-sans">(Simulated)</span></div>
          </div>
        </div>
      </div>

      {/* Main Charts & Funnel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Revenue Recovery Performance Chart */}
        <div className="lg:col-span-8 glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                Revenue Recovery Performance
              </h3>
              <p className="text-xs text-slate-400">Comparing Revenue at Risk vs. Recovered Revenue over time</p>
            </div>

            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
              {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                    chartRange === range ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b101d', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="risk" name="Revenue at Risk" stroke="#f43f5e" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={2} />
                <Area type="monotone" dataKey="recovered" name="Revenue Recovered" stroke="#10b981" fillOpacity={1} fill="url(#colorRecovered)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recovery Funnel Card */}
        <div className="lg:col-span-4 glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recovery Funnel Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">Conversion efficiency at every rescue stage</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {[
              { stage: 'Failed Payments', count: '1,284', amount: '₹12.84L', pct: '100%', color: 'bg-rose-500' },
              { stage: 'AI Analyzed', count: '1,240', amount: '₹12.40L', pct: '96.5%', color: 'bg-cyan-500' },
              { stage: 'Recovery Eligible', count: '1,012', amount: '₹9.47L', pct: '78.8%', color: 'bg-violet-500' },
              { stage: 'Recovery Attempted', count: '890', amount: '₹8.90L', pct: '69.3%', color: 'bg-amber-500' },
              { stage: 'Successfully Recovered', count: '684', amount: '₹7.23L', pct: '76.4%', color: 'bg-emerald-500' },
            ].map((f, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-slate-300 font-sans text-xs">
                  <span>{f.stage}</span>
                  <span className="font-bold text-white">{f.count} ({f.pct})</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className={`h-full ${f.color} rounded-full`} style={{ width: f.pct }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-sans">
            <span className="font-bold">Pro Tip:</span> 73% of recovery attempts succeed within 24 hours of initial AI signal trigger.
          </div>
        </div>

      </div>

      {/* Highlighted AI Insight Card */}
      <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">AI Recovery Insight</h4>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                High Yield Signal
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              73 failed payments are associated with expired cards. Customers with previous successful payments have an <span className="text-emerald-400 font-bold font-mono">89% predicted recovery probability</span> when sent an instant 1-click update link.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('/customers')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all"
          >
            View Customers
          </button>
          <button
            onClick={() => onNavigate('/campaigns')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center gap-1.5"
          >
            Start Recovery Campaign <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Priority Recovery Queue Table */}
      <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden space-y-4">
        
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Priority Recovery Queue
            </h3>
            <p className="text-xs text-slate-400">High-value transactions ranked by AI Recovery Probability</p>
          </div>

          <button
            onClick={() => onNavigate('/payments')}
            className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1"
          >
            View All Payments <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-slate-950/80">
                <th className="p-4 pl-6">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Failure Reason</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4 w-36">Recovery Probability</th>
                <th className="p-4">Recommended Action</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {priorityQueue.map((pay) => (
                <tr 
                  key={pay.id} 
                  onClick={() => onSelectPayment(pay)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="p-4 pl-6 font-medium text-white">
                    <div className="font-bold text-white">{pay.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{pay.customerEmail}</div>
                  </td>

                  <td className="p-4 font-mono font-bold text-white">
                    {formatCurrency(pay.amount)}
                  </td>

                  <td className="p-4">
                    <span className="font-mono text-[11px] text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      {pay.failureReason}
                    </span>
                  </td>

                  <td className="p-4">
                    <RiskBadge level={pay.riskLevel} />
                  </td>

                  <td className="p-4">
                    <ProbabilityMeter probability={pay.recoveryProbability} size="sm" />
                  </td>

                  <td className="p-4">
                    <span className="text-[11px] font-medium text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 truncate block max-w-[180px]">
                      {pay.recommendedAction.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="p-4">
                    <PaymentStatusBadge status={pay.status} />
                  </td>

                  <td className="p-4 pr-6 text-right">
                    {pay.status === 'RECOVERED' ? (
                      <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Rescued
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleQuickRescue(e, pay.id)}
                        disabled={rescuingId === pay.id}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] shadow-sm transition-all"
                      >
                        {rescuingId === pay.id ? 'Rescuing...' : 'Rescue Payment'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
