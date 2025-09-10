import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchStateDashboard } from '../../store/slices/stateDashboardSlice'
import {
  StateDashboardHeader,
  StateStatsGrid,
  StateQuickActions,
  StatePendingApprovals,
  StateUpcomingTournaments,
  StateRecentActivity,
  StatePerformanceOverview
} from '../../components/state/dashboard'

const StateDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { dashboardData, isLoading, error } = useSelector((state: RootState) => state.stateDashboard)

  useEffect(() => {
    if (!user || user.role !== 'state') {
      navigate('/login')
      return
    }
    
    if (!dashboardData) {
      dispatch(fetchStateDashboard())
    }
  }, [user, navigate, dispatch, dashboardData])

  if (!user || user.role !== 'state') {
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
            onClick={() => dispatch(fetchStateDashboard())} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const profile = dashboardData.profile
  const pendingApprovals = dashboardData.pendingApprovals || []
  const upcomingTournaments = dashboardData.upcomingTournaments || []
  const recentActivity = dashboardData.recentActivity || []

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <StateDashboardHeader profile={{
          committeeName: profile.name,
          stateCoverage: profile.state?.name || 'Unknown',
          presidentName: profile.president_name || 'Unknown'
        }} />

        <StateStatsGrid stateData={dashboardData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <StateQuickActions />
          <StatePendingApprovals pendingApprovals={pendingApprovals} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <StateUpcomingTournaments upcomingTournaments={upcomingTournaments.map(t => ({
            id: t.id,
            name: t.name,
            location: t.venue_name || 'TBD',
            date: t.start_date,
            categories: 'All Categories',
            registrations: 0
          }))} />
          <StateRecentActivity recentActivity={recentActivity} />
        </div>

        <StatePerformanceOverview stateData={dashboardData} />
      </div>
    </div>
  )
}

export default StateDashboardPage