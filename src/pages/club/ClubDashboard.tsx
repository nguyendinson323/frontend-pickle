import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchClubDashboard } from '../../store/slices/clubDashboardSlice'
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium">{error}</div>
          <button 
            onClick={() => dispatch(fetchClubDashboard())} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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