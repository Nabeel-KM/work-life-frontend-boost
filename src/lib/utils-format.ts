
// Format time from minutes to a readable format
export function formatTime(minutes: number): string {
  if (!minutes) return '0m';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${remainingMinutes}m`;
}

// Format seconds to a readable format
export function formatTimeFromSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return formatTime(minutes);
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
    return new Date(dateString).toLocaleTimeString();
  } catch (error) {
    return 'Invalid Time';
  }
}

// Get current date in YYYY-MM-DD format
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}
