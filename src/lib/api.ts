
import axios from "axios";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: "https://api-wfh.kryptomind.net/api",
  timeout: 15000, // Increased timeout for slow connections
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  }
});

// Add request interceptor for logging
axiosInstance.interceptors.request.use(
  (config) => {
    const timestamp = new Date().toISOString();
    console.log(`🚀 [${timestamp}] ${config.method?.toUpperCase()} ${config.url}`, config.params || {});
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
    const timestamp = new Date().toISOString();
    console.log(`✅ [${timestamp}] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('❌ Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('❌ Network error: No response received', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('❌ Error in request setup:', error.message);
    }
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

// API functions
export const api = {
  fetchDashboard: async () => {
    try {
      const timestamp = Date.now();
      const response = await axiosInstance.get('/dashboard', {
        params: { t: timestamp }
      });
      
      // Validate and normalize response data
      if (!response.data || !response.data.data) {
        console.warn('Invalid response format from dashboard API');
        return [];
      }
      
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
      throw new Error("Could not retrieve dashboard data. Please check your network connection.");
    }
  },

  fetchHistory: async (username: string, days: number = 7) => {
    try {
      const response = await axiosInstance.get('/history', {
        params: { username, days }
      });
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('Invalid response format from history API');
        return { username, days: [] };
      }
      
      return response.data[0] || { username, days: [] };
    } catch (error) {
      console.error(`Failed to fetch history for ${username}:`, error);
      throw new Error(`Could not retrieve history for ${username}. Please try again later.`);
    }
  },

  fetchScreenshots: async (username: string, date: string) => {
    try {
      const response = await axiosInstance.get('/screenshots', {
        params: { username, date }
      });
      
      if (!response.data || !response.data.screenshots) {
        console.warn('Invalid response format from screenshots API');
        return [];
      }
      
      return response.data.screenshots || [];
    } catch (error) {
      console.error(`Failed to fetch screenshots for ${username}:`, error);
      throw new Error(`Could not retrieve screenshots for ${username}. Please check your network connection.`);
    }
  }
};
