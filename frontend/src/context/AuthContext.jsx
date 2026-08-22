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
      const storedToken = localStorage.getItem('globetrotter_token');
      const storedUser = localStorage.getItem('globetrotter_user');
      
      if (storedToken) {
        if (storedToken.startsWith('demo-')) {
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              setUser(null);
            }
          }
        } else {
          try {
            const userData = await api.getUser();
            setUser(userData);
          } catch (error) {
            console.error("Failed to fetch user with token, checking stored user:", error);
            if (storedUser) {
              try {
                setUser(JSON.parse(storedUser));
              } catch {
                logout();
              }
            } else {
              logout();
            }
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const cleanEmail = String(email || '').toLowerCase().trim();

    try {
      const response = await api.login({ email: cleanEmail, password });
      
      if (response && (response.success || response.data)) {
        const userData = response.data?.user || response.user || response.data;
        const jwtToken = response.data?.token || response.token || 'valid-jwt-token';
        localStorage.setItem('globetrotter_token', jwtToken);
        localStorage.setItem('globetrotter_user', JSON.stringify(userData));
        setToken(jwtToken);
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      console.warn('API login request encountered issue, falling back to demo authenticator:', error);
    }

    // Fail-safe Demo Accounts Fallback (Admin & User)
    if (cleanEmail === 'admin@globetrotter.in') {
      const adminUser = {
        id: 'u-admin-101',
        name: 'GlobeTrotter Admin',
        email: 'admin@globetrotter.in',
        isAdmin: true,
        role: 'ADMIN',
        profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        languagePref: 'en-IN',
        currencyPref: 'INR'
      };
      localStorage.setItem('globetrotter_token', 'demo-admin-token-2026');
      localStorage.setItem('globetrotter_user', JSON.stringify(adminUser));
      setToken('demo-admin-token-2026');
      setUser(adminUser);
      return { success: true };
    }

    if (cleanEmail === 'aarav@globetrotter.in') {
      const aaravUser = {
        id: 'u-101-aarav',
        name: 'Aarav Sharma',
        email: 'aarav@globetrotter.in',
        isAdmin: false,
        role: 'USER',
        profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        languagePref: 'en-IN',
        currencyPref: 'INR'
      };
      localStorage.setItem('globetrotter_token', 'demo-aarav-token-2026');
      localStorage.setItem('globetrotter_user', JSON.stringify(aaravUser));
      setToken('demo-aarav-token-2026');
      setUser(aaravUser);
      return { success: true };
    }

    return { 
      success: false, 
      message: 'Invalid login credentials. Click "Fill Admin ID" or "Fill User ID" to log in instantly.' 
    };
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

  const updateUser = async (updatedFields) => {
    try {
      setUser((prev) => {
        const newUser = { ...prev, ...updatedFields };
        localStorage.setItem('globetrotter_user', JSON.stringify(newUser));
        return newUser;
      });
      if (token) {
        await api.updateUser(updatedFields).catch(() => {});
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to update user:', error);
      return { success: false };
    }
  };

  function logout() {
    localStorage.removeItem('globetrotter_token');
    localStorage.removeItem('globetrotter_user');
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
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
