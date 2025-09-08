import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

/**
 * Component that redirects users to their role-specific dashboard
 * Used as a fallback for /dashboard route
 */
export const DashboardRedirect: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />
    case 'player':
      return <Navigate to="/player/dashboard" replace />
    case 'coach':
      return <Navigate to="/coach/dashboard" replace />
    case 'club':
      return <Navigate to="/club/dashboard" replace />
    case 'partner':
      return <Navigate to="/partner/dashboard" replace />
    case 'state':
      return <Navigate to="/state/dashboard" replace />
    default:
      return <Navigate to="/" replace />
  }
}