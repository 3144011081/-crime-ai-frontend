import React, { useState } from 'react';
import { Play, Video, ShieldCheck, Film } from 'lucide-react';
import { apiClient } from '../api/client';
import { ReportData } from '../types';

interface VideoPlayerProps {
  sourceVideo: string | null;
  report: ReportData | null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ sourceVideo, report }) => {
  const [activeView, setActiveView] = useState<'annotated' | 'source'>('annotated');

  const hasOutput = !!report?.output_video;
  const hasSource = !!sourceVideo;

  const currentSourceUrl =
    activeView === 'annotated' && hasOutput
      ? apiClient.getOutputVideoUrl(report.output_video!)
      : hasSource
      ? apiClient.getVideoUrl(sourceVideo!)
      : null;

  return (
    <div className="rounded-xl bg-dark-850 border border-slate-800 overflow-hidden flex flex-col h-full">
      {/* Header with View Tabs */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-dark-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-slate-200">Surveillance Video Monitor</h3>
          {sourceVideo && (
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              {sourceVideo}
            </span>
          )}
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-dark-900 rounded-lg p-0.5 border border-slate-700/60 text-xs">
          <button
            onClick={() => setActiveView('annotated')}
            disabled={!hasOutput}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === 'annotated' && hasOutput
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:hover:text-slate-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI Annotated Feed</span>
          </button>

          <button
            onClick={() => setActiveView('source')}
            disabled={!hasSource}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === 'source' || !hasOutput
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 disabled:opacity-40'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Raw Source Video</span>
          </button>
        </div>
      </div>

      {/* Video Content */}
      <div className="relative bg-black flex-1 flex items-center justify-center min-h-[360px] max-h-[520px]">
        {currentSourceUrl ? (
          <video
            key={currentSourceUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain max-h-[520px]"
          >
            <source src={currentSourceUrl} type="video/mp4" />
            Your browser does not support HTML5 video streaming.
          </video>
        ) : (
          <div className="text-center p-8 text-slate-500">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto mb-3 text-2xl">
              📹
            </div>
            <p className="text-sm font-medium text-slate-300">No Video Active</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Upload a drone surveillance video or select a sample clip from the controls above.
            </p>
          </div>
        )}
      </div>

      {/* Bottom video telemetry footer */}
      {report && (
        <div className="px-5 py-2.5 bg-dark-900/90 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-ping"></span>
              DETECTION: {report.type} ({Math.round(report.confidence * 100)}%)
            </span>
            {report.total_frames && (
              <span>FRAMES: {report.total_frames}</span>
            )}
            {report.fps && (
              <span>FPS: {report.fps.toFixed(1)}</span>
            )}
          </div>
          <div className="text-slate-400">
            {activeView === 'annotated' && hasOutput ? 'YOLOv8s + ByteTrack Active HUD' : 'Unprocessed Aerial Feed'}
          </div>
        </div>
      )}
    </div>
  );
};
