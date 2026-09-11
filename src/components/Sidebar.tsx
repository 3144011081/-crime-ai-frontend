import React from 'react';
import { LayoutDashboard, Radio, FileText, Sliders, ShieldAlert, Cpu } from 'lucide-react';
import { SettingsConfig } from '../types';

interface SidebarProps {
  activeTab: 'dashboard' | 'live' | 'reports' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'live' | 'reports' | 'settings') => void;
  settings: SettingsConfig | null;
  confThresh: number;
  setConfThresh: (val: number) => void;
  stride: number;
  setStride: (val: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  confThresh,
  setConfThresh,
  stride,
  setStride,
}) => {
  return (
    <aside className="w-72 bg-dark-850 border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div className="p-5 overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center gap-3.5 pb-6 border-b border-slate-800">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center text-2xl shadow-lg shadow-red-900/30">
            🚁
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              CrimeAI <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/60">v2.0</span>
            </h1>
            <p className="text-xs text-slate-400">Aerial Surveillance AI Monitor</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 space-y-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-red-600/15 text-red-400 border border-red-500/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-red-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'live'
                ? 'bg-red-600/15 text-red-400 border border-red-500/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Live Detection Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'reports'
                ? 'bg-red-600/15 text-red-400 border border-red-500/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Audit Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-red-600/15 text-red-400 border border-red-500/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Model Parameters</span>
          </button>
        </nav>

        {/* Quick Model Sliders Section */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> AI Parameters
            </span>
          </div>

          <div className="space-y-4">
            {/* Confidence Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">Alert Confidence</span>
                <span className="font-mono font-bold text-red-400">{confThresh}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={confThresh}
                onChange={(e) => setConfThresh(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Stride Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">Window Stride</span>
                <span className="font-mono font-bold text-blue-400">{stride} frames</span>
              </div>
              <input
                type="range"
                min="1"
                max="32"
                value={stride}
                onChange={(e) => setStride(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Model Architecture Info */}
            <div className="p-2.5 rounded-lg bg-dark-800 border border-slate-800 text-[11px] text-slate-400">
              <div className="font-medium text-slate-300 flex items-center gap-1.5 mb-1">
                <Cpu className="w-3 h-3 text-cyan-400" /> Architecture
              </div>
              <div>R(2+1)D-18 Spatio-Temporal + YOLOv8 + ByteTrack</div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-dark-900/50">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div className="text-xs">
            <div className="font-semibold text-slate-200">System Online</div>
            <div className="text-[11px] text-slate-400 truncate max-w-[170px]">
              {settings?.device || 'Engine Initialized'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
