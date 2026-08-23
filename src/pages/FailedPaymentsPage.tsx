import React, { useState } from 'react';
import { 
  Search, Filter, CreditCard, Sparkles, RefreshCw, 
  ArrowUpDown, Eye, CheckCircle2, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RiskBadge, PaymentStatusBadge } from '../components/common/Badge';
import { ProbabilityMeter } from '../components/common/ProbabilityMeter';
import { Payment, FailureReason, RiskLevel, PaymentStatus } from '../types';

interface FailedPaymentsPageProps {
  onNavigate: (path: string) => void;
  onSelectPayment: (payment: Payment) => void;
}

export const FailedPaymentsPage: React.FC<FailedPaymentsPageProps> = ({ onNavigate, onSelectPayment }) => {
  const { payments, formatCurrency, rescuePayment } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReason, setSelectedReason] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter payments
  const filtered = payments.filter((pay) => {
    const matchesSearch = 
      pay.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.failureReason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesReason = selectedReason === 'ALL' || pay.failureReason === selectedReason;
    const matchesRisk = selectedRisk === 'ALL' || pay.riskLevel === selectedRisk;
    const matchesStatus = selectedStatus === 'ALL' || pay.status === selectedStatus;

    return matchesSearch && matchesReason && matchesRisk && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayedPayments = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            Failed Payments Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete telemetry database of failed transactions with AI recovery diagnosis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Total Filtered: {filtered.length}</span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer, email, txn ID or reason..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Reason Filter */}
        <select
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
        >
          <option value="ALL">All Failure Reasons</option>
          <option value="EXPIRED_CARD">EXPIRED_CARD</option>
          <option value="INSUFFICIENT_FUNDS">INSUFFICIENT_FUNDS</option>
          <option value="GATEWAY_TIMEOUT">GATEWAY_TIMEOUT</option>
          <option value="DO_NOT_HONOR">DO_NOT_HONOR</option>
          <option value="LIMIT_EXCEEDED">LIMIT_EXCEEDED</option>
        </select>

        {/* Risk Filter */}
        <select
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="Low">Low Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="High">High Risk</option>
          <option value="Critical">Critical Risk</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="FAILED">Failed</option>
          <option value="RECOVERING">In Rescue</option>
          <option value="RECOVERED">Recovered 🎉</option>
        </select>

      </div>

      {/* Payment Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-slate-900/80">
                <th className="p-4 pl-6">Transaction ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Failure Reason</th>
                <th className="p-4">Risk</th>
                <th className="p-4 w-32">Recovery Prob.</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayedPayments.map((pay) => (
                <tr
                  key={pay.id}
                  onClick={() => onSelectPayment(pay)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="p-4 pl-6 font-mono text-emerald-400 font-medium">
                    {pay.transactionId}
                  </td>

                  <td className="p-4 font-medium text-white">
                    <div className="font-bold">{pay.customerName}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{pay.customerEmail}</div>
                  </td>

                  <td className="p-4 font-mono font-bold text-white">
                    {formatCurrency(pay.amount)}
                  </td>

                  <td className="p-4 text-slate-400 text-[11px] font-mono">
                    {new Date(pay.failedAt).toLocaleDateString([], { month: 'short', day: '2-digit' })}
                  </td>

                  <td className="p-4">
                    <span className="font-mono text-[11px] text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
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
                    <PaymentStatusBadge status={pay.status} />
                  </td>

                  <td className="p-4 pr-6 text-right space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPayment(pay);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700"
                    >
                      AI Detail
                    </button>

                    {pay.status !== 'RECOVERED' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          rescuePayment(pay.id);
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px]"
                      >
                        Rescue
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing Page <span className="font-bold text-white font-mono">{currentPage}</span> of <span className="font-bold text-white font-mono">{totalPages || 1}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
