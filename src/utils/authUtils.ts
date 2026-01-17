/**
 * Auth utility functions
 */

/**
 * Validate email format using regex
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if device is online
 * Note: For more robust offline detection, consider using @react-native-community/netinfo
 */
export const getOfflineStatus = (): boolean => {
  // Basic check - in production, use NetInfo for reliable detection
  if (typeof navigator !== 'undefined' && navigator.onLine !== undefined) {
    return !navigator.onLine;
  }
  return false;
};

/**
 * Password validation (minimum requirements)
 */
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: '' };
};
