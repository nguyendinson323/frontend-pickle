import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchStateDashboard } from '../../store/slices/stateDashboardSlice'
import { StateAccountTab } from '../../components/state/profile/tabs/StateAccountTab'
import { StateInboxTab } from '../../components/state/profile/tabs/StateInboxTab'
import { StateMicrositeTab } from '../../components/state/profile/tabs/StateMicrositeTab'
import { StateStatisticsTab } from '../../components/state/profile/tabs/StateStatisticsTab'
import { StateDocumentsTab } from '../../components/state/profile/tabs/StateDocumentsTab'
import { StateMemberManagementTab } from '../../components/state/profile/tabs/StateMemberManagementTab'
import { StateMembershipTab } from '../../components/state/profile/tabs/StateMembershipTab'

const StateProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { dashboardData, isLoading, error } = useSelector((state: RootState) => state.stateDashboard)
  const [activeTab, setActiveTab] = useState<'account' | 'inbox' | 'microsite' | 'statistics' | 'documents' | 'members' | 'membership'>('account')

  useEffect(() => {
    if (!user || user.role !== 'state') {
      navigate('/login')
      return
    }

    if (!dashboardData) {
      dispatch(fetchStateDashboard())
    }
  }, [user, navigate, dispatch, dashboardData])

  if (!user || user.role !== 'state') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium">{error}</div>
          <button
            onClick={() => dispatch(fetchStateDashboard())}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const profile = dashboardData.profile

  const tabs = [
    { id: 'account' as const, name: 'Account', icon: '⚙️' },
    { id: 'inbox' as const, name: 'Inbox', icon: '📮' },
    { id: 'microsite' as const, name: 'Microsite', icon: '🌐' },
    { id: 'statistics' as const, name: 'Statistics', icon: '📊' },
    { id: 'documents' as const, name: 'Documents', icon: '📄' },
    { id: 'members' as const, name: 'Member Management', icon: '👥' },
    { id: 'membership' as const, name: 'Membership', icon: '🏛️' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <StateAccountTab profile={profile} user={user} />
      case 'inbox':
        return <StateInboxTab />
      case 'microsite':
        return <StateMicrositeTab />
      case 'statistics':
        return <StateStatisticsTab />
      case 'documents':
        return <StateDocumentsTab />
      case 'members':
        return <StateMemberManagementTab />
      case 'membership':
        return <StateMembershipTab />
      default:
        return <StateAccountTab profile={profile} user={user} />
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/state/dashboard')}
                  className="text-gray-400 hover:text-gray-500"
                >
                  Dashboard
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
                    Profile
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-xl mb-8">
          <div className="bg-red-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-red-700 rounded-full flex items-center justify-center mr-6">
                {profile.logo_url ? (
                  <img
                    src={profile.logo_url}
                    alt="Committee Logo"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-white">🏛️</span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-red-100">
                  State Committee • {profile.state?.name || 'Unknown State'}
                </p>
                <p className="text-red-100">
                  President: {profile.president_name || 'Not assigned'}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-xl">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StateProfilePage