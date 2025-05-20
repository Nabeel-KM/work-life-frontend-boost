
import axios from "axios";

// Base URL for all API requests
const BASE_URL = "https://api-wfh.kryptomind.net/api";

// API endpoints
const ENDPOINTS = {
  dashboard: `${BASE_URL}/dashboard`,
  history: `${BASE_URL}/history`,
  screenshots: `${BASE_URL}/screenshots`,
  sessionStatus: `${BASE_URL}/session_status`,
  verifyData: `${BASE_URL}/verify_data`,
};

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
  key: string;
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

// API functions
export const api = {
  // Get dashboard data
  fetchDashboard: async (): Promise<ApiResponse<UserData[]>> => {
    try {
      const response = await axios.get<ApiResponse<UserData[]>>(ENDPOINTS.dashboard, {
        headers: { 'Cache-Control': 'no-cache' },
        params: { t: Date.now() } // Prevent caching
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      throw error;
    }
  },

  // Get history data for a user
  fetchHistory: async (username: string, days: number = 7): Promise<UserHistory> => {
    try {
      const response = await axios.get<ApiResponse<UserHistory[]>>(ENDPOINTS.history, {
        params: { username, days }
      });
      // Return the first item in the array if it exists
      return response.data.data?.[0] || { username, days: [] };
    } catch (error) {
      console.error(`Failed to fetch history for ${username}:`, error);
      throw error;
    }
  },

  // Get screenshots for a user and date
  fetchScreenshots: async (username: string, date: string): Promise<Screenshot[]> => {
    try {
      const response = await axios.get<ApiResponse<{ screenshots: Screenshot[] }>>(ENDPOINTS.screenshots, {
        params: { username, date }
      });
      return response.data.data?.screenshots || [];
    } catch (error) {
      console.error(`Failed to fetch screenshots for ${username}:`, error);
      throw error;
    }
  }
};
