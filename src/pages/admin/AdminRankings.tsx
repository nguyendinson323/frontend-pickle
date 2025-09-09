import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { 
  fetchPlayerRankings,
  fetchRankingChanges
} from '../../store/slices/adminRankingsSlice'
import {
  RankingsTable,
  RankingStats,
  RankingFilters,
  RankingChanges,
  RankingActions
} from '../../components/admin/rankings'

const AdminRankings: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { rankingFilter, error } = useSelector((state: RootState) => state.adminRankings)
  
  const [activeTab, setActiveTab] = useState<'rankings' | 'changes' | 'management'>('rankings')
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }

    // Fetch initial data
    dispatch(fetchPlayerRankings(rankingFilter) as any)
    dispatch(fetchRankingChanges(rankingFilter) as any)
  }, [dispatch, user, navigate])

  useEffect(() => {
    // Refresh data when filters change
    if (activeTab === 'rankings') {
      dispatch(fetchPlayerRankings(rankingFilter) as any)
    } else if (activeTab === 'changes') {
      dispatch(fetchRankingChanges(rankingFilter) as any)
    }
  }, [dispatch, rankingFilter, activeTab])

  const handlePlayerSelect = (playerId: number) => {
    setSelectedPlayerId(playerId)
    // Additional logic for showing player details could be added here
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'rankings', label: 'Player Rankings', icon: '🏆' },
    { id: 'changes', label: 'Recent Changes', icon: '📈' },
    { id: 'management', label: 'System Management', icon: '⚙️' }
  ]

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rankings Management</h1>
              <p className="mt-2 text-gray-600">
                Manage player rankings, review changes, and control the ranking system
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover: transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ranking Statistics */}
        <RankingStats />

        {/* System Management Actions (shown on all tabs for quick access) */}
        <RankingActions />

        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'rankings' | 'changes' | 'management')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'rankings' && (
            <>
              <RankingFilters />
              <RankingsTable onPlayerSelect={handlePlayerSelect} />
            </>
          )}

          {activeTab === 'changes' && (
            <>
              <RankingFilters />
              <RankingChanges />
            </>
          )}

          {activeTab === 'management' && (
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Ranking System Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">System Controls</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Use the management actions above to control the ranking system, 
                    recalculate rankings, or freeze/unfreeze the system.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3  rounded">
                      <span className="text-sm font-medium">Automatic Updates</span>
                      <span className="text-sm text-green-600">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between p-3  rounded">
                      <span className="text-sm font-medium">Tournament Integration</span>
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3  rounded">
                      <span className="text-sm font-medium">Manual Adjustments</span>
                      <span className="text-sm text-blue-600">Available</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      • Rankings last recalculated: 2 hours ago
                    </div>
                    <div className="text-sm text-gray-600">
                      • 45 position changes in last 24 hours
                    </div>
                    <div className="text-sm text-gray-600">
                      • 3 manual adjustments this week
                    </div>
                    <div className="text-sm text-gray-600">
                      • System uptime: 99.8%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminRankings