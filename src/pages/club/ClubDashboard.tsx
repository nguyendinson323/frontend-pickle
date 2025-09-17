import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchClubDashboard } from '../../store/slices/clubDashboardSlice'
import {
  FiLoader,
  FiAlertTriangle,
  FiRefreshCw
} from 'react-icons/fi'
import {
  ClubDashboardHeader,
  ClubStatsGrid,
  ClubQuickActions,
  ClubRecentMembers,
  ClubUpcomingTournaments,
  ClubCourtActivity,
  ClubPerformanceSection
} from '../../components/club/dashboard'

const ClubDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { dashboardData, isLoading, error } = useSelector((state: RootState) => state.clubDashboard)

  useEffect(() => {
    if (!user || user.role !== 'club') {
      navigate('/login')
      return
    }
    
    if (!dashboardData) {
      dispatch(fetchClubDashboard())
    }
  }, [user, navigate, dispatch, dashboardData])

  if (!user || user.role !== 'club') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-6">
            <FiLoader className="animate-spin h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Authenticating</h3>
          <p className="text-gray-600 font-medium">Please wait while we verify your access</p>
        </div>
      </div>
    )
  }

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-6">
            <FiLoader className="animate-spin h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Dashboard</h3>
          <p className="text-gray-600 font-medium">Please wait while we fetch your club data</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-6">
            <FiAlertTriangle className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Error</h3>
          <p className="text-red-800 font-medium mb-6 bg-red-100 rounded-2xl p-4">{error}</p>
          <button
            onClick={() => dispatch(fetchClubDashboard())}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiRefreshCw className="h-5 w-5 mr-2" />
            Retry Loading
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ClubDashboardHeader profile={dashboardData.profile} />

        <ClubStatsGrid stats={dashboardData.stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ClubQuickActions />
          <ClubRecentMembers members={dashboardData.recentMembers} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ClubUpcomingTournaments tournaments={dashboardData.upcomingTournaments} />
          <ClubCourtActivity
            todaysBookings={dashboardData.stats.todaysBookings}
            weeklyUsage={dashboardData.stats.weeklyUsage}
          />
        </div>

        <ClubPerformanceSection 
          memberGrowth={dashboardData.stats.memberGrowth} 
          monthlyRevenue={dashboardData.stats.monthlyRevenue} 
          memberSatisfaction={dashboardData.stats.memberSatisfaction} 
        />
      </div>
    </div>
  )
}

export default ClubDashboardPage