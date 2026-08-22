import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('globetrotter_token'));
  const [loading, setLoading] = useState(true);

  // Initialize Auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await api.getUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user with token:", error);
          logout(); // Invalid token, clear it out
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.login({ email, password });
      
      if (response.success && response.data) {
        const { user: userData, token: jwtToken } = response.data;
        localStorage.setItem('globetrotter_token', jwtToken);
        setToken(jwtToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.response?.data?.error || 'An error occurred during login' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.register(userData);
      
      if (response.success && response.data) {
        const { user: newUser, token: jwtToken } = response.data;
        localStorage.setItem('globetrotter_token', jwtToken);
        setToken(jwtToken);
        setUser(newUser);
        return { success: true };
      }
      return { success: false, message: response.message || 'Registration failed' };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.response?.data?.error || 'An error occurred during registration' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('globetrotter_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
