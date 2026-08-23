import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ReportsPageProps {
  onNavigate: (path: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate }) => {
  const { formatCurrency, totals } = useApp();
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);

  const reports = [
    { title: 'Executive Revenue Recovery Audit Report', desc: 'Monthly summary of revenue rescued, involuntary churn prevented, and recovery rate benchmarks.', type: 'PDF / Executive' },
    { title: 'Failed Payments Telemetry Ledger', desc: 'Complete itemized log of all failed transactions, gateway response codes, and rescue actions.', type: 'CSV / Data Export' },
    { title: 'Customer Risk & Churn Probability Report', desc: 'High-risk account audit detailing accounts with >60% churn likelihood.', type: 'PDF / Risk Audit' },
    { title: 'AI Model Accuracy & Yield Performance', desc: 'Detailed ML breakdown comparing expected recovery yield vs actual rescued ARR.', type: 'PDF / AI Analytics' },
  ];

  const handleDownload = (title: string) => {
    setDownloadingReport(title);
    setTimeout(() => setDownloadingReport(null), 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            Report Generation Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Export executive PDF summaries and granular CSV raw payment telemetry logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((r) => (
          <div key={r.title} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-bold">
                {r.type}
              </span>
              <h3 className="font-bold text-white text-base">{r.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
            </div>

            <button
              onClick={() => handleDownload(r.title)}
              disabled={downloadingReport === r.title}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all"
            >
              {downloadingReport === r.title ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 animate-spin" /> Generating & Downloading...
                </span>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-400" /> Generate & Download Report
                </>
              )}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
