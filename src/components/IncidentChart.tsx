import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ReportData } from '../types';

interface IncidentChartProps {
  report: ReportData | null;
}

export const IncidentChart: React.FC<IncidentChartProps> = ({ report }) => {
  const currentType = report?.type || '';
  const currentCrime = report?.crime || false;

  const categories = [
    { name: 'Robbery / Theft', key: 'Robbery', baseline: 12, highlight: 92, color: 'from-amber-500 to-red-500' },
    { name: 'Violence / Fighting', key: 'Violence', baseline: 14, highlight: 88, color: 'from-red-500 to-rose-600' },
    { name: 'Shooting / Weapon', key: 'Shooting', baseline: 8, highlight: 95, color: 'from-purple-500 to-red-600' },
    { name: 'Fire / Explosion', key: 'FireExplosion', baseline: 10, highlight: 90, color: 'from-orange-500 to-amber-500' },
    { name: 'Road Accidents', key: 'Accident', baseline: 15, highlight: 85, color: 'from-blue-500 to-cyan-500' },
    { name: 'Vandalism / Damage', key: 'Vandalism', baseline: 9, highlight: 84, color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="p-5 rounded-xl bg-dark-850 border border-slate-800 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          Incident Classification Distribution
        </h3>
        <span className="text-[11px] font-mono text-slate-400 uppercase">
          {currentCrime ? `Active: ${currentType}` : 'Baseline Telemetry'}
        </span>
      </div>

      <div className="space-y-3 my-auto">
        {categories.map((cat) => {
          const isSelected = currentCrime && currentType.toLowerCase().includes(cat.key.toLowerCase());
          const value = isSelected ? cat.highlight : cat.baseline;

          return (
            <div key={cat.key} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className={isSelected ? 'text-white font-bold' : 'text-slate-400'}>
                  {cat.name}
                </span>
                <span className={`font-mono ${isSelected ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                  {value}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${cat.color} ${
                    isSelected ? 'glow-red' : 'opacity-40'
                  }`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Model: CrimeR2Plus1D Multi-Class</span>
        <span className="font-mono">7 Latent Classes</span>
      </div>
    </div>
  );
};
