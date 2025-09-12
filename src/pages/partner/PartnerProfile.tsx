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

type TabType = 'account' | 'inbox' | 'microsite' | 'statistics' | 'documents' | 'affiliation' | 'management'

const PartnerProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { profile, affiliationStatus, error } = useSelector((state: RootState) => state.partnerProfile)
  const { isLoading: loading } = useSelector((state: RootState) => state.loading)
  const [activeTab, setActiveTab] = useState<TabType>('account')

  const tabs = [
    { id: 'account' as TabType, name: 'Account', icon: '👤' },
    { id: 'inbox' as TabType, name: 'Inbox', icon: '📧' },
    { id: 'microsite' as TabType, name: 'Microsite', icon: '🌐', premium: true },
    { id: 'statistics' as TabType, name: 'Statistics', icon: '📊' },
    { id: 'documents' as TabType, name: 'Documents', icon: '📄' },
    { id: 'affiliation' as TabType, name: 'Affiliation', icon: '🏆' },
    { id: 'management' as TabType, name: 'Management', icon: '⚙️', premium: true }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/partner/dashboard')}
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

        {/* Page Title & Partner Info */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              {profile?.logo_url ? (
                <img 
                  src={profile.logo_url} 
                  alt="Partner Logo" 
                  className="w-16 h-16 rounded-full object-cover" 
                />
              ) : (
                <span className="text-2xl text-purple-600">🏢</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile?.business_name || 'Partner Profile'}</h1>
              <p className="mt-1 text-sm text-gray-600">
                {profile?.partner_type?.replace('_', ' ') || 'Partner'} • {profile?.state?.name || 'Location not set'}
              </p>
              <div className="flex items-center mt-2 space-x-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isPremium ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {isPremium ? 'Premium Member' : 'Standard Member'}
                </span>
                {profile?.has_courts && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Has Courts
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                const isDisabled = tab.premium && !isPremium
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    disabled={isDisabled}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                      ${isActive
                        ? 'border-purple-500 text-purple-600'
                        : isDisabled
                        ? 'border-transparent text-gray-300 cursor-not-allowed'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                    {tab.premium && !isPremium && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Premium
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnerProfilePage