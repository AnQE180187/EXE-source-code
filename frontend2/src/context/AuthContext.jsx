import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { register as registerService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { accessToken } = response.data; // Corrected from access_token
    localStorage.setItem('token', accessToken);
    const decodedUser = jwtDecode(accessToken);
    setUser(decodedUser);
    return decodedUser;
  };

  const register = async (credentials) => {
    const response = await registerService(credentials);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};