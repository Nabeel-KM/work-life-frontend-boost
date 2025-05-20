import axios from "axios";
import { format } from "date-fns";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: "https://api-wfh.kryptomind.net/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  }
});

// Add request interceptor for logging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.params || {});
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Types for API responses
export interface UserData {
  username: string;
  display_name?: string;  
  channel: string | null;
  screen_shared: boolean;
  timestamp: string | null;
  active_app: string | null;
  active_apps: string[];
  screen_share_time: number;
  total_idle_time: number;
  total_active_time: number;
  total_session_time: number;
  duty_start_time: string | null;
  duty_end_time: string | null;
  app_usage: AppUsage[];
  most_used_app: string | null;
  most_used_app_time: number;
  daily_summaries: DailySummary[];
}

export interface AppUsage {
  app_name: string;
  total_time: number;
}

export interface DailySummary {
  _id: string;
  user_id: string;
  username: string;
  date: string;
  total_active_time: number;
  total_idle_time: number;
  total_screen_share_time: number;
  last_updated: string;
  app_summaries: AppSummary[];
}

export interface AppSummary {
  timestamp: string;
  apps: Record<string, number>;
}

export interface Screenshot {
  url: string;
  thumbnail_url?: string;
  key: string;
  timestamp?: string;
  size?: number;
  last_modified: string;
}

export interface HistoryDay {
  date: string;
  total_active_time: number;
  total_session_time: number;
  total_idle_time: number;
  first_activity: string | null;
  last_activity: string | null;
  app_usage: AppUsage[];
  most_used_app: string | null;
  most_used_app_time: number;
}

export interface UserHistory {
  username: string;
  display_name?: string;
  days: HistoryDay[];
}

// API response interfaces to handle nesting
interface ApiResponse<T> {
  data: T;
}

interface ScreenshotResponse {
  screenshots: Screenshot[];
  count: number;
  username: string;
  date: string;
}

// API functions
export const api = {
  fetchDashboard: async () => {
    try {
      const response = await axiosInstance.get('/dashboard', {
        params: { t: Date.now() }
      });
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
      throw error;
    }
  },

  fetchHistory: async (username: string, days: number = 7) => {
    try {
      const response = await axiosInstance.get('/history', {
        params: { username, days }
      });
      return response.data[0] || { username, days: [] };
    } catch (error) {
      console.error(`Failed to fetch history for ${username}:`, error);
      throw error;
    }
  },

  fetchScreenshots: async (username: string, date: string) => {
    try {
      const response = await axiosInstance.get('/screenshots', {
        params: { username, date }
      });
      return response.data.screenshots || [];
    } catch (error) {
      console.error(`Failed to fetch screenshots for ${username}:`, error);
      throw error;
    }
  }
};
