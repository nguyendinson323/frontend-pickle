import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchStateDashboard, setActiveTab } from '../../store/slices/stateSlice'
import StateProfile from '../../components/state/dashboard/StateProfile'
import StateMembers from '../../components/state/dashboard/StateMembers'
import StateTournaments from '../../components/state/dashboard/StateTournaments'
import StateMicrosite from '../../components/state/dashboard/StateMicrosite'
import StateReports from '../../components/state/dashboard/StateReports'
import StateInbox from '../../components/state/dashboard/StateInbox'

const StateDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { profile, stats, loading, error, activeTab } = useSelector((state: RootState) => state.state)
  const { user } = useSelector((state: RootState) => state.auth)

  // Based on StateCommittee model fields: name, president_name, president_title, rfc, state_id,
  // logo_url, website, social_media, institutional_email, phone, affiliation_expires_at
  // And associations: tournaments, microsite
  // State committees oversee entire state regions and organize state-level tournaments
  const tabs = [
    { id: 'profile', name: 'Committee Profile', icon: '🏛️', description: 'State committee information' },
    { id: 'members', name: 'State Members', icon: '👥', description: 'Players, clubs, coaches in state' },
    { id: 'tournaments', name: 'State Tournaments', icon: '🏆', description: 'Organize state-level tournaments' },
    { id: 'microsite', name: 'State Microsite', icon: '🌐', description: 'Manage state committee website' },
    { id: 'reports', name: 'State Reports', icon: '📊', description: 'Analytics and state performance' },
    { id: 'inbox', name: 'Messages', icon: '📧', description: 'Notifications and messages' }
  ]

  useEffect(() => {
    dispatch(fetchStateDashboard())
  }, [dispatch])

  const handleTabChange = (tabId: string) => {
    dispatch(setActiveTab(tabId))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <StateProfile />
      case 'members':
        return <StateMembers />
      case 'tournaments':
        return <StateTournaments />
      case 'microsite':
        return <StateMicrosite />
      case 'reports':
        return <StateReports />
      case 'inbox':
        return <StateInbox />
      default:
        return <StateProfile />
    }
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading state committee dashboard...</p>
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
            onClick={() => dispatch(fetchStateDashboard())}
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
                {profile?.name || 'State Committee Dashboard'}
              </h1>
              <p className="text-gray-600 mt-2">
                {profile?.president_name} - {profile?.president_title}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                STATE COMMITTEE
              </div>
              <div className="text-sm text-gray-500">
                Members: {stats?.totalMembers || 0}
              </div>
              <div className="text-sm text-gray-500">
                Tournaments: {stats?.totalTournaments || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-blue-600">👥</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalMembers}
                  </div>
                  <div className="text-sm text-gray-600">Total Members</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-green-600">🏢</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalClubs}
                  </div>
                  <div className="text-sm text-gray-600">Registered Clubs</div>
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
                <div className="text-2xl text-yellow-600">📈</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    #{stats.stateRanking || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">State Ranking</div>
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
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
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

export default StateDashboard