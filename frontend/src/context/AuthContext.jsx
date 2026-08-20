import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user profile if token exists on initial load
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await API.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to load user profile:', error.response?.data?.message || error.message);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  // Handle user login
  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const { token: jwtToken, ...userData } = response.data;
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  // Handle user registration
  const register = async (name, email, password) => {
    const response = await API.post('/auth/register', { name, email, password });
    const { token: jwtToken, ...userData } = response.data;
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
