import React from 'react';
import { Layers, AlertOctagon, Users, Car, ShieldAlert } from 'lucide-react';
import { ReportData } from '../types';

interface StatsGridProps {
  report: ReportData | null;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ report }) => {
  const windowCount = report?.window_audits ? report.window_audits.length : 0;
  const alertCount = report?.crime_clips
    ? report.crime_clips.length
    : report?.crime
    ? 1
    : 0;
  const peopleCount = report?.people_count ?? 0;
  const vehicleCount = report?.vehicle_count ?? 0;
  const weaponCount = report?.weapon_count ?? 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
      {/* Total Windows */}
      <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-blue-950/60 border border-blue-800/60 text-blue-400">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Total Windows</span>
          <span className="text-xl font-bold text-white font-mono">{windowCount}</span>
        </div>
      </div>

      {/* Alerts Triggered */}
      <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${alertCount > 0 ? 'bg-red-950/80 border border-red-800 text-red-400' : 'bg-slate-800/80 text-slate-400'}`}>
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Alerts Triggered</span>
          <span className={`text-xl font-bold font-mono ${alertCount > 0 ? 'text-red-400' : 'text-slate-300'}`}>
            {alertCount}
          </span>
        </div>
      </div>

      {/* People Count */}
      <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-400">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">People Tracked</span>
          <span className="text-xl font-bold text-white font-mono">{peopleCount}</span>
        </div>
      </div>

      {/* Vehicle Count */}
      <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-400">
          <Car className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Vehicles</span>
          <span className="text-xl font-bold text-white font-mono">{vehicleCount}</span>
        </div>
      </div>

      {/* Weapon Count */}
      <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 flex items-center gap-3 col-span-2 md:col-span-1">
        <div className={`p-2.5 rounded-lg ${weaponCount > 0 ? 'bg-red-950 border border-red-700 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Weapons Detected</span>
          <span className={`text-xl font-bold font-mono ${weaponCount > 0 ? 'text-red-400' : 'text-slate-300'}`}>
            {weaponCount}
          </span>
        </div>
      </div>
    </div>
  );
};
