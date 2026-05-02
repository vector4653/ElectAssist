export const getFriendlyErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred.';
  
  const errorCode = error.code || error.message || '';

  // Common Auth Errors
  if (errorCode.includes('auth/invalid-credential') || errorCode.includes('auth/wrong-password') || errorCode.includes('auth/user-not-found')) {
    return 'Invalid email or password. Please try again.';
  }
  if (errorCode.includes('auth/email-already-in-use')) {
    return 'An account already exists with this email address. Please log in instead.';
  }
  if (errorCode.includes('auth/weak-password')) {
    return 'Your password is too weak. Please use at least 6 characters.';
  }
  if (errorCode.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (errorCode.includes('auth/too-many-requests')) {
    return 'Access to this account has been temporarily disabled due to many failed login attempts. Please try again later.';
  }
  if (errorCode.includes('auth/network-request-failed')) {
    return 'A network error occurred. Please check your internet connection.';
  }
  if (errorCode.includes('auth/popup-closed-by-user')) {
    return 'The sign-in popup was closed before completing. Please try again.';
  }

  // Fallback for raw error messages that aren't mapped
  if (typeof error === 'string') return error;
  if (error.message) return error.message.replace('Firebase: ', '');

  return 'An unexpected error occurred. Please try again.';
};
