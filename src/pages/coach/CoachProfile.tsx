import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchCoachProfile, uploadProfilePhoto } from '../../store/slices/coachProfileSlice'
import { fetchCoachCertificationsData } from '../../store/slices/coachCertificationsSlice'
import SimpleImageUpload from '../../components/common/SimpleImageUpload'
import {
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
  FiChevronRight,
  FiUser,
  FiSettings,
  FiMail,
  FiUsers,
  FiAward,
  FiCamera,
  FiX
} from 'react-icons/fi'

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
  const { certifications } = useSelector((state: RootState) => state.coachCertifications)
  const [activeTab, setActiveTab] = useState<'credential' | 'account' | 'inbox' | 'connection' | 'certifications'>('credential')
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingPhoto, setIsEditingPhoto] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'coach') {
      navigate('/login')
      return
    }
    
    if (!profile) {
      dispatch(fetchCoachProfile())
    }

    // Fetch certifications data if not already loaded and certifications tab is active
    if (activeTab === 'certifications' && certifications.length === 0) {
      dispatch(fetchCoachCertificationsData())
    }
  }, [user, navigate, dispatch, profile, activeTab, certifications.length])

  if (!user || user.role !== 'coach') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-green-600 mx-auto mb-6">
              <FiLoader className="h-8 w-8 text-transparent" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Profile</h3>
            <p className="text-gray-600 font-medium text-lg">Please wait while we load your coach profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-green-600 mx-auto mb-6">
              <FiLoader className="h-8 w-8 text-transparent" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Profile</h3>
            <p className="text-gray-600 font-medium text-lg">Please wait while we load your coach profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FiAlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Profile Error</h3>
            <p className="text-red-600 text-lg font-medium mb-6">{error}</p>
            <button
              onClick={() => dispatch(fetchCoachProfile())}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center mx-auto"
            >
              <FiRefreshCw className="w-5 h-5 mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const profileData = profile

  const tabs = [
    { id: 'credential' as const, name: 'Credential', icon: <FiAward className="w-5 h-5" /> },
    { id: 'account' as const, name: 'Account', icon: <FiSettings className="w-5 h-5" /> },
    { id: 'inbox' as const, name: 'Inbox', icon: <FiMail className="w-5 h-5" /> },
    { id: 'connection' as const, name: 'Connection', icon: <FiUsers className="w-5 h-5" />, premium: true },
    { id: 'certifications' as const, name: 'Certifications', icon: <FiAward className="w-5 h-5" /> }
  ]

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handlePhotoUpload = (photoUrl: string) => {
    // Update Redux state immediately - no separate API call needed
    dispatch(uploadProfilePhoto(photoUrl))
    setIsEditingPhoto(false)
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
        return <CoachCertificationsTab certifications={certifications} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/coach/dashboard')}
                  className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200 flex items-center"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" />
                  <span className="text-sm font-bold text-indigo-600" aria-current="page">
                    Profile
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-4">
              <FiUser className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Coach Profile</h1>
              <p className="text-gray-600 font-medium">
                View and manage your coaching information
              </p>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center">
            <div className="mr-8 mb-6 lg:mb-0">
              {!isEditingPhoto ? (
                <div className="relative w-24 h-24 group cursor-pointer">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl flex items-center justify-center shadow-lg">
                    {profileData.profile_photo_url ? (
                      <img
                        src={profileData.profile_photo_url}
                        alt="Profile"
                        className="w-24 h-24 rounded-3xl object-cover border-4 border-white"
                        onClick={() => setIsEditingPhoto(true)}
                      />
                    ) : (
                      <FiUser
                        className="text-3xl text-white cursor-pointer"
                        onClick={() => setIsEditingPhoto(true)}
                      />
                    )}
                  </div>
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    onClick={() => setIsEditingPhoto(true)}
                  >
                    <FiCamera className="w-6 h-6 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-80">
                  <SimpleImageUpload
                    fieldName="profile_photo_url"
                    fileType="image"
                    value={profileData.profile_photo_url || ''}
                    onChange={handlePhotoUpload}
                    title="Profile Photo"
                    enableCropping={true}
                    aspectRatio={1}
                  />
                  <button
                    onClick={() => setIsEditingPhoto(false)}
                    className="mt-3 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2 px-4 rounded-2xl transition-colors duration-200 flex items-center"
                  >
                    <FiX className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{profileData.full_name}</h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <FiAward className="w-5 h-5 mr-2 text-indigo-600" />
                  <span className="font-medium">NRTP Level {profileData.nrtp_level || 'N/A'}</span>
                  <span className="mx-2">•</span>
                  <span>{profileData.state_name || 'Unknown State'}</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-2xl px-4 py-2 inline-flex items-center">
                    <FiUser className="w-5 h-5 mr-2 text-green-600" />
                    <span className="text-green-800 font-bold text-lg">
                      ${profileData.hourly_rate || 'Not set'}/hour
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">
          <div className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <nav className="flex space-x-2 px-8 py-2" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                  } whitespace-nowrap py-3 px-6 rounded-2xl font-bold text-sm flex items-center transition-all duration-200 hover:transform hover:scale-105`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                  {tab.premium && !user.is_premium && (
                    <span className="ml-2 text-xs bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-2 py-1 rounded-full border border-purple-300 font-bold">
                      Premium
                    </span>
                  )}
                </button>
              ))}
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

export default CoachProfilePage