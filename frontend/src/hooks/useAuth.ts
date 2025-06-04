import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';

/**
 * Custom hook to access authentication context.
 * Provides authentication state (user, isAuthenticated, isLoading, error)
 * and methods (login, logout, register).
 *
 * @throws Error if used outside of an AuthProvider.
 * @returns The authentication context.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
