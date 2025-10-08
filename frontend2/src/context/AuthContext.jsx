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
    const fetchFullUser = async (decodedUser) => {
      try {
        const response = await api.get('/users/me');
        setUser({
          ...decodedUser,
          avatarUrl: response.data.profile?.avatarUrl,
          displayName: response.data.profile?.displayName,
        });
      } catch (error) {
        setUser(decodedUser);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        fetchFullUser(decodedUser);
      } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem('token');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Hàm refreshUser: lấy lại profile từ API và cập nhật avatarUrl vào user context
  const refreshUser = async () => {
    try {
      const response = await api.get('/users/me');
      // Cập nhật avatarUrl và displayName vào user context
      setUser((prev) => ({ 
        ...prev, 
        avatarUrl: response.data.profile?.avatarUrl,
        displayName: response.data.profile?.displayName,
      }));
    } catch (error) {
      // Không cập nhật nếu lỗi
    }
  };

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { accessToken } = response.data;
    localStorage.setItem('token', accessToken);
    const decodedUser = jwtDecode(accessToken);
    // Lấy thông tin profile đầy đủ
    try {
      const profileRes = await api.get('/users/me');
      setUser({
        ...decodedUser,
        avatarUrl: profileRes.data.profile?.avatarUrl,
        displayName: profileRes.data.profile?.displayName,
      });
    } catch (error) {
      setUser(decodedUser);
    }
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
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};