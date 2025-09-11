import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchStateDashboard, fetchStatePerformanceMetrics } from '../../store/slices/stateDashboardSlice'
import {
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
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { dashboardData, isLoading, error } = useSelector((state: RootState) => state.stateDashboard)
  
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'state') {
      navigate('/login')
      return
    }
    
    // Always fetch fresh data on mount
    dispatch(fetchStateDashboard())
    setLastRefresh(new Date())
  }, [user, navigate, dispatch, isAuthenticated])

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (autoRefresh) {
      interval = setInterval(() => {
        dispatch(fetchStateDashboard())
        setLastRefresh(new Date())
      }, 60000) // Refresh every minute
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [autoRefresh, dispatch])

  const handleRefresh = () => {
    dispatch(fetchStateDashboard())
    setLastRefresh(new Date())
  }

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
            onClick={handleRefresh} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const profile = dashboardData?.profile
  const pendingApprovals = dashboardData?.pendingApprovals || []
  const upcomingTournaments = dashboardData?.upcomingTournaments || []
  const recentActivity = dashboardData?.recentActivity || []

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500" aria-current="page">
                    State Dashboard
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Dashboard Header with Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">State Dashboard</h1>
              <p className="text-gray-600">
                {profile ? `${profile.name} - ${profile.state?.name || 'Unknown State'}` : 'Loading...'}
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-4">
              {/* Refresh Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoRefresh"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoRefresh" className="ml-2 text-sm text-gray-600">
                    Auto-refresh
                  </label>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                <svg 
                  className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Quick Navigation to State Profile Sections */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { label: 'Account', icon: '👤', path: '/state/account' },
              { label: 'Inbox', icon: '📬', path: '/state/inbox' },
              { label: 'Management', icon: '⚙️', path: '/state/management' },
              { label: 'Microsite', icon: '🌐', path: '/state/microsite' },
              { label: 'Statistics', icon: '📊', path: '/state/statistics' },
              { label: 'Documents', icon: '📄', path: '/state/documents' },
              { label: 'Affiliation', icon: '🏛️', path: '/state/affiliation' },
              { label: 'Members', icon: '👥', path: '/state/member-management' }
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
              >
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700 text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {dashboardData && (
          <>
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

            <StatePerformanceOverview stateData={{
              playerGrowth: dashboardData.stats.playerGrowth,
              newClubs: dashboardData.stats.newClubs,
              tournamentParticipation: dashboardData.stats.tournamentParticipation,
              nationalRanking: dashboardData.stats.nationalRanking
            }} />
          </>
        )}
      </div>
    </div>
  )
}

export default StateDashboardPage