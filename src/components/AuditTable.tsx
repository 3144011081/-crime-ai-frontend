import React, { useState } from 'react';
import { Download, Search, FileSpreadsheet, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { WindowAudit } from '../types';

interface AuditTableProps {
  audits?: WindowAudit[];
  videoName?: string;
}

export const AuditTable: React.FC<AuditTableProps> = ({ audits = [], videoName = 'surveillance' }) => {
  const [search, setSearch] = useState('');

  const filtered = audits.filter((item) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      item.classification.toLowerCase().includes(s) ||
      item.timestamp.toLowerCase().includes(s) ||
      String(item.seconds).includes(s)
    );
  });

  const downloadCSV = () => {
    if (!audits.length) return;
    const headers = ['#', 'Timestamp', 'Seconds', 'Classification', 'Confidence'];
    const rows = audits.map((a) => [
      a.id,
      `"${a.timestamp}"`,
      a.seconds,
      `"${a.classification}"`,
      `${a.confidence}%`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${videoName}_audit_log.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-xl bg-dark-850 border border-slate-800 p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Chronological Surveillance Audit Log
          </h3>
          <p className="text-xs text-slate-400">Sliding window sequence classifications and timestamps</p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter classifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="button"
            onClick={downloadCSV}
            disabled={!audits.length}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-dark-900/90 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Offset</th>
              <th className="px-4 py-3">Classification</th>
              <th className="px-4 py-3 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const isCrime = item.classification.toLowerCase() !== 'normal';
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-2.5 text-slate-400">{item.id}</td>
                    <td className="px-4 py-2.5 text-slate-200">{item.timestamp}</td>
                    <td className="px-4 py-2.5 text-slate-400">{item.seconds}s</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                          isCrime
                            ? 'bg-red-950/80 text-red-300 border border-red-800/70'
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                        }`}
                      >
                        {isCrime ? (
                          <ShieldAlert className="w-3 h-3 text-red-400" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        )}
                        {item.classification}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-slate-200">
                      {item.confidence}%
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  {audits.length === 0
                    ? 'No audit log available. Select or upload a video to run surveillance analysis.'
                    : 'No matching entries found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
