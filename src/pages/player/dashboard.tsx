import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchPlayerDashboard, setActiveTab } from '../../store/slices/playerSlice'
import PlayerCredential from '../../components/player/dashboard/PlayerCredential'
import PlayerProfile from '../../components/player/dashboard/PlayerProfile'
import PlayerTournaments from '../../components/player/dashboard/PlayerTournaments'
import PlayerReservations from '../../components/player/dashboard/PlayerReservations'
import PlayerRankings from '../../components/player/dashboard/PlayerRankings'
import PlayerFinder from '../../components/player/dashboard/PlayerFinder'
import PlayerInbox from '../../components/player/dashboard/PlayerInbox'

const PlayerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { profile, stats, loading, error, activeTab } = useSelector((state: RootState) => state.player)
  const { user } = useSelector((state: RootState) => state.auth)

  // Based on Player model fields: full_name, birth_date, gender, state_id, curp, nrtp_level, 
  // profile_photo_url, id_document_url, nationality, club_id, ranking_position, affiliation_expires_at
  // And associations: courtReservations, tournamentRegistrations, availabilities, rankings
  const tabs = [
    { id: 'credential', name: 'Digital Credential', icon: '🏅', description: 'Official player credential with QR code' },
    { id: 'profile', name: 'Profile & Account', icon: '👤', description: 'Personal information and affiliation' },
    { id: 'tournaments', name: 'My Tournaments', icon: '🏆', description: 'Tournament registrations and results' },
    { id: 'reservations', name: 'Court Reservations', icon: '🏟️', description: 'Court bookings and availability' },
    { id: 'rankings', name: 'Rankings & Stats', icon: '📈', description: 'Player rankings and performance history' },
    { id: 'finder', name: 'Player Finder', icon: '🤝', description: 'Find nearby players to play with', premium: true },
    { id: 'inbox', name: 'Messages', icon: '📧', description: 'Notifications and messages' }
  ]

  useEffect(() => {
    dispatch(fetchPlayerDashboard())
  }, [dispatch])

  const handleTabChange = (tabId: string) => {
    dispatch(setActiveTab(tabId))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'credential':
        return <PlayerCredential />
      case 'profile':
        return <PlayerProfile />
      case 'tournaments':
        return <PlayerTournaments />
      case 'reservations':
        return <PlayerReservations />
      case 'rankings':
        return <PlayerRankings />
      case 'finder':
        return <PlayerFinder />
      case 'inbox':
        return <PlayerInbox />
      default:
        return <PlayerCredential />
    }
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading player dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading dashboard</div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => dispatch(fetchPlayerDashboard())}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {profile?.full_name || user?.username}
              </h1>
              <p className="text-gray-600 mt-2">Player Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Ranking: #{stats?.currentRanking || 'Unranked'}
              </div>
              {user?.is_premium && (
                <div className="bg-gold-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  PREMIUM
                </div>
              )}
              <div className="text-sm text-gray-500">
                Points: {stats?.totalPoints || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-blue-600">🏆</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalTournaments}
                  </div>
                  <div className="text-sm text-gray-600">Tournaments</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-green-600">🏟️</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalReservations}
                  </div>
                  <div className="text-sm text-gray-600">Court Bookings</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-purple-600">📈</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    #{stats.currentRanking || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Current Ranking</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-yellow-600">📧</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.unreadNotifications}
                  </div>
                  <div className="text-sm text-gray-600">Unread Messages</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } ${tab.premium && !user?.is_premium ? 'opacity-60' : ''}`}
                  disabled={tab.premium && !user?.is_premium}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                  {tab.premium && !user?.is_premium && (
                    <span className="text-xs bg-gold-600 text-white px-1 rounded">PREMIUM</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow min-h-96">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default PlayerDashboard