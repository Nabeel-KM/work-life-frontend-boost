
/**
 * Security utilities for the application
 */

// Simple DOMPurify implementation - in a real app, you'd import a library like dompurify
export const DOMPurify = {
  sanitize: (input: string): string => {
    // Basic sanitization to strip HTML tags
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.body.textContent || '';
  },
  
  // For sanitizing URL inputs
  sanitizeUrl: (url: string): string => {
    if (!url) return '';
    
    // Only allow http, https protocols
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return '';
    }
    
    try {
      const parsed = new URL(url);
      return parsed.toString();
    } catch {
      return '';
    }
  }
};

// Input validation utilities
export const InputValidation = {
  // Check if input matches a pattern
  matchesPattern: (input: string, pattern: RegExp): boolean => {
    return pattern.test(input);
  },
  
  // Validate email format
  isValidEmail: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  
  // Sanitize input for search queries
  sanitizeSearchQuery: (query: string): string => {
    // Remove special characters that could be used for SQL injection
    return query.replace(/[^\w\s]/gi, '');
  }
};
