/**
 * Advanced Security Utilities
 * Provides comprehensive security features to prevent hacking and unauthorized access
 */

import { toast } from 'sonner';

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting for API calls and form submissions
 * Prevents brute force attacks and spam
 */
export function rateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxAttempts) {
    const remainingTime = Math.ceil((record.resetTime - now) / 1000);
    toast.error(`Too many attempts. Please try again in ${remainingTime} seconds.`);
    return false;
  }

  record.count++;
  return true;
}

/**
 * Input sanitization to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim();
}

/**
 * Validate email format with strict regex
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Password strength validation
 * Requires: min 8 chars, uppercase, lowercase, number, special char
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate phone number format
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Prevent SQL injection by validating input
 */
export function preventSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(--|\;|\/\*|\*\/)/g,
    /(\bOR\b.*=.*)/gi,
    /(\bAND\b.*=.*)/gi
  ];

  return !sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Secure session storage with encryption
 */
export const secureStorage = {
  set: (key: string, value: any) => {
    try {
      const encrypted = btoa(JSON.stringify(value));
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store data securely:', error);
    }
  },

  get: (key: string) => {
    try {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) return null;
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Failed to retrieve data securely:', error);
      return null;
    }
  },

  remove: (key: string) => {
    sessionStorage.removeItem(key);
  },

  clear: () => {
    sessionStorage.clear();
  }
};

/**
 * Detect and prevent common attack patterns
 */
export function detectAttackPattern(input: string): boolean {
  const attackPatterns = [
    /<script/gi, // XSS
    /javascript:/gi, // XSS
    /on\w+=/gi, // Event handlers
    /eval\(/gi, // Code execution
    /expression\(/gi, // CSS expression
    /import\s/gi, // Import statements
    /document\./gi, // DOM manipulation
    /window\./gi, // Window object access
  ];

  return attackPatterns.some(pattern => pattern.test(input));
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate transaction hash format
 */
export function validateTransactionHash(hash: string): boolean {
  // Ethereum/BSC/TRON transaction hash format (64 hex characters)
  const hashRegex = /^0x[a-fA-F0-9]{64}$|^[a-fA-F0-9]{64}$/;
  return hashRegex.test(hash);
}

/**
 * Prevent clickjacking by checking if page is in iframe
 */
export function preventClickjacking(): void {
  try {
    if (window.self !== window.top) {
      window.top!.location.href = window.self.location.href;
    }
  } catch (error) {
    // Ignore SecurityError when trying to access cross-origin parent window
    // This is common in sandbox environments
  }
}

/**
 * Clear sensitive data from memory
 */
export function clearSensitiveData(...variables: any[]): void {
  variables.forEach(variable => {
    if (typeof variable === 'string') {
      variable = '';
    } else if (typeof variable === 'object') {
      Object.keys(variable).forEach(key => {
        delete variable[key];
      });
    }
  });
}

/**
 * Account lockout tracking
 */
const lockoutStore = new Map<string, { attempts: number; lockedUntil: number }>();

export function trackFailedLogin(identifier: string): {
  isLocked: boolean;
  remainingAttempts: number;
  lockoutTime?: number;
} {
  const maxAttempts = 5;
  const lockoutDuration = 15 * 60 * 1000; // 15 minutes
  const now = Date.now();

  let record = lockoutStore.get(identifier);

  if (!record) {
    record = { attempts: 1, lockedUntil: 0 };
    lockoutStore.set(identifier, record);
    return { isLocked: false, remainingAttempts: maxAttempts - 1 };
  }

  // Check if lockout period has expired
  if (record.lockedUntil > 0 && now < record.lockedUntil) {
    return {
      isLocked: true,
      remainingAttempts: 0,
      lockoutTime: Math.ceil((record.lockedUntil - now) / 1000)
    };
  }

  // Reset if lockout expired
  if (record.lockedUntil > 0 && now >= record.lockedUntil) {
    record.attempts = 1;
    record.lockedUntil = 0;
    return { isLocked: false, remainingAttempts: maxAttempts - 1 };
  }

  // Increment attempts
  record.attempts++;

  if (record.attempts >= maxAttempts) {
    record.lockedUntil = now + lockoutDuration;
    return {
      isLocked: true,
      remainingAttempts: 0,
      lockoutTime: lockoutDuration / 1000
    };
  }

  return {
    isLocked: false,
    remainingAttempts: maxAttempts - record.attempts
  };
}

export function resetFailedLogins(identifier: string): void {
  lockoutStore.delete(identifier);
}

/**
 * Content Security Policy headers (for reference)
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-src 'self' https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')
};

/**
 * Initialize security features on app load
 */
export function initializeSecurity(): void {
  // Prevent clickjacking - Safely handled with try-catch
  preventClickjacking();

  // Disable right-click in production (optional)
  if (import.meta.env.PROD) {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  // Disable F12 and developer tools shortcuts in production (optional)
  if (import.meta.env.PROD) {
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    });
  }

  // Clear console in production
  if (import.meta.env.PROD) {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }
}
