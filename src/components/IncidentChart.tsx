import React from 'react';
import { BarChart3, ShieldAlert, CheckCircle2, Activity } from 'lucide-react';
import { ReportData } from '../types';

interface IncidentChartProps {
  report: ReportData | null;
}

interface ClassStat {
  key: string;
  name: string;
  count: number;
  percentage: number;
  avgConfidence: number;
  color: string;
  isCrime: boolean;
}

const CLASS_CONFIG: Record<
  string,
  { name: string; color: string; isCrime: boolean }
> = {
  Robbery: {
    name: 'Robbery / Theft',
    color: 'from-amber-500 to-red-500',
    isCrime: true,
  },
  Violence: {
    name: 'Violence / Fighting',
    color: 'from-red-500 to-rose-600',
    isCrime: true,
  },
  Shooting: {
    name: 'Shooting / Weapon',
    color: 'from-purple-500 to-red-600',
    isCrime: true,
  },
  FireExplosion: {
    name: 'Fire / Explosion',
    color: 'from-orange-500 to-amber-500',
    isCrime: true,
  },
  Accident: {
    name: 'Road Accidents',
    color: 'from-blue-500 to-cyan-500',
    isCrime: true,
  },
  Vandalism: {
    name: 'Vandalism / Damage',
    color: 'from-pink-500 to-rose-500',
    isCrime: true,
  },
  Normal: {
    name: 'Normal / Non-Crime',
    color: 'from-emerald-500 to-teal-500',
    isCrime: false,
  },
};

export const IncidentChart: React.FC<IncidentChartProps> = ({ report }) => {
  const audits = report?.window_audits || [];
  const totalWindows = audits.length;

  // Aggregate dynamically from Chronological Surveillance Audit Log
  const classCounts: Record<string, { count: number; totalConfidence: number }> = {};

  // Initialize known classes
  Object.keys(CLASS_CONFIG).forEach((cls) => {
    classCounts[cls] = { count: 0, totalConfidence: 0 };
  });

  audits.forEach((item) => {
    const cls = item.classification;
    if (!classCounts[cls]) {
      classCounts[cls] = { count: 0, totalConfidence: 0 };
    }
    classCounts[cls].count += 1;
    classCounts[cls].totalConfidence += item.confidence || 0;
  });

  // Convert to formatted array
  const dynamicStats: ClassStat[] = Object.entries(classCounts).map(([key, data]) => {
    const config = CLASS_CONFIG[key] || {
      name: key,
      color: 'from-slate-500 to-slate-400',
      isCrime: key.toLowerCase() !== 'normal',
    };
    const percentage = totalWindows > 0 ? Math.round((data.count / totalWindows) * 100) : 0;
    const avgConfidence = data.count > 0 ? Math.round(data.totalConfidence / data.count) : 0;

    return {
      key,
      name: config.name,
      count: data.count,
      percentage,
      avgConfidence,
      color: config.color,
      isCrime: config.isCrime,
    };
  });

  // Sort: Classes with active detections first, descending by count
  dynamicStats.sort((a, b) => {
    if (a.count !== b.count) return b.count - a.count;
    if (a.isCrime && !b.isCrime) return -1;
    if (!a.isCrime && b.isCrime) return 1;
    return 0;
  });

  const activeCrimeWindows = audits.filter((a) => a.classification.toLowerCase() !== 'normal').length;

  return (
    <div className="p-5 rounded-xl bg-dark-850 border border-slate-800 flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Live Audit Classification Distribution
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-900 border border-slate-700/80 text-slate-300">
            {totalWindows} Windows
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Calculated in real-time from the Chronological Surveillance Audit Log
        </p>
      </div>

      {/* Dynamic List */}
      <div className="space-y-3 my-4 max-h-[380px] overflow-y-auto pr-1">
        {totalWindows > 0 ? (
          dynamicStats.map((item) => {
            const hasDetections = item.count > 0;

            return (
              <div
                key={item.key}
                className={`p-2.5 rounded-lg border transition-all ${
                  hasDetections && item.isCrime
                    ? 'bg-red-950/20 border-red-900/60'
                    : hasDetections
                    ? 'bg-dark-900/80 border-slate-800'
                    : 'bg-dark-900/30 border-transparent opacity-40'
                }`}
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <div className="flex items-center gap-2">
                    {item.isCrime ? (
                      <span className={`w-2 h-2 rounded-full ${hasDetections ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
                    ) : (
                      <span className={`w-2 h-2 rounded-full ${hasDetections ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    )}
                    <span className={`font-medium ${hasDetections ? 'text-slate-100 font-semibold' : 'text-slate-500'}`}>
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-400">
                      {item.count} {item.count === 1 ? 'win' : 'wins'} ({item.percentage}%)
                    </span>
                    {hasDetections && (
                      <span className={`font-bold ${item.isCrime ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {item.avgConfidence}% conf
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${item.color} ${
                      hasDetections && item.isCrime ? 'glow-red' : ''
                    }`}
                    style={{ width: `${Math.max(item.percentage, hasDetections ? 5 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 px-4 text-slate-500">
            <Activity className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-xs font-medium text-slate-300">No Window Telemetry Available</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Select or upload a video and click 'Start AI Surveillance' to populate the live distribution.
            </p>
          </div>
        )}
      </div>

      {/* Dynamic Summary Footer */}
      <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>
          Crime Ratio:{' '}
          <strong className={activeCrimeWindows > 0 ? 'text-red-400' : 'text-emerald-400'}>
            {totalWindows > 0 ? Math.round((activeCrimeWindows / totalWindows) * 100) : 0}%
          </strong>{' '}
          ({activeCrimeWindows}/{totalWindows} windows)
        </span>
        <span className="text-slate-400">R(2+1)D-18 Multi-Scale</span>
      </div>
    </div>
  );
};
