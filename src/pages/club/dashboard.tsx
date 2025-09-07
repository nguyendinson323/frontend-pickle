import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchClubDashboard, setActiveTab } from '../../store/slices/clubSlice'
import ClubProfile from '../../components/club/dashboard/ClubProfile'
import ClubCourts from '../../components/club/dashboard/ClubCourts'
import ClubReservations from '../../components/club/dashboard/ClubReservations'
import ClubTournaments from '../../components/club/dashboard/ClubTournaments'
import ClubMicrosite from '../../components/club/dashboard/ClubMicrosite'
import ClubFinancials from '../../components/club/dashboard/ClubFinancials'
import ClubInbox from '../../components/club/dashboard/ClubInbox'

const ClubDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { profile, stats, loading, error, activeTab } = useSelector((state: RootState) => state.club)
  const { user } = useSelector((state: RootState) => state.auth)

  // Based on Club model fields: name, rfc, manager_name, manager_title, state_id, club_type,
  // website, social_media, logo_url, has_courts, premium_expires_at, affiliation_expires_at
  // And associations: courts, tournaments, microsite
  const tabs = [
    { id: 'profile', name: 'Club Profile', icon: '🏢', description: 'Club information and settings' },
    { id: 'courts', name: 'Court Management', icon: '🏟️', description: 'Manage club courts and schedules' },
    { id: 'reservations', name: 'Reservations', icon: '📅', description: 'Court bookings and calendar' },
    { id: 'tournaments', name: 'Tournament Management', icon: '🏆', description: 'Organize and manage tournaments' },
    { id: 'microsite', name: 'Club Microsite', icon: '🌐', description: 'Manage club website and content' },
    { id: 'financials', name: 'Payments & Reports', icon: '💰', description: 'Financial tracking and invoicing' },
    { id: 'inbox', name: 'Messages', icon: '📧', description: 'Notifications and messages' }
  ]

  useEffect(() => {
    dispatch(fetchClubDashboard())
  }, [dispatch])

  const handleTabChange = (tabId: string) => {
    dispatch(setActiveTab(tabId))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ClubProfile />
      case 'courts':
        return <ClubCourts />
      case 'reservations':
        return <ClubReservations />
      case 'tournaments':
        return <ClubTournaments />
      case 'microsite':
        return <ClubMicrosite />
      case 'financials':
        return <ClubFinancials />
      case 'inbox':
        return <ClubInbox />
      default:
        return <ClubProfile />
    }
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading club dashboard...</p>
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
            onClick={() => dispatch(fetchClubDashboard())}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const isPremium = profile?.premium_expires_at && new Date(profile.premium_expires_at) > new Date()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile?.name || 'Club Dashboard'}
              </h1>
              <p className="text-gray-600 mt-2">
                {profile?.club_type} Club - {profile?.manager_name} ({profile?.manager_title})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {isPremium ? (
                <div className="bg-gold-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  PREMIUM
                </div>
              ) : (
                <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  BASIC
                </div>
              )}
              <div className="text-sm text-gray-500">
                Courts: {stats?.totalCourts || 0}
              </div>
              <div className="text-sm text-gray-500">
                Members: {stats?.totalMembers || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-blue-600">🏟️</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalCourts}
                  </div>
                  <div className="text-sm text-gray-600">Total Courts</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-green-600">📅</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.todayReservations}
                  </div>
                  <div className="text-sm text-gray-600">Today's Bookings</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-purple-600">🏆</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.activeTournaments}
                  </div>
                  <div className="text-sm text-gray-600">Active Tournaments</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-green-600">💰</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    ${stats.monthlyRevenue?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
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
                  } ${['courts', 'tournaments', 'financials'].includes(tab.id) && !isPremium ? 'opacity-60' : ''}`}
                  disabled={['courts', 'tournaments', 'financials'].includes(tab.id) && !isPremium}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                  {['courts', 'tournaments', 'financials'].includes(tab.id) && !isPremium && (
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

export default ClubDashboard