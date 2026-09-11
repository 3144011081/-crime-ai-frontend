import React from 'react';
import { Activity, Shield, Terminal } from 'lucide-react';
import { SettingsConfig } from '../types';

interface NavbarProps {
  settings: SettingsConfig | null;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, activeTab }) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Aerial Surveillance & Crime Detection Dashboard';
      case 'live':
        return 'Real-Time Spatio-Temporal Detection Feed';
      case 'reports':
        return 'Chronological Surveillance Audit Logs';
      case 'settings':
        return 'Model Parameters & System Diagnostics';
      default:
        return 'Surveillance Monitor';
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-dark-850/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <span className="p-2 rounded-lg bg-slate-800/80 text-red-400 border border-slate-700/60">
          <Shield className="w-4 h-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-slate-100">{getTitle()}</h2>
          <p className="text-[11px] text-slate-400">Autonomous 2-Stage Multi-Entity Drone Surveillance Engine</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/70 border border-slate-700/60 text-slate-300">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-[11px]">{settings?.device || 'Active Accelerator'}</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-semibold text-[11px]">LIVE MONITORING</span>
        </div>
      </div>
    </header>
  );
};
