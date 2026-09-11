import React, { useState } from 'react';
import { Sliders, Cpu, HardDrive, Check, Save } from 'lucide-react';
import { apiClient } from '../api/client';
import { SettingsConfig } from '../types';

interface SettingsPageProps {
  settings: SettingsConfig | null;
  confThresh: number;
  setConfThresh: (val: number) => void;
  stride: number;
  setStride: (val: number) => void;
  refreshSettings: () => Promise<void>;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  confThresh,
  setConfThresh,
  stride,
  setStride,
  refreshSettings,
}) => {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiClient.updateSettings({
        confidence_threshold: confThresh,
        stride: stride,
      });
      await refreshSettings();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-xl bg-dark-850 border border-slate-800 p-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          Model Settings & AI Inference Parameters
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Tune spatio-temporal sliding windows, confidence triggers, and view hardware acceleration
        </p>
      </div>

      {/* Hardware & Checkpoint Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-dark-850 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Hardware Acceleration Device
          </div>
          <div className="p-3 rounded-lg bg-dark-900 border border-slate-800 font-mono text-sm font-bold text-emerald-400">
            {settings?.device || 'Detecting accelerator...'}
          </div>
          <p className="text-[11px] text-slate-500">
            Optimized PyTorch inference with Metal Performance Shaders (Apple Silicon MPS).
          </p>
        </div>

        <div className="p-5 rounded-xl bg-dark-850 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <HardDrive className="w-4 h-4 text-red-400" />
            Active Model Checkpoint
          </div>
          <div className="p-3 rounded-lg bg-dark-900 border border-slate-800 font-mono text-xs text-slate-200 truncate">
            {settings?.checkpoint || '/models/crime_aerial_augmented_best1.pth'}
          </div>
          <p className="text-[11px] text-slate-500">
            Fine-tuned on Aerial Crime Dataset with Spatio-Temporal R(2+1)D-18.
          </p>
        </div>
      </div>

      {/* Tunable Parameters */}
      <div className="p-6 rounded-xl bg-dark-850 border border-slate-800 space-y-6">
        <h3 className="text-sm font-semibold text-slate-200">Surveillance Thresholds</h3>

        {/* Confidence Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <label className="text-xs font-semibold text-slate-200 block">
                Alert Confidence Threshold
              </label>
              <span className="text-[11px] text-slate-400">
                Minimum classification confidence required to trigger high-priority alerts
              </span>
            </div>
            <span className="font-mono text-lg font-bold text-red-400 bg-dark-900 px-3 py-1 rounded-lg border border-slate-800">
              {confThresh}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="95"
            value={confThresh}
            onChange={(e) => setConfThresh(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
        </div>

        {/* Stride Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <label className="text-xs font-semibold text-slate-200 block">
                Temporal Sliding Window Stride
              </label>
              <span className="text-[11px] text-slate-400">
                Frame step between consecutive 16-frame spatio-temporal video clips (lower = denser evaluation)
              </span>
            </div>
            <span className="font-mono text-lg font-bold text-blue-400 bg-dark-900 px-3 py-1 rounded-lg border border-slate-800">
              {stride} frames
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="32"
            value={stride}
            onChange={(e) => setStride(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Changes apply to subsequent video analysis jobs.
          </span>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-all shadow-md"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Apply & Save Settings'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Target Classes List */}
      <div className="p-6 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
        <h3 className="text-sm font-semibold text-slate-200">
          Recognized Activity & Crime Classes ({settings?.classes?.length || 14})
        </h3>
        <div className="flex flex-wrap gap-2">
          {settings?.classes?.map((cls) => (
            <span
              key={cls}
              className="px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-700/70 font-mono text-xs text-slate-300"
            >
              {cls}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
