import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchPartnerDashboard, setActiveTab } from '../../store/slices/partnerSlice'
import PartnerProfile from '../../components/partner/dashboard/PartnerProfile'
import PartnerCourts from '../../components/partner/dashboard/PartnerCourts'
import PartnerReservations from '../../components/partner/dashboard/PartnerReservations'
import PartnerTournaments from '../../components/partner/dashboard/PartnerTournaments'
import PartnerMicrosite from '../../components/partner/dashboard/PartnerMicrosite'
import PartnerRevenue from '../../components/partner/dashboard/PartnerRevenue'
import PartnerInbox from '../../components/partner/dashboard/PartnerInbox'

const PartnerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { profile, stats, loading, error, activeTab } = useSelector((state: RootState) => state.partner)
  const { user } = useSelector((state: RootState) => state.auth)

  // Based on Partner model fields: business_name, rfc, contact_name, contact_title, partner_type,
  // state_id, website, social_media, logo_url, has_courts, premium_expires_at
  // And associations: courts, tournaments, microsite
  // Note: Partners have NO affiliation fee, only premium plan for courts/tournaments
  const tabs = [
    { id: 'profile', name: 'Business Profile', icon: '🏢', description: 'Business information and settings' },
    { id: 'courts', name: 'Court Management', icon: '🏟️', description: 'Manage courts and rental schedules' },
    { id: 'reservations', name: 'Reservations', icon: '📅', description: 'Booking management and calendar' },
    { id: 'tournaments', name: 'Event Management', icon: '🏆', description: 'Organize tournaments and events' },
    { id: 'microsite', name: 'Business Website', icon: '🌐', description: 'Manage business microsite' },
    { id: 'revenue', name: 'Revenue Analytics', icon: '💰', description: 'Financial reports and analytics' },
    { id: 'inbox', name: 'Messages', icon: '📧', description: 'Notifications and messages' }
  ]

  useEffect(() => {
    dispatch(fetchPartnerDashboard())
  }, [dispatch])

  const handleTabChange = (tabId: string) => {
    dispatch(setActiveTab(tabId))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <PartnerProfile />
      case 'courts':
        return <PartnerCourts />
      case 'reservations':
        return <PartnerReservations />
      case 'tournaments':
        return <PartnerTournaments />
      case 'microsite':
        return <PartnerMicrosite />
      case 'revenue':
        return <PartnerRevenue />
      case 'inbox':
        return <PartnerInbox />
      default:
        return <PartnerProfile />
    }
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading partner dashboard...</p>
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
            onClick={() => dispatch(fetchPartnerDashboard())}
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
                {profile?.business_name || 'Partner Dashboard'}
              </h1>
              <p className="text-gray-600 mt-2">
                {profile?.partner_type} Partner - {profile?.contact_name} ({profile?.contact_title})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {isPremium ? (
                <div className="bg-gold-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  PREMIUM
                </div>
              ) : (
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  BASIC
                </div>
              )}
              <div className="text-sm text-gray-500">
                Courts: {stats?.totalCourts || 0}
              </div>
              <div className="text-sm text-gray-500">
                Revenue: ${stats?.monthlyRevenue?.toLocaleString() || 0}
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
                  <div className="text-sm text-gray-600">Available Courts</div>
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
                    {stats.activeEvents}
                  </div>
                  <div className="text-sm text-gray-600">Active Events</div>
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
                  } ${['courts', 'tournaments', 'revenue'].includes(tab.id) && !isPremium ? 'opacity-60' : ''}`}
                  disabled={['courts', 'tournaments', 'revenue'].includes(tab.id) && !isPremium}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                  {['courts', 'tournaments', 'revenue'].includes(tab.id) && !isPremium && (
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

export default PartnerDashboard