import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import {
  fetchPlayerRankings,
  fetchRankingChanges,
  fetchRankingStats,
  fetchRankingPeriods,
  fetchRankingCategories,
  getPlayerRankingHistory,
  setSelectedPlayer
} from '../../store/slices/adminRankingsSlice'
import {
  RankingsTable,
  RankingStats,
  RankingFilters,
  RankingChanges,
  RankingActions,
  PlayerDetailModal
} from '../../components/admin/rankings'
import {
  FiAward,
  FiTrendingUp,
  FiSettings,
  FiArrowLeft,
  FiAlertCircle,
  FiLoader,
  FiPlay,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi'

const AdminRankings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { rankingFilter, error, playerRankings, selectedPlayer } = useSelector((state: RootState) => state.adminRankings)
  
  const [activeTab, setActiveTab] = useState<'rankings' | 'changes' | 'management'>('rankings')
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const [playerHistory, setPlayerHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }

    // Fetch initial data
    dispatch(fetchPlayerRankings(rankingFilter))
    dispatch(fetchRankingChanges(rankingFilter))
    dispatch(fetchRankingStats())
    dispatch(fetchRankingPeriods())
    dispatch(fetchRankingCategories())
  }, [dispatch, user, navigate, rankingFilter])

  useEffect(() => {
    // Refresh data when filters change
    if (activeTab === 'rankings') {
      dispatch(fetchPlayerRankings(rankingFilter))
    } else if (activeTab === 'changes') {
      dispatch(fetchRankingChanges(rankingFilter))
    }
  }, [dispatch, rankingFilter, activeTab])

  const handlePlayerSelect = async (playerId: number) => {
    setSelectedPlayerId(playerId)

    // Find the selected player from current rankings
    const selectedPlayerData = playerRankings.find(p => p.player_id === playerId)
    if (selectedPlayerData) {
      dispatch(setSelectedPlayer(selectedPlayerData))
    }

    // Fetch player history and show modal
    setLoadingHistory(true)
    try {
      const historyData = await dispatch(getPlayerRankingHistory(playerId))
      setPlayerHistory((historyData as any).payload?.history || [])
    } catch (error) {
      console.error('Failed to fetch player history:', error)
      setPlayerHistory([])
    } finally {
      setLoadingHistory(false)
      setShowPlayerModal(true)
    }
  }

  const handleClosePlayerModal = () => {
    setShowPlayerModal(false)
    setSelectedPlayerId(null)
    setPlayerHistory([])
    dispatch(setSelectedPlayer(null))
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading rankings management...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we set up your admin panel</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'rankings', label: 'Player Rankings', icon: FiAward },
    { id: 'changes', label: 'Recent Changes', icon: FiTrendingUp },
    { id: 'management', label: 'System Management', icon: FiSettings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg mr-6">
                <FiAward className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Rankings Management</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Manage player rankings, review changes, and control the ranking system
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-xl shadow-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <FiAlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-red-800">Error Occurred</h3>
                <div className="mt-2 text-red-700 font-medium">
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
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'rankings' | 'changes' | 'management')}
                    className={`relative inline-flex items-center px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 transform hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'rankings' && (
            <>
              <RankingFilters />
              <RankingsTable onPlayerSelect={handlePlayerSelect} selectedPlayerId={selectedPlayerId} />
            </>
          )}

          {activeTab === 'changes' && (
            <>
              <RankingFilters />
              <RankingChanges />
            </>
          )}

          {activeTab === 'management' && (
            <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
                    <FiSettings className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Ranking System Management
                  </h3>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mr-3">
                        <FiSettings className="h-4 w-4" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">System Controls</h4>
                    </div>
                    <p className="text-gray-600 font-medium mb-6">
                      Use the management actions above to control the ranking system,
                      recalculate rankings, or freeze/unfreeze the system.
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-blue-200">
                        <div className="flex items-center space-x-3">
                          <FiPlay className="h-5 w-5 text-green-600" />
                          <span className="font-bold text-gray-900">Automatic Updates</span>
                        </div>
                        <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-xl font-bold border border-green-300">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-blue-200">
                        <div className="flex items-center space-x-3">
                          <FiAward className="h-5 w-5 text-green-600" />
                          <span className="font-bold text-gray-900">Tournament Integration</span>
                        </div>
                        <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-xl font-bold border border-green-300">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-blue-200">
                        <div className="flex items-center space-x-3">
                          <FiSettings className="h-5 w-5 text-blue-600" />
                          <span className="font-bold text-gray-900">Manual Adjustments</span>
                        </div>
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-xl font-bold border border-blue-300">Available</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-100 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
                        <FiClock className="h-4 w-4" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Recent Activity</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 shadow-md border border-purple-200">
                        <div className="flex items-center space-x-3">
                          <FiCheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-bold text-gray-900">
                            Rankings last recalculated: 2 hours ago
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-md border border-purple-200">
                        <div className="flex items-center space-x-3">
                          <FiTrendingUp className="h-5 w-5 text-orange-600" />
                          <span className="font-bold text-gray-900">
                            45 position changes in last 24 hours
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-md border border-purple-200">
                        <div className="flex items-center space-x-3">
                          <FiSettings className="h-5 w-5 text-blue-600" />
                          <span className="font-bold text-gray-900">
                            3 manual adjustments this week
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-md border border-purple-200">
                        <div className="flex items-center space-x-3">
                          <FiCheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-bold text-gray-900">
                            System uptime: 99.8%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <PlayerDetailModal
        isOpen={showPlayerModal && selectedPlayerId !== null && selectedPlayer !== null}
        onClose={handleClosePlayerModal}
        selectedPlayer={selectedPlayer}
        playerHistory={playerHistory}
        loadingHistory={loadingHistory}
      />
    </div>
  )
}

export default AdminRankings