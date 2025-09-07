import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchCoachDashboard, setActiveTab } from '../../store/slices/coachSlice'
import CoachProfile from '../../components/coach/dashboard/CoachProfile'
import CoachSessions from '../../components/coach/dashboard/CoachSessions'
import CoachCertifications from '../../components/coach/dashboard/CoachCertifications'
import CoachAvailability from '../../components/coach/dashboard/CoachAvailability'
import CoachRefereeHistory from '../../components/coach/dashboard/CoachRefereeHistory'
import CoachInbox from '../../components/coach/dashboard/CoachInbox'

const CoachDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { profile, stats, loading, error, activeTab } = useSelector((state: RootState) => state.coach)
  const { user } = useSelector((state: RootState) => state.auth)

  // Based on Coach model fields: full_name, birth_date, gender, state_id, curp, nrtp_level,
  // profile_photo_url, id_document_url, hourly_rate, affiliation_expires_at
  // And associations: refereematches, availabilities, coachingSessions, certifications
  const tabs = [
    { id: 'profile', name: 'Coach Profile', icon: '👤', description: 'Personal information and credentials' },
    { id: 'sessions', name: 'Coaching Sessions', icon: '🎾', description: 'Manage coaching sessions and students' },
    { id: 'certifications', name: 'Certifications', icon: '📜', description: 'View and manage certifications' },
    { id: 'availability', name: 'Availability', icon: '📅', description: 'Set coaching availability schedule' },
    { id: 'referee', name: 'Referee History', icon: '🏆', description: 'Tournament matches refereed' },
    { id: 'inbox', name: 'Messages', icon: '📧', description: 'Notifications and messages' }
  ]

  useEffect(() => {
    dispatch(fetchCoachDashboard())
  }, [dispatch])

  const handleTabChange = (tabId: string) => {
    dispatch(setActiveTab(tabId))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <CoachProfile />
      case 'sessions':
        return <CoachSessions />
      case 'certifications':
        return <CoachCertifications />
      case 'availability':
        return <CoachAvailability />
      case 'referee':
        return <CoachRefereeHistory />
      case 'inbox':
        return <CoachInbox />
      default:
        return <CoachProfile />
    }
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading coach dashboard...</p>
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
            onClick={() => dispatch(fetchCoachDashboard())}
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
              <p className="text-gray-600 mt-2">Coach Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Hourly Rate: ${profile?.hourly_rate || 'Not set'}
              </div>
              <div className="text-sm text-gray-500">
                NRTP Level: {profile?.nrtp_level || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">
                Sessions: {stats?.totalSessions || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-blue-600">🎾</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalSessions}
                  </div>
                  <div className="text-sm text-gray-600">Total Sessions</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-green-600">👥</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalStudents}
                  </div>
                  <div className="text-sm text-gray-600">Students Coached</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-purple-600">🏆</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.refereedMatches}
                  </div>
                  <div className="text-sm text-gray-600">Matches Refereed</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl text-green-600">💰</div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    ${stats.monthlyEarnings?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-600">Monthly Earnings</div>
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

export default CoachDashboard