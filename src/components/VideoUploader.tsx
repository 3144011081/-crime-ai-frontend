import React, { useState, useRef } from 'react';
import { UploadCloud, Film, Play, Loader2, Sparkles, SlidersHorizontal } from 'lucide-react';
import { apiClient } from '../api/client';
import { VideoListResponse } from '../types';

interface VideoUploaderProps {
  videos: VideoListResponse | null;
  selectedVideo: string | null;
  setSelectedVideo: (filename: string) => void;
  onAnalyze: (params: { filename: string; preprocessMode: string }) => Promise<void>;
  isAnalyzing: boolean;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  videos,
  selectedVideo,
  setSelectedVideo,
  onAnalyze,
  isAnalyzing,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preprocessMode, setPreprocessMode] = useState<string>('auto');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated progress stages while running AI inference
  const [progressPct, setProgressPct] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing AI Engine...');

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    try {
      setIsUploading(true);
      const res = await apiClient.uploadVideo(file);
      setSelectedVideo(res.filename);
    } catch (err: any) {
      alert(err.message || 'Video upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedVideo || isAnalyzing) return;
    setProgressPct(5);
    setStatusMessage('Initializing 3-Model AI ConvNet & YOLO Engines...');

    // Progress timer
    const interval = setInterval(() => {
      setProgressPct((prev) => {
        if (prev < 90) {
          const next = prev + Math.random() * 8;
          if (next > 25 && next < 55) {
            setStatusMessage('Classifying Spatio-Temporal Sliding Windows with R(2+1)D-18...');
          } else if (next >= 55 && next < 80) {
            setStatusMessage('Running Multi-Entity ByteTrack & Weapon Bounding Box HUD...');
          } else if (next >= 80) {
            setStatusMessage('Extracting High-Confidence Crime Evidence Clips & Reports...');
          }
          return Math.min(next, 92);
        }
        return prev;
      });
    }, 450);

    try {
      await onAnalyze({
        filename: selectedVideo,
        preprocessMode,
      });
      setProgressPct(100);
      setStatusMessage('Analysis Complete!');
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <div className="rounded-xl bg-dark-850 border border-slate-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Film className="w-4 h-4 text-red-400" />
            Surveillance Source Input
          </h3>
          <p className="text-xs text-slate-400">Select aerial footage for real-time criminal activity detection</p>
        </div>

        {/* Preprocessing Mode Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-cyan-400" /> Preprocessing:
          </span>
          <select
            value={preprocessMode}
            onChange={(e) => setPreprocessMode(e.target.value)}
            className="bg-dark-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-medium focus:outline-none focus:border-cyan-500"
          >
            <option value="auto">Auto (Adaptive CLAHE)</option>
            <option value="histogram">Histogram Equalization</option>
            <option value="superres">Super-Resolution</option>
            <option value="none">Raw Pass-Through (None)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files?.[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center transition-all ${
            dragOver
              ? 'border-red-500 bg-red-950/20'
              : 'border-slate-700/80 hover:border-slate-600 bg-dark-900/50 hover:bg-dark-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />

          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-2.5 text-slate-300">
            {isUploading ? (
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            ) : (
              <UploadCloud className="w-5 h-5 text-red-400" />
            )}
          </div>
          <span className="text-xs font-semibold text-slate-200">
            {isUploading ? 'Uploading & Optimizing Video...' : 'Click or Drag Drone Video to Upload'}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5">Supports MP4, AVI, MOV, MKV</span>
        </div>

        {/* Sample Video Selector & Trigger Box */}
        <div className="rounded-xl border border-slate-800 bg-dark-900/50 p-5 flex flex-col justify-between">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Or Choose Existing Video / Sample Feed:
            </label>
            <select
              value={selectedVideo || ''}
              onChange={(e) => setSelectedVideo(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-red-500"
            >
              <option value="">-- Select a surveillance clip --</option>
              {videos?.all?.map((v) => (
                <option key={v} value={v}>
                  {v} {videos.uploads?.includes(v) ? '(Uploaded)' : '(Sample)'}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
            <div className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
              {selectedVideo ? (
                <span className="text-emerald-400 font-semibold">Active: {selectedVideo}</span>
              ) : (
                'No clip chosen'
              )}
            </div>

            <button
              onClick={handleStartAnalysis}
              disabled={!selectedVideo || isAnalyzing || isUploading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-950/50 transition-all ml-auto"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start AI Surveillance</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      {isAnalyzing && (
        <div className="mt-4 p-4 rounded-xl bg-dark-900 border border-red-900/40 animate-pulse">
          <div className="flex justify-between text-xs font-mono font-semibold text-red-400 mb-1.5">
            <span>{statusMessage}</span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
