/**
 * Application Configuration
 *
 * Centralized place for application-wide constants and environment variables.
 */

// API Configuration
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || '/api';

// Application Information
export const APP_NAME: string = import.meta.env.VITE_APP_NAME || 'ProCRM';
export const APP_VERSION: string = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Feature Flags (Example)
// export const FEATURE_NEW_DASHBOARD: boolean = import.meta.env.VITE_FEATURE_NEW_DASHBOARD === 'true';

// Other constants
export const DEFAULT_PAGE_SIZE: number = 10;
export const MAX_PAGE_SIZE: number = 100;

// Date/Time Formats
export const DATE_FORMAT_DISPLAY: string = 'dd MMM yyyy'; // e.g., 23 Jul 2024
export const DATETIME_FORMAT_DISPLAY: string = 'dd MMM yyyy, hh:mm a'; // e.g., 23 Jul 2024, 02:30 PM
export const DATE_FORMAT_API: string = 'yyyy-MM-dd'; // e.g., 2024-07-23

// Currency
export const CURRENCY_SYMBOL: string = '₹';
export const CURRENCY_CODE: string = 'INR';

// Default User Role (Example for frontend logic if needed)
// export const DEFAULT_USER_ROLE: string = 'user';

if (import.meta.env.DEV) {
  console.log('Application Config Loaded:', {
    API_BASE_URL,
    APP_NAME,
    APP_VERSION,
  });
}
