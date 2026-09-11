import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ReportData } from '../types';

interface AlertBannerProps {
  report: ReportData | null;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ report }) => {
  if (!report) return null;

  const confPct = Math.round((report.confidence || 0) * 100);
  const crimeProbPct = Math.round(((report.crime_probability ?? report.confidence) || 0) * 100);

  if (report.crime) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-950/90 via-red-900/80 to-rose-950/90 border-2 border-red-600/80 p-5 shadow-2xl shadow-red-950/80 glow-red">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-600/30 border border-red-500 flex items-center justify-center shrink-0 animate-pulse">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-red-300 uppercase">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                CRIME DETECTED — HIGH PRIORITY ALERT
              </div>
              <h2 className="text-2xl font-black text-white tracking-wide mt-0.5">
                {report.type}
              </h2>
              {report.detected_activities && report.detected_activities.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {report.detected_activities.map((act, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-900/60 text-red-200 border border-red-700/60"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-red-800/50 pt-3 sm:pt-0">
            {/* Confidence Bar */}
            <div className="min-w-[140px]">
              <div className="flex justify-between text-xs text-red-200 font-medium mb-1">
                <span>Confidence</span>
                <span className="font-bold text-amber-300">{confPct}%</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-red-700/50">
                <div
                  className="bg-gradient-to-r from-amber-400 to-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${confPct}%` }}
                />
              </div>
            </div>

            {/* Crime Probability Badge */}
            <div className="bg-black/50 border border-red-700/60 rounded-xl px-4 py-2 text-center min-w-[90px]">
              <div className="text-[10px] uppercase font-mono font-bold text-red-300">Probability</div>
              <div className="text-xl font-black text-amber-400">{crimeProbPct}%</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-slate-900 border border-emerald-600/60 p-5 shadow-lg shadow-emerald-950/30 glow-green">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-600/20 border border-emerald-500/60 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
              Surveillance Scan Complete
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Normal Scene — No Criminal Activity Detected
            </h2>
          </div>
        </div>

        <div className="px-4 py-2 rounded-lg bg-emerald-950/80 border border-emerald-800 text-right">
          <div className="text-[10px] text-emerald-300 uppercase font-mono">Confidence</div>
          <div className="text-lg font-bold text-emerald-400">{confPct}%</div>
        </div>
      </div>
    </div>
  );
};
