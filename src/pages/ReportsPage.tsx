import React, { useState, useEffect } from 'react';
import { FileText, Download, ShieldAlert, CheckCircle2, Video, Search, Eye } from 'lucide-react';
import { apiClient } from '../api/client';
import { ReportData } from '../types';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getReports();
      setReports(res.reports || []);
      if (res.reports?.length) {
        setSelectedReport(res.reports[0]);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = reports.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.name?.toLowerCase().includes(s) ||
      r.type?.toLowerCase().includes(s) ||
      r.report_file?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-xl bg-dark-850 border border-slate-800 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Chronological Surveillance Audit Reports
          </h2>
          <p className="text-xs text-slate-400">Historical telemetry, classified temporal windows, and evidence clips</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-dark-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Generated Reports ({filtered.length})
          </div>

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filtered.length > 0 ? (
              filtered.map((r, i) => {
                const isSelected = selectedReport?.report_file === r.report_file;
                return (
                  <div
                    key={r.report_file || i}
                    onClick={() => setSelectedReport(r)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-blue-500/70 shadow-lg'
                        : 'bg-dark-850 hover:bg-dark-800/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-white truncate max-w-[170px]">
                        {r.name || r.report_file}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.crime
                            ? 'bg-red-950/80 text-red-300 border border-red-800'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {r.crime ? (
                          <ShieldAlert className="w-3 h-3 text-red-400" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        )}
                        {r.type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Confidence: {Math.round((r.confidence || 0) * 100)}%</span>
                      <span>Windows: {r.window_audits?.length || 0}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-dark-850 rounded-xl border border-slate-800 text-slate-500 text-xs">
                No reports found.
              </div>
            )}
          </div>
        </div>

        {/* Selected Report Inspection Card */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <div className="rounded-xl bg-dark-850 border border-slate-800 p-6 space-y-6">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{selectedReport.name}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        selectedReport.crime
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {selectedReport.type}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    File: {selectedReport.report_file}
                  </p>
                </div>

                {selectedReport.report_file && (
                  <a
                    href={apiClient.getReportDownloadUrl(selectedReport.report_file)}
                    download
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON Report</span>
                  </a>
                )}
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-dark-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Overall Confidence</span>
                  <span className="text-lg font-bold text-amber-400 font-mono">
                    {Math.round((selectedReport.confidence || 0) * 100)}%
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-dark-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">People Tracked</span>
                  <span className="text-lg font-bold text-white font-mono">
                    {selectedReport.people_count ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-dark-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Vehicles</span>
                  <span className="text-lg font-bold text-white font-mono">
                    {selectedReport.vehicle_count ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-dark-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Weapons</span>
                  <span className="text-lg font-bold text-red-400 font-mono">
                    {selectedReport.weapon_count ?? 0}
                  </span>
                </div>
              </div>

              {/* Annotated Output Preview */}
              {selectedReport.output_video && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-cyan-400" />
                    Annotated Detection Output Video
                  </h4>
                  <div className="rounded-lg overflow-hidden bg-black max-h-[360px] flex items-center justify-center">
                    <video
                      key={selectedReport.output_video}
                      controls
                      className="w-full h-full object-contain max-h-[360px]"
                    >
                      <source
                        src={apiClient.getOutputVideoUrl(selectedReport.output_video)}
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>
              )}

              {/* Evidence Clips Gallery */}
              {selectedReport.crime_clips && selectedReport.crime_clips.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Extracted Crime Evidence Clips ({selectedReport.crime_clips.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedReport.crime_clips.map((clip, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-dark-900 border border-red-900/50 space-y-2"
                      >
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-red-300 font-bold">Clip #{idx + 1}: {clip.classification}</span>
                          <span className="text-slate-400">{clip.start_sec}s - {clip.end_sec}s</span>
                        </div>
                        {clip.evidence_video && (
                          <video
                            controls
                            className="w-full rounded bg-black max-h-[160px] object-contain"
                          >
                            <source
                              src={apiClient.getEvidenceUrl(clip.evidence_video)}
                              type="video/mp4"
                            />
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Window Audits Table */}
              {selectedReport.window_audits && selectedReport.window_audits.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Window Telemetry Logs
                  </h4>
                  <div className="max-h-56 overflow-y-auto rounded-lg border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-dark-900 text-slate-400 uppercase font-mono text-[10px] sticky top-0">
                        <tr>
                          <th className="px-3 py-2">#</th>
                          <th className="px-3 py-2">Timestamp</th>
                          <th className="px-3 py-2">Seconds</th>
                          <th className="px-3 py-2">Class</th>
                          <th className="px-3 py-2 text-right">Conf</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                        {selectedReport.window_audits.map((item) => (
                          <tr key={item.id}>
                            <td className="px-3 py-1.5 text-slate-400">{item.id}</td>
                            <td className="px-3 py-1.5 text-slate-300">{item.timestamp}</td>
                            <td className="px-3 py-1.5 text-slate-400">{item.seconds}s</td>
                            <td className="px-3 py-1.5">
                              <span
                                className={
                                  item.classification.toLowerCase() !== 'normal'
                                    ? 'text-red-400 font-bold'
                                    : 'text-emerald-400'
                                }
                              >
                                {item.classification}
                              </span>
                            </td>
                            <td className="px-3 py-1.5 text-right text-slate-200">
                              {item.confidence}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-dark-850 rounded-xl border border-slate-800 text-slate-500">
              Select a report from the list to view telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
