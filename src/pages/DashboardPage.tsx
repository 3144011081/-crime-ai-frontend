import React from 'react';
import { VideoUploader } from '../components/VideoUploader';
import { AlertBanner } from '../components/AlertBanner';
import { VideoPlayer } from '../components/VideoPlayer';
import { StatsGrid } from '../components/StatsGrid';
import { IncidentChart } from '../components/IncidentChart';
import { AuditTable } from '../components/AuditTable';
import { ReportData, VideoListResponse } from '../types';

interface DashboardPageProps {
  videos: VideoListResponse | null;
  selectedVideo: string | null;
  setSelectedVideo: (filename: string) => void;
  report: ReportData | null;
  onAnalyze: (params: { filename: string; preprocessMode: string }) => Promise<void>;
  isAnalyzing: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  videos,
  selectedVideo,
  setSelectedVideo,
  report,
  onAnalyze,
  isAnalyzing,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Video Source Uploader & Sample Selector */}
      <VideoUploader
        videos={videos}
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
        onAnalyze={onAnalyze}
        isAnalyzing={isAnalyzing}
      />

      {/* Real-Time Crime Alert or Safe Banner */}
      {report && <AlertBanner report={report} />}

      {/* Core Surveillance Grid: Video Player + Incident Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPlayer sourceVideo={selectedVideo} report={report} />
        </div>
        <div>
          <IncidentChart report={report} />
        </div>
      </div>

      {/* Aggregate Statistics */}
      <StatsGrid report={report} />

      {/* Chronological Surveillance Audit Log */}
      <AuditTable audits={report?.window_audits} videoName={selectedVideo || 'aerial_feed'} />
    </div>
  );
};
