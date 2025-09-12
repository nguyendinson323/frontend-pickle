import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchCoachProfile } from '../../store/slices/coachProfileSlice'

// Import tab components
import CoachCredentialTab from '../../components/coach/profile/CoachCredentialTab'
import CoachAccountView from '../../components/coach/profile/CoachAccountView'
import CoachAccountForm from '../../components/coach/profile/CoachAccountForm'
import CoachInboxTab from '../../components/coach/profile/CoachInboxTab'
import CoachConnectionTab from '../../components/coach/profile/CoachConnectionTab'
import CoachCertificationsTab from '../../components/coach/profile/CoachCertificationsTab'

const CoachProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { profile, isLoading, error } = useSelector((state: RootState) => state.coachProfile)
  const [activeTab, setActiveTab] = useState<'credential' | 'account' | 'inbox' | 'connection' | 'certifications'>('credential')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'coach') {
      navigate('/login')
      return
    }
    
    if (!profile) {
      dispatch(fetchCoachProfile())
    }
  }, [user, navigate, dispatch, profile])

  if (!user || user.role !== 'coach') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium">{error}</div>
          <button 
            onClick={() => dispatch(fetchCoachProfile())} 
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const profileData = profile

  const tabs = [
    { id: 'credential' as const, name: 'Credential', icon: '🏆' },
    { id: 'account' as const, name: 'Account', icon: '⚙️' },
    { id: 'inbox' as const, name: 'Inbox', icon: '📮' },
    { id: 'connection' as const, name: 'Connection', icon: '🤝', premium: true },
    { id: 'certifications' as const, name: 'Certifications', icon: '📜' }
  ]

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'credential':
        return <CoachCredentialTab profile={profileData} user={user} />
      case 'account':
        return isEditing ? (
          <CoachAccountForm profile={profileData} onCancel={handleCancel} />
        ) : (
          <CoachAccountView profile={profileData} onEdit={handleEdit} />
        )
      case 'inbox':
        return <CoachInboxTab />
      case 'connection':
        return <CoachConnectionTab user={user} />
      case 'certifications':
        return <CoachCertificationsTab certifications={[]} />
      default:
        return null
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
                  onClick={() => navigate('/coach/dashboard')}
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

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Coach Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage your coaching information
          </p>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mr-6">
              {profileData.profile_photo_url ? (
                <img 
                  src={profileData.profile_photo_url} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover" 
                />
              ) : (
                <span className="text-2xl text-white">👨‍🏫</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profileData.full_name}</h2>
              <p className="text-gray-600">
                NRTP Level {profileData.nrtp_level || 'N/A'} • {profileData.state_name || 'Unknown State'}
              </p>
              <p className="text-green-600 font-medium">
                ${profileData.hourly_rate || 'Not set'}/hour
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                  {tab.premium && !user.is_premium && (
                    <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                      Premium
                    </span>
                  )}
                </button>
              ))}
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

export default CoachProfilePage