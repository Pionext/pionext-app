"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  username: string
  bio: string | null
  role: 'user' | 'builder'
  joinedAt: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

interface AuthContextType extends AuthState {
  login: (data: { email: string; password: string }) => Promise<void>
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })

  // Initialize from localStorage and check session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // First try to get user from localStorage
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setState(prev => ({
          ...prev,
          user: JSON.parse(savedUser),
          isLoading: false
        }))
      }

      // Then verify with the server
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const user = await response.json()
          setState(prev => ({ ...prev, user, isLoading: false }))
          localStorage.setItem('user', JSON.stringify(user))
        } else {
          setState(prev => ({ ...prev, user: null, isLoading: false }))
          localStorage.removeItem('user')
        }
      } catch (error) {
        console.error('Session check failed:', error)
        setState(prev => ({ ...prev, user: null, isLoading: false }))
        localStorage.removeItem('user')
      }
    }

    initializeAuth()
  }, [])

  const login = useCallback(async (data: { email: string; password: string }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Login failed')
      }

      const user = await response.json()
      setState(prev => ({ ...prev, user, isLoading: false }))
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/projects')
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
      }))
    }
  }, [router])

  const register = useCallback(async (data: { name: string; email: string; password: string }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const user = await response.json()
      setState(prev => ({ ...prev, user, isLoading: false }))
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/projects')
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false,
      }))
    }
  }, [router])

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setState({ user: null, isLoading: false, error: null })
      localStorage.removeItem('user')
      router.push('/')
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Logout failed',
        isLoading: false,
      }))
    }
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 