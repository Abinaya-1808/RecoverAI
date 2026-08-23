import React, { useState } from 'react';
import { Search, Users, ShieldAlert, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/common/Badge';
import { Customer } from '../types';

interface CustomersPageProps {
  onNavigate: (path: string) => void;
  onSelectCustomer: (customer: Customer) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({ onNavigate, onSelectCustomer }) => {
  const { customers, formatCurrency } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');

  const filtered = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = selectedRiskFilter === 'ALL' || c.riskLevel === selectedRiskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            Customer 360 & Risk Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            CRM database tracking customer churn probability, LTV, and AI payment recovery probability.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Monitored Accounts: <span className="font-bold text-white">{customers.length}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer name, email, or company..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={selectedRiskFilter}
          onChange={(e) => setSelectedRiskFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="Low">Low Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="High">High Risk</option>
          <option value="Critical">Critical Risk</option>
        </select>
      </div>

      {/* Customer Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-slate-900/80">
                <th className="p-4 pl-6">Customer & Company</th>
                <th className="p-4">Lifetime Value (LTV)</th>
                <th className="p-4">Failed / Wins</th>
                <th className="p-4">Churn Risk</th>
                <th className="p-4">Recovery Prob.</th>
                <th className="p-4">Revenue at Risk</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.slice(0, 15).map((cust) => (
                <tr
                  key={cust.id}
                  onClick={() => onSelectCustomer(cust)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="p-4 pl-6 font-medium text-white flex items-center gap-3">
                    <img src={cust.avatarUrl} alt={cust.name} className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
                    <div>
                      <div className="font-bold text-white">{cust.name}</div>
                      <div className="text-[10px] text-slate-400">{cust.company}</div>
                    </div>
                  </td>

                  <td className="p-4 font-mono font-bold text-white">
                    {formatCurrency(cust.lifetimeValue)}
                  </td>

                  <td className="p-4 font-mono text-[11px]">
                    <span className="text-rose-400 font-bold">{cust.totalFailedPayments}</span> / <span className="text-emerald-400">{cust.totalSuccessfulPayments}</span>
                  </td>

                  <td className="p-4 font-mono">
                    <span className={cust.churnProbability > 50 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      {cust.churnProbability}%
                    </span>
                  </td>

                  <td className="p-4 font-mono text-emerald-400 font-bold">
                    {cust.recoveryProbability}%
                  </td>

                  <td className="p-4 font-mono font-bold text-rose-400">
                    {formatCurrency(cust.revenueAtRisk)}
                  </td>

                  <td className="p-4">
                    <RiskBadge level={cust.riskLevel} />
                  </td>

                  <td className="p-4 pr-6 text-right">
                    <span className="text-emerald-400 font-semibold text-xs flex items-center justify-end gap-1 group-hover:translate-x-1 transition-transform">
                      View Profile <ChevronRight className="w-3.5 h-3.5" />
                    </span>
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
