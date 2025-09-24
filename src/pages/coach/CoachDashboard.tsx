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
import {
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
  FiUser
} from 'react-icons/fi'

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-indigo-600 mx-auto mb-6">
            <FiLoader className="h-8 w-8 text-transparent" />
          </div>
          <p className="text-gray-600 font-medium text-lg">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-indigo-600 mx-auto mb-6">
              <FiLoader className="h-8 w-8 text-transparent" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Dashboard</h3>
            <p className="text-gray-600 font-medium text-lg">Please wait while we load your coaching data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to load dashboard</h3>
            <p className="text-red-600 font-medium text-lg mb-8">{error}</p>
            <div className="space-y-4">
              <button
                onClick={() => dispatch(fetchCoachDashboard())}
                className="w-full px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
              >
                <FiRefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </button>
              <button
                onClick={() => navigate('/coach/profile')}
                className="w-full px-8 py-3 border-2 border-gray-300 text-gray-700 font-bold bg-white hover:bg-gray-50 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <FiUser className="w-5 h-5 mr-2" />
                Go to Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
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