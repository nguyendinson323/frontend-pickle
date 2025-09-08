import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

/**
 * Component that redirects users to their role-specific profile page
 * Used as a fallback for /profile route
 */
export const ProfileRedirect: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/profile" replace />
    case 'player':
      return <Navigate to="/player/profile" replace />
    case 'coach':
      return <Navigate to="/coach/profile" replace />
    case 'club':
      return <Navigate to="/club/profile" replace />
    case 'partner':
      return <Navigate to="/partner/profile" replace />
    case 'state':
      return <Navigate to="/state/profile" replace />
    default:
      return <Navigate to="/" replace />
  }
}