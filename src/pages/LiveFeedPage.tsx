import React, { useState } from 'react';
import { Radio, AlertCircle, Video, Maximize2, Shield, Eye } from 'lucide-react';
import { apiClient } from '../api/client';
import { VideoListResponse } from '../types';

interface LiveFeedPageProps {
  videos: VideoListResponse | null;
  selectedVideo: string | null;
  setSelectedVideo: (filename: string) => void;
}

export const LiveFeedPage: React.FC<LiveFeedPageProps> = ({
  videos,
  selectedVideo,
  setSelectedVideo,
}) => {
  const [activeFeed, setActiveFeed] = useState<string>(selectedVideo || videos?.all?.[0] || 'Robbery032_x264.mp4');
  const [isStreaming, setIsStreaming] = useState(true);

  const streamUrl = isStreaming && activeFeed ? apiClient.getLiveFeedUrl(activeFeed) : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Feed Controller Header */}
      <div className="rounded-xl bg-dark-850 border border-slate-800 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-950 border border-red-800 text-red-400 animate-pulse">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Real-Time Spatio-Temporal Detection Stream
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-red-600 text-white font-bold animate-pulse">
                LIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">Continuous 2-Stage Multi-Entity Drone Inference (MJPEG)</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <label className="text-xs font-semibold text-slate-400">Stream Feed:</label>
            <select
              value={activeFeed}
              onChange={(e) => {
                setActiveFeed(e.target.value);
                setSelectedVideo(e.target.value);
              }}
              className="bg-dark-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-red-500 min-w-[200px]"
            >
              {videos?.all?.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isStreaming
                ? 'bg-red-950/80 border-red-800 text-red-300 hover:bg-red-900'
                : 'bg-emerald-950/80 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
            }`}
          >
            {isStreaming ? 'Pause Feed' : 'Resume Feed'}
          </button>
        </div>
      </div>

      {/* Live Video Canvas */}
      <div className="rounded-xl bg-dark-850 border border-slate-800 overflow-hidden relative shadow-2xl">
        <div className="bg-black relative min-h-[480px] max-h-[640px] flex items-center justify-center">
          {streamUrl ? (
            <img
              src={streamUrl}
              alt="Live Detection Stream"
              className="w-full h-full object-contain max-h-[640px]"
              onError={(e) => {
                console.error('Stream load error:', e);
              }}
            />
          ) : (
            <div className="text-center p-12 text-slate-500">
              <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-300">Live Stream Paused</p>
              <p className="text-xs text-slate-500 mt-1">
                Click 'Resume Feed' above to resume real-time AI inference.
              </p>
            </div>
          )}

          {/* HUD Overlay Details */}
          <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-2">
            <div className="bg-black/70 backdrop-blur-md border border-slate-700/80 rounded px-2.5 py-1 text-[11px] font-mono text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>FEED: {activeFeed}</span>
            </div>
            <div className="bg-black/70 backdrop-blur-md border border-slate-700/80 rounded px-2.5 py-1 text-[11px] font-mono text-emerald-400">
              <span>TRACKER: BYTETRACK MULTI-TARGET</span>
            </div>
          </div>

          <div className="absolute top-4 right-4 pointer-events-none">
            <div className="bg-black/70 backdrop-blur-md border border-red-700/80 rounded px-3 py-1.5 text-[11px] font-mono font-bold text-red-400 flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" />
              <span>AI CONVNET ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Telemetry Footer */}
        <div className="px-5 py-3 bg-dark-900 border-t border-slate-800 text-xs font-mono text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Real-Time Inference Mode
            </span>
            <span>FORMAT: MJPEG (Multipart)</span>
          </div>
          <div className="text-slate-500">
            Press ESC or toggle streams to switch surveillance cameras
          </div>
        </div>
      </div>
    </div>
  );
};
