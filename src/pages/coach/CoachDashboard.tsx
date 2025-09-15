import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchCoachDashboard } from '../../store/slices/coachDashboardSlice'
import {
  CoachDashboardHeader,
  CoachStatsGrid,
  CoachQuickActions,
  CoachUpcomingSessions,
  CoachRecentSessions,
  CoachStudentProgress,
  CoachCertifications
} from '../../components/coach/dashboard'

const CoachDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { dashboardData, isLoading, error } = useSelector((state: RootState) => state.coachDashboard)

  useEffect(() => {
    if (!user || user.role !== 'coach') {
      navigate('/login')
      return
    }
    
    if (!dashboardData) {
      dispatch(fetchCoachDashboard())
    }
  }, [user, navigate, dispatch, dashboardData])

  if (!user || user.role !== 'coach') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-indigo-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard</h3>
          <p className="text-gray-600 text-sm">Please wait while we load your coaching data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load dashboard</h3>
          <p className="text-red-600 text-sm mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => dispatch(fetchCoachDashboard())}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/coach/profile')}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <CoachDashboardHeader profile={dashboardData.profile} />

        <CoachStatsGrid stats={dashboardData.stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CoachQuickActions />
          <CoachUpcomingSessions sessions={dashboardData.upcomingSessions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CoachRecentSessions sessions={dashboardData.recentSessions} />
          <CoachStudentProgress studentProgress={dashboardData.studentProgress} />
        </div>

        <CoachCertifications certifications={dashboardData.certifications} />
      </div>
    </div>
  )
}

export default CoachDashboardPage