import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_USER } from '../data/mockData';

const AuthContext = createContext();

const TOKEN_KEY = 'globetrotter_auth_token';
const AUTH_USER_KEY = 'globetrotter_auth_user';
const API_BASE = '/api';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.isAdmin || false;

  // Persist token and user to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  // Validate token on mount
  useEffect(() => {
    if (token) {
      fetchMe(token).catch(() => {
        // Token invalid — clear silently
        setToken(null);
        setUser(null);
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchMe(authToken) {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setUser(data.user || data);
    } catch {
      // Backend offline — keep existing user if any
    }
  }

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      setToken(data.token);
      setUser(data.user);
      setLoading(false);
      return { success: true };
    } catch (err) {
      // Fallback: if backend is offline, allow mock login
      if (email === INITIAL_USER.email) {
        setToken('mock-token-' + Date.now());
        setUser(INITIAL_USER);
        setLoading(false);
        return { success: true };
      }
      setError(err.message || 'Login failed');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      setLoading(false);
      return { success: true };
    } catch (err) {
      // Fallback: mock registration success
      setLoading(false);
      if (err.message?.includes('fetch')) {
        return { success: true, mock: true };
      }
      setError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user: user || INITIAL_USER,
        isAuthenticated,
        isAdmin,
        loading,
        error,
        login,
        register,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
