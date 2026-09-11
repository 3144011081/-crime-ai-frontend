import { VideoListResponse, ReportData, SettingsConfig } from '../types';

// In production (e.g. Vercel), default to the live Cloudflare Tunnel backend
const defaultProdBackend = 'https://reserved-inf-pod-trends.trycloudflare.com';
const envApiUrl = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? defaultProdBackend : '')
).replace(/\/+$/, '');

const API_BASE = envApiUrl ? (envApiUrl.endsWith('/api') ? envApiUrl : `${envApiUrl}/api`) : '/api';

export const apiClient = {
  async getVideos(): Promise<VideoListResponse> {
    const res = await fetch(`${API_BASE}/videos`);
    if (!res.ok) throw new Error('Failed to fetch video list');
    return res.json();
  },

  async uploadVideo(file: File): Promise<{ success: boolean; filename: string; size_mb: number }> {
    const formData = new FormData();
    formData.append('video', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload video');
    }
    return res.json();
  },

  async processVideo(params: {
    filename: string;
    preprocess_mode?: string;
    confidence_threshold?: number;
    stride?: number;
  }): Promise<{ success: boolean; filename: string; report: ReportData }> {
    const res = await fetch(`${API_BASE}/inference/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to process video');
    }
    return res.json();
  },

  async getReports(): Promise<{ total: number; reports: ReportData[] }> {
    const res = await fetch(`${API_BASE}/reports`);
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  async getReport(filename: string): Promise<ReportData> {
    const res = await fetch(`${API_BASE}/reports/${encodeURIComponent(filename)}`);
    if (!res.ok) throw new Error(`Failed to fetch report for ${filename}`);
    return res.json();
  },

  async getSettings(): Promise<SettingsConfig> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: { confidence_threshold?: number; stride?: number }): Promise<void> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
  },

  // Media URL Helpers
  getVideoUrl(filename: string): string {
    return `${API_BASE}/media/video/${encodeURIComponent(filename)}`;
  },

  getOutputVideoUrl(filename: string): string {
    return `${API_BASE}/media/output/${encodeURIComponent(filename)}`;
  },

  getEvidenceUrl(filename: string): string {
    return `${API_BASE}/media/evidence/${encodeURIComponent(filename)}`;
  },

  getLiveFeedUrl(filename: string): string {
    return `${API_BASE}/live_feed/${encodeURIComponent(filename)}`;
  },

  getReportDownloadUrl(filename: string): string {
    return `${API_BASE}/reports/download/${encodeURIComponent(filename)}`;
  },
};
