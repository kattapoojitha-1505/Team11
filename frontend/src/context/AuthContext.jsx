import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('nimbus_user');
    const storedToken = localStorage.getItem('nimbus_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('nimbus_user', JSON.stringify(data.user));
      localStorage.setItem('nimbus_token', data.token);
      return data.user;
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.message || 'Login failed';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authService.register(username, email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('nimbus_user', JSON.stringify(data.user));
      localStorage.setItem('nimbus_token', data.token);
      return data.user;
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.message || 'Registration failed';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nimbus_user');
    localStorage.removeItem('nimbus_token');
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
