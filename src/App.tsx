import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { LiveFeedPage } from './pages/LiveFeedPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { apiClient } from './api/client';
import { ReportData, SettingsConfig, VideoListResponse } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'live' | 'reports' | 'settings'>('dashboard');
  const [videos, setVideos] = useState<VideoListResponse | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [settings, setSettings] = useState<SettingsConfig | null>(null);
  const [confThresh, setConfThresh] = useState<number>(35);
  const [stride, setStride] = useState<number>(8);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      const [vids, setts, reps] = await Promise.all([
        apiClient.getVideos().catch(() => null),
        apiClient.getSettings().catch(() => null),
        apiClient.getReports().catch(() => null),
      ]);

      if (vids) {
        setVideos(vids);
        if (vids.all?.length && !selectedVideo) {
          setSelectedVideo(vids.all[0]);
        }
      }

      if (setts) {
        setSettings(setts);
        setConfThresh(setts.confidence_threshold || 35);
        setStride(setts.stride || 8);
      }

      if (reps?.reports?.length) {
        setReport(reps.reports[0]);
      }
    } catch (err) {
      console.error('Initialization error:', err);
    }
  };

  const handleAnalyze = async ({
    filename,
    preprocessMode,
  }: {
    filename: string;
    preprocessMode: string;
  }) => {
    try {
      setIsAnalyzing(true);
      const res = await apiClient.processVideo({
        filename,
        preprocess_mode: preprocessMode,
        confidence_threshold: confThresh,
        stride: stride,
      });

      if (res.report) {
        setReport(res.report);
      }
    } catch (err: any) {
      alert(err.message || 'AI surveillance analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const refreshSettings = async () => {
    const s = await apiClient.getSettings().catch(() => null);
    if (s) setSettings(s);
  };

  return (
    <div className="flex min-h-screen bg-dark-900 text-slate-100 font-sans">
      {/* Side Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        confThresh={confThresh}
        setConfThresh={setConfThresh}
        stride={stride}
        setStride={setStride}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar settings={settings} activeTab={activeTab} />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              videos={videos}
              selectedVideo={selectedVideo}
              setSelectedVideo={setSelectedVideo}
              report={report}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          )}

          {activeTab === 'live' && (
            <LiveFeedPage
              videos={videos}
              selectedVideo={selectedVideo}
              setSelectedVideo={setSelectedVideo}
            />
          )}

          {activeTab === 'reports' && <ReportsPage />}

          {activeTab === 'settings' && (
            <SettingsPage
              settings={settings}
              confThresh={confThresh}
              setConfThresh={setConfThresh}
              stride={stride}
              setStride={setStride}
              refreshSettings={refreshSettings}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
