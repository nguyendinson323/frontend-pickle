import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }

    // Redirect to user-type specific dashboard
    const dashboardPath = getDashboardPath(user.role)
    navigate(dashboardPath)
  }, [isAuthenticated, user, navigate])

  const getDashboardPath = (role: string): string => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard'
      case 'player':
        return '/player/dashboard'
      case 'coach':
        return '/coach/dashboard'
      case 'club':
        return '/club/dashboard'
      case 'partner':
        return '/partner/dashboard'
      case 'state':
        return '/state/dashboard'
      default:
        return '/login' // fallback to login if invalid role
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}

export default Dashboard