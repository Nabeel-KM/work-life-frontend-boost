
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

// CSRF token generation and validation
export const CSRFProtection = {
  // Generate a CSRF token and store it
  generateToken: (): string => {
    const token = Array(32)
      .fill(0)
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('');
    
    localStorage.setItem('csrf_token', token);
    return token;
  },
  
  // Get the current CSRF token
  getToken: (): string => {
    let token = localStorage.getItem('csrf_token');
    if (!token) {
      token = CSRFProtection.generateToken();
    }
    return token;
  },
  
  // Add CSRF token to headers (for use with fetch or axios)
  addTokenToHeaders: (headers: Record<string, string> = {}): Record<string, string> => {
    return {
      ...headers,
      'X-CSRF-Token': CSRFProtection.getToken(),
    };
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

// Add CSRF meta tag to document head
export const setupCSRFProtection = (): void => {
  // Create or update CSRF meta tag
  let metaTag = document.querySelector('meta[name="csrf-token"]');
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'csrf-token');
    document.head.appendChild(metaTag);
  }
  metaTag.setAttribute('content', CSRFProtection.getToken());
  
  // Setup token refresh every hour
  setInterval(() => {
    metaTag?.setAttribute('content', CSRFProtection.generateToken());
  }, 60 * 60 * 1000); // 1 hour
};
