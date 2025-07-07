import { useState, useEffect } from 'react'
import { authAPI } from '@/services/api'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      setAuthState({
        user: JSON.parse(user),
        token,
        isAuthenticated: true,
        isLoading: false,
      })
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await authAPI.login({ email, password })
      const { user, token } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      })
      
      return { success: true }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { 
        success: false, 
        error: error.response?.data?.message || 'Đăng nhập thất bại' 
      }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await authAPI.register({ email, password, name })
      const { user, token } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      })
      
      return { success: true }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { 
        success: false, 
        error: error.response?.data?.message || 'Đăng ký thất bại' 
      }
    }
  }

  return {
    ...authState,
    login,
    logout,
    register,
  }
} 