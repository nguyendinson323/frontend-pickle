import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { updateClubProfile } from '../../../store/slices/authSlice'
import { Club, User } from '../../../types/auth'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiStar,
  FiCheck,
  FiClock,
  FiEdit3,
  FiCalendar,
  FiMapPin,
  FiGlobe,
  FiShare2,
  FiBriefcase,
  FiHome,
  FiInbox,
  FiMonitor,
  FiBarChart2,
  FiFileText,
  FiAward,
  FiSettings,
  FiUsers,
  FiExternalLink,
  FiInfo
} from 'react-icons/fi'

interface ClubProfileViewProps {
  club: Club
  user: User
  onEdit: () => void
}

type TabType = 'account' | 'inbox' | 'microsite' | 'statistics' | 'documents' | 'affiliation' | 'management' | 'members'

const ClubProfileView: React.FC<ClubProfileViewProps> = ({ club, user, onEdit }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [activeTab, setActiveTab] = useState<TabType>('account')
  const [isEditingLogo, setIsEditingLogo] = useState(false)
  const logoUploadRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close logo upload
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logoUploadRef.current && !logoUploadRef.current.contains(event.target as Node)) {
        setIsEditingLogo(false)
      }
    }

    if (isEditingLogo) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isEditingLogo])

  const tabs = [
    { id: 'account' as TabType, label: 'Account', icon: FiUser },
    { id: 'inbox' as TabType, label: 'Inbox', icon: FiInbox },
    { id: 'microsite' as TabType, label: 'Microsite', icon: FiMonitor },
    { id: 'statistics' as TabType, label: 'Statistics', icon: FiBarChart2 },
    { id: 'documents' as TabType, label: 'Documents', icon: FiFileText },
    { id: 'affiliation' as TabType, label: 'Affiliation', icon: FiAward },
    { id: 'management' as TabType, label: 'Management', icon: FiSettings },
    { id: 'members' as TabType, label: 'Member Management', icon: FiUsers }
  ]

  const handleLogoUpdate = async (logoUrl: string) => {
    try {
      await dispatch(updateClubProfile({ logo_url: logoUrl }))
      setIsEditingLogo(false)
    } catch (error) {
      console.error('Failed to update logo:', error)
    }
  }

  const renderAccountTab = () => (
    <>
      {/* Account Information */}
      <div className="mb-10">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FiUser className="h-6 w-6 mr-3 text-blue-600" />
            Account Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiUser className="h-4 w-4 mr-2 text-blue-500" />
              Username
            </label>
            <p className="text-gray-900 font-medium">{user.username}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiMail className="h-4 w-4 mr-2 text-green-500" />
              Email
            </label>
            <p className="text-gray-900 font-medium">{user.email}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiPhone className="h-4 w-4 mr-2 text-purple-500" />
              Phone
            </label>
            <p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiShield className="h-4 w-4 mr-2 text-indigo-500" />
              Account Status
            </label>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm ${
                user.is_active ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {user.is_active ? (
                  <><FiCheck className="h-4 w-4 mr-1" />Active</>
                ) : (
                  <><FiClock className="h-4 w-4 mr-1" />Inactive</>
                )}
              </span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiShield className="h-4 w-4 mr-2 text-blue-500" />
              Verification Status
            </label>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm ${
                user.is_verified ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              }`}>
                {user.is_verified ? (
                  <><FiCheck className="h-4 w-4 mr-1" />Verified</>
                ) : (
                  <><FiClock className="h-4 w-4 mr-1" />Pending</>
                )}
              </span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiStar className="h-4 w-4 mr-2 text-purple-500" />
              Premium Status
            </label>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm ${
                user.is_premium ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {user.is_premium ? (
                  <><FiStar className="h-4 w-4 mr-1" />Premium</>
                ) : (
                  <><FiUser className="h-4 w-4 mr-1" />Standard</>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Club Information */}
      <div className="mb-10">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FiHome className="h-6 w-6 mr-3 text-green-600" />
            Club Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiHome className="h-4 w-4 mr-2 text-blue-500" />
              Club Name
            </label>
            <p className="text-gray-900 font-medium">{club.name}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiBriefcase className="h-4 w-4 mr-2 text-green-500" />
              Club Type
            </label>
            <p className="text-gray-900 font-medium capitalize">{club.club_type || 'Not specified'}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiFileText className="h-4 w-4 mr-2 text-purple-500" />
              RFC
            </label>
            <p className="text-gray-900 font-medium">{club.rfc || 'Not provided'}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiUser className="h-4 w-4 mr-2 text-indigo-500" />
              Manager Name
            </label>
            <p className="text-gray-900 font-medium">{club.manager_name || 'Not specified'}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiBriefcase className="h-4 w-4 mr-2 text-orange-500" />
              Manager Title
            </label>
            <p className="text-gray-900 font-medium">{club.manager_title || 'Not specified'}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiMapPin className="h-4 w-4 mr-2 text-red-500" />
              State
            </label>
            <p className="text-gray-900 font-medium">{club.state?.name || 'Not specified'}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiHome className="h-4 w-4 mr-2 text-teal-500" />
              Has Courts
            </label>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm ${
                club.has_courts ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {club.has_courts ? (
                  <><FiCheck className="h-4 w-4 mr-1" />Yes</>
                ) : (
                  <><FiClock className="h-4 w-4 mr-1" />No</>
                )}
              </span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiGlobe className="h-4 w-4 mr-2 text-blue-500" />
              Website
            </label>
            <p className="text-gray-900 font-medium">
              {club.website ? (
                <a href={club.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 flex items-center">
                  <FiExternalLink className="h-4 w-4 mr-1" />
                  {club.website}
                </a>
              ) : (
                'Not provided'
              )}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiShare2 className="h-4 w-4 mr-2 text-pink-500" />
              Social Media
            </label>
            <p className="text-gray-900 font-medium">{club.social_media || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FiInfo className="h-6 w-6 mr-3 text-purple-600" />
            Additional Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiAward className="h-4 w-4 mr-2 text-yellow-500" />
              Affiliation Expires
            </label>
            <p className="text-gray-900 font-medium">
              {club.affiliation_expires_at ?
                new Date(club.affiliation_expires_at).toLocaleDateString() :
                'No expiration date'
              }
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiStar className="h-4 w-4 mr-2 text-purple-500" />
              Premium Expires
            </label>
            <p className="text-gray-900 font-medium">
              {club.premium_expires_at ?
                new Date(club.premium_expires_at).toLocaleDateString() :
                'Not premium member'
              }
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiCalendar className="h-4 w-4 mr-2 text-green-500" />
              Member Since
            </label>
            <p className="text-gray-900 font-medium">{new Date(club.created_at).toLocaleDateString()}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiEdit3 className="h-4 w-4 mr-2 text-blue-500" />
              Last Updated
            </label>
            <p className="text-gray-900 font-medium">{new Date(club.updated_at).toLocaleDateString()}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center">
              <FiClock className="h-4 w-4 mr-2 text-orange-500" />
              Last Login
            </label>
            <p className="text-gray-900 font-medium">
              {user.last_login ?
                new Date(user.last_login).toLocaleDateString() :
                'Never logged in'
              }
            </p>
          </div>
        </div>
      </div>
    </>
  )

  const renderPlaceholderTab = (title: string, IconComponent: React.ElementType, description: string, comingSoon = true) => (
    <div className="text-center py-16">
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
        <IconComponent className="text-gray-500 text-3xl" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 font-medium mb-8 max-w-md mx-auto">{description}</p>
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
        <p className="text-gray-700 font-medium">
          {comingSoon ? `${title} coming soon.` : 'No data available at this time.'}
        </p>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountTab()
      case 'inbox':
        return renderPlaceholderTab('Club Inbox', FiInbox, 'Manage announcements and messages from federation administrators', false)
      case 'microsite':
        return renderPlaceholderTab('Club Microsite', FiMonitor, 'Create and manage your public club webpage')
      case 'statistics':
        return renderPlaceholderTab('Club Statistics', FiBarChart2, 'View detailed analytics about your club\'s activity')
      case 'documents':
        return renderPlaceholderTab('Club Documents', FiFileText, 'Upload and manage official club documents')
      case 'affiliation':
        return renderPlaceholderTab('Federation Affiliation', FiAward, 'Manage your club\'s affiliation with the Pickleball Federation', false)
      case 'management':
        return renderPlaceholderTab('Club Management', FiSettings, 'Configure club settings and manage operations')
      case 'members':
        return renderPlaceholderTab('Member Management', FiUsers, 'Manage club memberships and member information')
      default:
        return renderAccountTab()
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-24 h-24 bg-purple-700 rounded-2xl flex items-center justify-center mr-8 group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-200">
                {club.logo_url ? (
                  <img
                    src={club.logo_url}
                    alt="Club Logo"
                    className="w-24 h-24 rounded-2xl object-cover"
                    onClick={() => setIsEditingLogo(true)}
                  />
                ) : (
                  <FiHome
                    className="text-4xl text-white"
                    onClick={() => setIsEditingLogo(true)}
                  />
                )}
                <div
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 cursor-pointer"
                  onClick={() => setIsEditingLogo(true)}
                >
                  <FiEdit3 className="w-6 h-6 text-white" />
                </div>
              </div>
              {isEditingLogo && (
                <div ref={logoUploadRef} className="absolute top-0 left-0 z-50">
                  <SimpleImageUpload
                    fieldName="logo_url"
                    fileType="image"
                    value={club.logo_url || ''}
                    onChange={handleLogoUpdate}
                    title="Upload Club Logo"
                    enableCropping={true}
                    aspectRatio={1}
                  />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{club.name}</h1>
              <p className="text-purple-100 font-medium text-lg flex items-center mb-2">
                <FiBriefcase className="h-5 w-5 mr-2" />
                {club.club_type || 'Club'} •
                <FiMapPin className="h-5 w-5 ml-2 mr-1" />
                {club.state?.name || 'Unknown State'}
              </p>
              <p className="text-purple-100 font-medium flex items-center">
                {club.has_courts ? (
                  <><FiCheck className="h-5 w-5 mr-2" />Has Courts Available</>
                ) : (
                  <><FiClock className="h-5 w-5 mr-2" />No Courts</>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="bg-white text-purple-600 px-6 py-3 rounded-2xl hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105 flex items-center"
          >
            <FiEdit3 className="w-5 h-5 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <nav className="-mb-px flex space-x-2 px-8 py-2" aria-label="Tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-bold text-sm flex items-center space-x-3 rounded-t-2xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 bg-white shadow-lg transform -translate-y-1'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-white hover:shadow-md'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="p-10 bg-gradient-to-br from-gray-50 to-white">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default ClubProfileView