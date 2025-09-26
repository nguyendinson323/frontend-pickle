import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchStateDashboard } from '../../store/slices/stateDashboardSlice'
import {
  StateStatsGrid,
  StateQuickActions,
  StatePendingApprovals,
  StateUpcomingTournaments,
  StateRecentActivity,
  StatePerformanceOverview
} from '../../components/state/dashboard'
import { FiHome, FiChevronRight, FiRefreshCw, FiClock, FiLoader } from 'react-icons/fi'

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl shadow-2xl border-2 border-gray-100 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
            <FiLoader className="w-10 h-10 text-white animate-spin" />
          </div>
          <p className="text-xl font-bold text-gray-700">Loading State Dashboard...</p>
        </div>
      </div>
    )
  }

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl shadow-2xl border-2 border-gray-100 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
            <FiLoader className="w-10 h-10 text-white animate-spin" />
          </div>
          <p className="text-xl font-bold text-gray-700">Loading Dashboard Data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl shadow-2xl border-2 border-red-100 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-3xl text-white">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Dashboard Error</h3>
          <div className="text-red-600 text-lg font-medium mb-6">{error}</div>
          <button
            onClick={handleRefresh}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 mx-auto"
          >
            <FiRefreshCw className="w-5 h-5 mr-2" />
            Retry Dashboard
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-3">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-2xl font-medium transition-all duration-300 border-2 border-transparent hover:border-indigo-200 shadow-lg hover:shadow-xl group"
                >
                  <FiHome className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Home
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" />
                  <div className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100 shadow-lg">
                    <span className="text-sm font-bold text-purple-700" aria-current="page">
                      State Dashboard
                    </span>
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Dashboard Header with Controls */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8 bg-gradient-to-r from-indigo-50 via-white to-purple-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center mb-6 lg:mb-0">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-6 shadow-xl">
                  <span className="text-2xl text-white">🏛️</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-2">State Dashboard</h1>
                  <p className="text-lg text-gray-600 font-medium">
                    {profile ? `${profile.name} - ${profile.state?.name || 'Unknown State'}` : 'Loading...'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Refresh Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="bg-white p-4 rounded-2xl border-2 border-blue-100 shadow-lg">
                    <div className="flex items-center text-sm text-blue-700 mb-2">
                      <FiClock className="w-4 h-4 mr-2" />
                      <span className="font-bold">Last updated: {lastRefresh.toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="autoRefresh"
                        checked={autoRefresh}
                        onChange={(e) => setAutoRefresh(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="autoRefresh" className="ml-2 text-sm text-gray-700 font-medium">
                        Auto-refresh
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="flex items-center px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                  >
                    <FiRefreshCw className={`w-5 h-5 mr-3 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Refreshing...' : 'Refresh Data'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation to State Profile Sections */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mr-4 shadow-xl">
              <span className="text-xl text-white">⚡</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { label: 'Account', icon: '👤', path: '/state/account', color: 'from-blue-500 to-blue-600' },
              { label: 'Inbox', icon: '📬', path: '/state/inbox', color: 'from-green-500 to-green-600' },
              { label: 'Management', icon: '⚙️', path: '/state/management', color: 'from-purple-500 to-purple-600' },
              { label: 'Microsite', icon: '🌐', path: '/state/microsite', color: 'from-indigo-500 to-indigo-600' },
              { label: 'Statistics', icon: '📊', path: '/state/statistics', color: 'from-yellow-500 to-orange-600' },
              { label: 'Documents', icon: '📄', path: '/state/documents', color: 'from-red-500 to-pink-600' },
              { label: 'Affiliation', icon: '🏛️', path: '/state/affiliation', color: 'from-teal-500 to-cyan-600' },
              { label: 'Members', icon: '👥', path: '/state/member-management', color: 'from-pink-500 to-rose-600' }
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-full flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <span className="text-xl text-white">{action.icon}</span>
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {dashboardData && (
          <div className="animate-fade-in">
            <StateStatsGrid stateData={dashboardData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <StateQuickActions />
              <StatePendingApprovals pendingApprovals={pendingApprovals} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <StateUpcomingTournaments upcomingTournaments={upcomingTournaments.map(t => ({
                name: t.name,
                location: t.venue_name || 'TBD',
                date: new Date(t.start_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }),
                categories: `${t.tournament_type || 'Mixed'} Tournament`,
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
          </div>
        )}
      </div>
    </div>
  )
}

export default StateDashboardPage