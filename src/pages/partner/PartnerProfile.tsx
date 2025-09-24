import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchPartnerProfile, fetchAffiliationStatus } from '../../store/slices/partnerProfileSlice'
import { fetchPartnerInboxData } from '../../store/slices/partnerInboxSlice'
import { fetchPartnerStatistics } from '../../store/slices/partnerStatisticsSlice'
import { fetchPartnerDocuments } from '../../store/slices/partnerDocumentsSlice'
import { PartnerAccountTab } from '../../components/partner/profile/tabs/PartnerAccountTab'
import { PartnerInboxTab } from '../../components/partner/profile/tabs/PartnerInboxTab'
import { PartnerMicrositeTab } from '../../components/partner/profile/tabs/PartnerMicrositeTab'
import { PartnerStatisticsTab } from '../../components/partner/profile/tabs/PartnerStatisticsTab'
import { PartnerDocumentsTab } from '../../components/partner/profile/tabs/PartnerDocumentsTab'
import { PartnerAffiliationTab } from '../../components/partner/profile/tabs/PartnerAffiliationTab'
import { PartnerManagementTab } from '../../components/partner/profile/tabs/PartnerManagementTab'
import {
  FiUser,
  FiMail,
  FiGlobe,
  FiBarChart2,
  FiFile,
  FiAward,
  FiSettings,
  FiHome,
  FiChevronRight,
  FiStar,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi'

type TabType = 'account' | 'inbox' | 'microsite' | 'statistics' | 'documents' | 'affiliation' | 'management'

const PartnerProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { profile, affiliationStatus, error } = useSelector((state: RootState) => state.partnerProfile)
  const { isLoading: loading } = useSelector((state: RootState) => state.loading)
  const [activeTab, setActiveTab] = useState<TabType>('account')

  const tabs = [
    { id: 'account' as TabType, name: 'Account', icon: FiUser },
    { id: 'inbox' as TabType, name: 'Inbox', icon: FiMail },
    { id: 'microsite' as TabType, name: 'Microsite', icon: FiGlobe, premium: true },
    { id: 'statistics' as TabType, name: 'Statistics', icon: FiBarChart2 },
    { id: 'documents' as TabType, name: 'Documents', icon: FiFile },
    { id: 'affiliation' as TabType, name: 'Affiliation', icon: FiAward },
    { id: 'management' as TabType, name: 'Management', icon: FiSettings, premium: true }
  ]

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (user?.role !== 'partner') {
      navigate('/dashboard')
      return
    }

    // Load initial data
    if (!profile) {
      dispatch(fetchPartnerProfile())
    }
    if (!affiliationStatus) {
      dispatch(fetchAffiliationStatus())
    }
  }, [dispatch, isAuthenticated, user, navigate, profile, affiliationStatus])

  // Load tab-specific data when switching tabs
  useEffect(() => {
    switch (activeTab) {
      case 'inbox':
        dispatch(fetchPartnerInboxData())
        break
      case 'statistics':
        dispatch(fetchPartnerStatistics())
        break
      case 'documents':
        dispatch(fetchPartnerDocuments())
        break
    }
  }, [activeTab, dispatch])

  if (!isAuthenticated || user?.role !== 'partner') {
    return null
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-600 border-t-4 border-transparent shadow-xl mx-auto mb-6"></div>
          <div className="bg-white rounded-2xl shadow-lg px-8 py-4">
            <p className="text-lg font-semibold text-gray-700">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  const isPremium = profile?.premium_expires_at && new Date(profile.premium_expires_at) > new Date()

  const handleTabClick = (tabId: TabType) => {
    const tab = tabs.find(t => t.id === tabId)
    if (tab?.premium && !isPremium) {
      // Show premium upgrade message or redirect
      return
    }
    setActiveTab(tabId)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <PartnerAccountTab profile={profile} />
      case 'inbox':
        return <PartnerInboxTab />
      case 'microsite':
        return <PartnerMicrositeTab />
      case 'statistics':
        return <PartnerStatisticsTab />
      case 'documents':
        return <PartnerDocumentsTab />
      case 'affiliation':
        return <PartnerAffiliationTab affiliationStatus={affiliationStatus} />
      case 'management':
        return <PartnerManagementTab />
      default:
        return <PartnerAccountTab profile={profile} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/partner/dashboard')}
                  className="flex items-center text-gray-500 hover:text-purple-600 font-medium transition-all duration-200 hover:transform hover:scale-105"
                >
                  <FiHome className="w-4 h-4 mr-1" />
                  Dashboard
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" />
                  <span className="text-sm font-semibold text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-purple-200" aria-current="page">
                    Profile
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Page Title & Partner Info */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-3xl p-8 border border-gray-200 overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="relative">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-100 to-pink-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white">
                  {profile?.logo_url ? (
                    <img
                      src={profile.logo_url}
                      alt="Partner Logo"
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <FiHome className="w-10 h-10 lg:w-12 lg:h-12 text-purple-600" />
                  )}
                </div>
                {isPremium && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <FiStar className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-0">
                    {profile?.business_name || 'Partner Profile'}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full border border-blue-200">
                    <FiHome className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-semibold text-blue-800">
                      {profile?.partner_type?.replace('_', ' ') || 'Partner'}
                    </span>
                  </div>
                  <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200">
                    <span className="text-sm font-semibold text-green-800">
                      {profile?.state?.name || 'Location not set'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 transition-all duration-300 hover:transform hover:scale-105 ${
                    isPremium
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-300 shadow-lg'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300'
                  }`}>
                    {isPremium ? (
                      <>
                        <FiStar className="w-4 h-4 mr-2" />
                        Premium Member
                      </>
                    ) : (
                      'Standard Member'
                    )}
                  </span>
                  {profile?.has_courts && (
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300 shadow-lg transition-all duration-300 hover:transform hover:scale-105">
                      <FiCheckCircle className="w-4 h-4 mr-2" />
                      Has Courts
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <FiAlertCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-red-900 mb-1">Error</h3>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <nav className="-mb-px flex flex-wrap lg:flex-nowrap px-6 overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                const isDisabled = tab.premium && !isPremium
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    disabled={isDisabled}
                    className={`
                      whitespace-nowrap py-4 px-4 border-b-3 font-semibold text-sm flex items-center space-x-3 min-w-0 transition-all duration-300
                      ${isActive
                        ? 'border-purple-500 text-purple-600 bg-gradient-to-t from-purple-50 to-transparent transform scale-105'
                        : isDisabled
                        ? 'border-transparent text-gray-300 cursor-not-allowed opacity-60'
                        : 'border-transparent text-gray-600 hover:text-purple-600 hover:border-purple-300 hover:bg-gradient-to-t hover:from-purple-50 hover:to-transparent hover:transform hover:scale-105'
                      }
                    `}
                  >
                    <div className={`w-5 h-5 flex items-center justify-center ${
                      isActive ? 'text-purple-600' : isDisabled ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="hidden sm:block">{tab.name}</span>
                    {tab.premium && !isPremium && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-300 shadow-sm">
                        <FiStar className="w-3 h-3 mr-1" />
                        Premium
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnerProfilePage