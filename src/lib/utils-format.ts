
import { formatSecondsToTime, formatMinutesToTime, formatHours } from './utils-time-calculation';

// Format time from minutes to a readable format
export function formatTime(minutes: number): string {
  return formatMinutesToTime(minutes);
}

// Format seconds to a readable format
export function formatTimeFromSeconds(seconds: number): string {
  return formatSecondsToTime(seconds);
}

// Format hours to a readable format (for session time)
export function formatHours(hours: number): string {
  if (!hours || isNaN(hours)) return '0h';
  
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (minutes > 0) {
    return `${wholeHours}h ${minutes}m`;
  }
  return `${wholeHours}h`;
}

// Format date to local date string
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return 'Invalid Date';
  }
}

// Format date and time to local date and time string
export function formatDateTime(dateString: string | null): string {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString();
  } catch (error) {
    return 'Invalid Date';
  }
}

// Format time only from date string
export function formatTimeOnly(dateString: string | null): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid Time';
    return date.toLocaleTimeString();
  } catch (error) {
    return 'Invalid Time';
  }
}

// Get current date in YYYY-MM-DD format
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Format session time as hours with one decimal place
export function formatSessionTime(hours: number): string {
  return formatHours(hours);
}

// Parse ISO date string and ensure it's valid
export function parseISODate(dateString: string | null): Date | null {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return null;
    return date;
  } catch (error) {
    return null;
  }
}
