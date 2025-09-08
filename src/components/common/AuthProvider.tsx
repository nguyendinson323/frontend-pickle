import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { LoadingSpinner } from './LoadingSpinner'

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * AuthProvider component that handles authentication state initialization
 * Checks for stored tokens and validates them on app startup
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, isAuthenticated, token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token')
      
      if (storedToken && !isAuthenticated) {
        // Here you would typically validate the token with the backend
        // and fetch user data if the token is still valid
        // For now, we'll just set the loading state
        
        try {
          // Example: Validate token and fetch user data
          // const userData = await authService.validateToken(storedToken)
          // dispatch(loginSuccess(userData))
          
          console.log('Token found in localStorage, would validate here')
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('token')
          console.error('Token validation failed:', error)
        }
      }
    }

    initializeAuth()
  }, [dispatch, isAuthenticated])

  // Show loading spinner while initializing auth
  if (isLoading && !isAuthenticated && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" message="Loading application..." />
      </div>
    )
  }

  return <>{children}</>
}