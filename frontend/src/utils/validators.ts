/**
 * Utility functions for client-side validation.
 * These can be used alongside schema-based validation (e.g., Zod) for simpler or more specific checks.
 */

/**
 * Checks if a value is a non-empty string (after trimming).
 * @param value The value to check.
 * @returns True if the value is a non-empty string, false otherwise.
 */
export const isNotEmpty = (value: any): boolean => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Checks if a value is a valid email address.
 * Uses a simple regex, consider a more robust library for production if needed.
 * @param email The email string to validate.
 * @returns True if the email is valid, false otherwise.
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  // Basic email regex, can be enhanced
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return emailRegex.test(email);
};

/**
 * Checks if a value is a valid Indian phone number (basic check for 10 digits, optionally starting with +91).
 * @param phone The phone number string to validate.
 * @returns True if the phone number format is considered valid, false otherwise.
 */
export const isValidIndianPhoneNumber = (phone: string): boolean => {
  if (!phone) return false;
  // Allows optional +91 followed by 10 digits
  const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, '')); // Remove spaces/hyphens before testing
};

/**
 * Checks if a value is a positive number.
 * @param value The value to check.
 * @returns True if the value is a positive number, false otherwise.
 */
export const isPositiveNumber = (value: any): boolean => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

/**
 * Checks if a value is a non-negative number (includes zero).
 * @param value The value to check.
 * @returns True if the value is a non-negative number, false otherwise.
 */
export const isNonNegativeNumber = (value: any): boolean => {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};

/**
 * Checks if a string's length is within a specified range.
 * @param value The string to check.
 * @param minLength The minimum allowed length (inclusive).
 * @param maxLength The maximum allowed length (inclusive).
 * @returns True if the string length is within the range, false otherwise.
 */
export const isLengthBetween = (value: string, minLength: number, maxLength: number): boolean => {
  if (typeof value !== 'string') return false;
  return value.length >= minLength && value.length <= maxLength;
};

/**
 * Checks if a URL is valid (basic check).
 * @param url The URL string to validate.
 * @returns True if the URL format is considered valid, false otherwise.
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};
