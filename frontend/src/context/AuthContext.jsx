import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AUTH, setAuthToken, clearAuthToken } from '../lib/api';

const AuthContext = createContext(null);

const REMEMBER_KEY = 'netflix_remember';
const REMEMBER_DAYS = 30;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async (authToken) => {
    if (!authToken) {
      setUser(null);
      setTokenState(null);
      return;
    }
    try {
      const prevToken = token;
      setTokenState(authToken);
      const data = await AUTH.me();
      setUser(data.user);
    } catch {
      clearAuthToken();
      setUser(null);
      setTokenState(null);
    }
  }, []);

  useEffect(() => {
    const t = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (t) {
      loadUser(t).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [loadUser]);

  const login = useCallback(async (identifier, password, remember = false) => {
    const data = await AUTH.login({ identifier, password });
    setAuthToken(data.token, remember);
    if (remember) {
      const exp = Date.now() + REMEMBER_DAYS * 24 * 60 * 60 * 1000;
      localStorage.setItem(REMEMBER_KEY, String(exp));
    }
    setTokenState(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, username, password, confirmPassword) => {
    const data = await AUTH.register({ name, email, username, password, confirmPassword });
    setAuthToken(data.token, true);
    setTokenState(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    localStorage.removeItem(REMEMBER_KEY);
    setUser(null);
    setTokenState(null);
  }, []);

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    register,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
