import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { StateDashboard } from '../../types'
import {
  StateDashboardHeader,
  StateStatsGrid,
  StateQuickActions,
  StatePendingApprovals,
  StateUpcomingTournaments,
  StateRecentActivity,
  StatePerformanceOverview
} from '../../components/state/StateDashboard'

const StateDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, dashboard } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!user || user.role !== 'state') {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user || user.role !== 'state' || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const stateData = dashboard as StateDashboard
  const profile = stateData.profile
  const pendingApprovals = stateData.pendingApprovals || []
  const upcomingTournaments = stateData.upcomingTournaments || []
  const recentActivity = stateData.recentActivity || []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <StateDashboardHeader profile={{
          committeeName: profile.name,
          stateCoverage: profile.state?.name || 'Unknown',
          presidentName: profile.president_name || 'Unknown'
        }} />

        <StateStatsGrid stateData={stateData} />

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

        <StatePerformanceOverview stateData={stateData} />
      </div>
    </div>
  )
}

export default StateDashboardPage