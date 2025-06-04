import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import { User } from '../types';
import { LoginCredentials } from '../services/authService';

interface AuthContextState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true to check initial auth state
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token and user in localStorage on initial load
    const storedToken = authService.getAuthToken();
    const storedUser = authService.getCurrentUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUserState(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const authResponse = await authService.login(credentials);
      setUserState(authResponse.user);
      setToken(authResponse.token);
      navigate('/'); // Navigate to dashboard or intended page
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    authService.logout();
    setUserState(null);
    setToken(null);
    navigate('/login');
  }, [navigate]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  }, []);

  const isAuthenticated = useMemo(() => !!token && !!user, [token, user]);

  const contextValue = useMemo(() => ({
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
    setUser
  }), [user, token, isAuthenticated, isLoading, error, login, logout, clearError, setUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
