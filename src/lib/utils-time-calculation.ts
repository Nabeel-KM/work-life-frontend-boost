
/**
 * Utility functions for time calculations and formatting
 */

/**
 * Convert seconds to hours and minutes
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "2h 30m")
 */
export function formatSecondsToTime(seconds: number): string {
  if (!seconds || seconds <= 0) return '0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  }
  return `${minutes}m`;
}

/**
 * Convert minutes to hours and minutes
 * @param minutes - Time in minutes
 * @returns Formatted time string (e.g., "2h 30m")
 */
export function formatMinutesToTime(minutes: number): string {
  if (!minutes || minutes <= 0) return '0m';
  return formatSecondsToTime(minutes * 60);
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
 * Format hours value to a readable string with "h" suffix
 * @param hours - Time in hours
 * @returns Formatted hours string (e.g., "2.5h")
 */
export function formatHours(hours: number): string {
  if (!hours || hours <= 0) return '0h';
  return `${hours.toFixed(1)}h`;
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
