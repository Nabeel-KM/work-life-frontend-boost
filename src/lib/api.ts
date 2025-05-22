
import axios from "axios";
import { format } from "date-fns";
import { CSRFProtection, DOMPurify } from "./utils-security";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: "https://api-wfh.kryptomind.net/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  }
});

// Add request interceptor for logging and security
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.params || {});
    
    // Add CSRF token to requests if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    // Sanitize URL parameters for security
    if (config.params) {
      Object.keys(config.params).forEach(key => {
        if (typeof config.params[key] === 'string') {
          // Basic sanitization for string parameters
          config.params[key] = DOMPurify.sanitize(config.params[key]);
        }
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and data sanitization
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

// Mock data for offline development or when API is unavailable
const mockData = {
  dashboard: [
    {
      username: "user1",
      display_name: "John Doe",
      channel: "Development",
      screen_shared: true,
      timestamp: new Date().toISOString(),
      active_app: "Visual Studio Code",
      active_apps: ["Visual Studio Code", "Chrome", "Slack"],
      screen_share_time: 3600,
      total_idle_time: 300,
      total_active_time: 420,
      total_session_time: 8.5,
      duty_start_time: new Date().toISOString(),
      duty_end_time: null,
      app_usage: [
        { app_name: "Visual Studio Code", total_time: 180 },
        { app_name: "Chrome", total_time: 120 },
        { app_name: "Slack", total_time: 60 }
      ],
      most_used_app: "Visual Studio Code",
      most_used_app_time: 180,
      daily_summaries: []
    },
    {
      username: "user2",
      display_name: "Jane Smith",
      channel: "Design",
      screen_shared: false,
      timestamp: new Date().toISOString(),
      active_app: "Figma",
      active_apps: ["Figma", "Slack"],
      screen_share_time: 0,
      total_idle_time: 600,
      total_active_time: 360,
      total_session_time: 7.2,
      duty_start_time: new Date().toISOString(),
      duty_end_time: null,
      app_usage: [
        { app_name: "Figma", total_time: 240 },
        { app_name: "Slack", total_time: 120 }
      ],
      most_used_app: "Figma",
      most_used_app_time: 240,
      daily_summaries: []
    }
  ],
  history: {
    username: "user1",
    display_name: "John Doe",
    days: [
      {
        date: format(new Date(), 'yyyy-MM-dd'),
        total_active_time: 420,
        total_session_time: 8.5,
        total_idle_time: 300,
        first_activity: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        app_usage: [
          { app_name: "Visual Studio Code", total_time: 180 },
          { app_name: "Chrome", total_time: 120 },
          { app_name: "Slack", total_time: 60 }
        ],
        most_used_app: "Visual Studio Code",
        most_used_app_time: 180
      }
    ]
  },
  screenshots: [
    {
      url: "https://via.placeholder.com/500x300?text=Screenshot+1",
      key: "screenshot1",
      last_modified: new Date().toISOString()
    },
    {
      url: "https://via.placeholder.com/500x300?text=Screenshot+2",
      key: "screenshot2",
      last_modified: new Date().toISOString()
    }
  ]
};

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
      console.log("Using mock data for dashboard");
      // Return mock data when API is unavailable
      return mockData.dashboard;
    }
  },

  fetchHistory: async (username: string, days: number = 7) => {
    try {
      // Sanitize inputs
      const safeUsername = DOMPurify.sanitize(username);
      
      const response = await axiosInstance.get('/history', {
        params: { username: safeUsername, days }
      });
      return response.data[0] || { username: safeUsername, days: [] };
    } catch (error) {
      console.error(`Failed to fetch history for ${username}:`, error);
      console.log("Using mock data for history");
      // Return mock data when API is unavailable
      return mockData.history;
    }
  },

  fetchScreenshots: async (username: string, date: string) => {
    try {
      // Sanitize inputs
      const safeUsername = DOMPurify.sanitize(username);
      const safeDate = DOMPurify.sanitize(date);
      
      const response = await axiosInstance.get('/screenshots', {
        params: { username: safeUsername, date: safeDate }
      });
      return response.data.screenshots || [];
    } catch (error) {
      console.error(`Failed to fetch screenshots for ${username}:`, error);
      console.log("Using mock data for screenshots");
      // Return mock data when API is unavailable
      return mockData.screenshots;
    }
  }
};
