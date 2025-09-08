import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { UserRole } from '../types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requireAuth?: boolean
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // If specific roles are required but user doesn't have the right role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard if user is authenticated but wrong role
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />
    }
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}