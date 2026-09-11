export interface WindowAudit {
  id: number;
  timestamp: string;
  seconds: number;
  classification: string;
  confidence: number;
  window_index?: number;
}

export interface CrimeClip {
  classification: string;
  confidence: number;
  start_sec: number;
  end_sec: number;
  evidence_video?: string;
  annotated_clip?: string;
}

export interface ReportData {
  name: string;
  source_video?: string;
  output_video?: string;
  report_file?: string;
  crime: boolean;
  type: string;
  confidence: number;
  crime_probability?: number;
  people_count: number;
  vehicle_count: number;
  weapon_count: number;
  detected_activities?: string[];
  window_audits?: WindowAudit[];
  crime_clips?: CrimeClip[];
  mtime?: number;
  fps?: number;
  total_frames?: number;
}

export interface SettingsConfig {
  device: string;
  checkpoint: string;
  confidence_threshold: number;
  stride: number;
  classes: string[];
  preprocess_modes: string[];
}

export interface VideoListResponse {
  all: string[];
  samples: string[];
  uploads: string[];
}
