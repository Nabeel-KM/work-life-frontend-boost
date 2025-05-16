
/**
 * Comprehensive time utility functions for the application
 */

/**
 * Convert seconds to a formatted time string (e.g., "2h 30m")
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatSecondsToTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds <= 0) return '0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  }
  return `${minutes}m`;
}

/**
 * Convert minutes to a formatted time string (e.g., "2h 30m")
 * @param minutes - Time in minutes
 * @returns Formatted time string
 */
export function formatMinutesToTime(minutes: number): string {
  if (!minutes || isNaN(minutes) || minutes <= 0) return '0m';
  
  // Convert minutes to hours and minutes
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  }
  return `${mins}m`;
}

/**
 * Format hours value to a readable string with "h" suffix
 * This handles decimal hours from the API (like 7.33 hours)
 * @param hours - Time in hours (can be decimal)
 * @returns Formatted hours string (e.g., "7h 20m")
 */
export function formatHours(hours: number): string {
  if (!hours || isNaN(hours) || hours <= 0) return '0h';
  
  // Convert decimal hours to whole hours and minutes
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (wholeHours > 0) {
    return `${wholeHours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  }
  return minutes > 0 ? `${minutes}m` : '0h';
}

/**
 * Calculate total session hours from array of session durations in seconds
 * @param sessionDurations - Array of session durations in seconds
 * @returns Total session time in hours (rounded to 1 decimal)
 */
export function calculateTotalSessionHours(sessionDurations: number[]): number {
  const totalSeconds = sessionDurations.reduce((sum, duration) => sum + duration, 0);
  return parseFloat((totalSeconds / 3600).toFixed(1));
}

/**
 * Format date to local date string with consistent formatting
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return 'Invalid Date';
  }
}

/**
 * Format time only from date string with consistent formatting
 * @param dateString - ISO date string
 * @returns Formatted time string
 */
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

/**
 * Format date and time to local date and time string
 * @param dateString - ISO date string
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string | null): string {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString();
  } catch (error) {
    return 'Invalid Date';
  }
}

/**
 * Get current date in YYYY-MM-DD format
 * @returns Current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get time difference between two dates in minutes
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Time difference in minutes
 */
export function getTimeDifferenceInMinutes(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  return Math.round(diffMs / (1000 * 60));
}

/**
 * Parse ISO date string and ensure it's valid
 * @param dateString - ISO date string
 * @returns Date object or null
 */
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
