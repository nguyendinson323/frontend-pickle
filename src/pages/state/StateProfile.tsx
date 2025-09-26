import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchStateDashboard } from '../../store/slices/stateDashboardSlice'
import { StateAccountTab } from '../../components/state/profile/tabs/StateAccountTab'
import { StateInboxTab } from '../../components/state/profile/tabs/StateInboxTab'
import { StateManagementTab } from '../../components/state/profile/tabs/StateManagementTab'
import { StateMicrositeTab } from '../../components/state/profile/tabs/StateMicrositeTab'
import { StateStatisticsTab } from '../../components/state/profile/tabs/StateStatisticsTab'
import { StateDocumentsTab } from '../../components/state/profile/tabs/StateDocumentsTab'
import { StateMemberManagementTab } from '../../components/state/profile/tabs/StateMemberManagementTab'
import { StateMembershipTab } from '../../components/state/profile/tabs/StateMembershipTab'
import { FiSettings, FiMail, FiTarget, FiGlobe, FiBarChart2, FiFileText, FiUsers, FiHome, FiChevronRight, FiRefreshCw, FiAlertCircle } from 'react-icons/fi'

const StateProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { dashboardData, isLoading, error } = useSelector((state: RootState) => state.stateDashboard)
  const [activeTab, setActiveTab] = useState<'account' | 'inbox' | 'management' | 'microsite' | 'statistics' | 'documents' | 'members' | 'membership'>('account')

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 shadow-lg"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-400/20 animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900 mb-1">Loading Profile</p>
            <p className="text-sm text-gray-600">Please wait while we verify your access...</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 shadow-lg"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-400/20 animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900 mb-1">Loading State Profile</p>
            <p className="text-sm text-gray-600">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-white to-orange-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-3xl shadow-xl p-8 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="bg-red-500 p-3 rounded-2xl shadow-lg">
                <FiAlertCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Profile</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => dispatch(fetchStateDashboard())}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2 shadow-lg"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  <span>Retry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const profile = dashboardData.profile

  const tabs = [
    { id: 'account' as const, name: 'Account', icon: FiSettings },
    { id: 'inbox' as const, name: 'Inbox', icon: FiMail },
    { id: 'management' as const, name: 'Management', icon: FiTarget },
    { id: 'microsite' as const, name: 'Microsite', icon: FiGlobe },
    { id: 'statistics' as const, name: 'Statistics', icon: FiBarChart2 },
    { id: 'documents' as const, name: 'Documents', icon: FiFileText },
    { id: 'members' as const, name: 'Member Management', icon: FiUsers },
    { id: 'membership' as const, name: 'Membership', icon: FiHome }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <StateAccountTab profile={profile} user={user} />
      case 'inbox':
        return <StateInboxTab />
      case 'management':
        return <StateManagementTab />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/state/dashboard')}
                  className="text-gray-500 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <FiHome className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400 mx-3" />
                  <span className="text-sm font-medium text-gray-700">
                    Profile
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl mb-8 overflow-hidden border border-gray-200/50 backdrop-blur-sm">
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300/20 rounded-full translate-y-24 -translate-x-24 blur-2xl"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-white/20 to-white/10 flex-shrink-0 shadow-xl ring-4 ring-white/30 backdrop-blur-sm">
                {profile.logo_url ? (
                  <img
                    src={profile.logo_url}
                    alt="Committee Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiHome className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{profile.name}</h1>
                <div className="space-y-2">
                  <p className="text-blue-100 flex items-center justify-center sm:justify-start space-x-2">
                    <FiHome className="w-4 h-4" />
                    <span>State Committee • {profile.state?.name || 'Unknown State'}</span>
                  </p>
                  <p className="text-blue-100 flex items-center justify-center sm:justify-start space-x-2">
                    <FiUsers className="w-4 h-4" />
                    <span>President: {profile.president_name || 'Not assigned'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white/60 backdrop-blur-sm">
            <nav className="flex flex-wrap gap-2 p-4 sm:gap-4 sm:px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex items-center space-x-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 hover:scale-105'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200/50 backdrop-blur-sm">
          <div className="p-6 sm:p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StateProfilePage