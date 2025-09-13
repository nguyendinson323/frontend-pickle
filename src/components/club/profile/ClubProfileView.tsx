import React, { useState } from 'react'
import { Club, User } from '../../../types/auth'

interface ClubProfileViewProps {
  club: Club
  user: User
  onEdit: () => void
}

type TabType = 'account' | 'inbox' | 'microsite' | 'statistics' | 'documents' | 'affiliation' | 'management' | 'members'

const ClubProfileView: React.FC<ClubProfileViewProps> = ({ club, user, onEdit }) => {
  const [activeTab, setActiveTab] = useState<TabType>('account')

  const tabs = [
    { id: 'account' as TabType, label: 'Account', icon: '👤' },
    { id: 'inbox' as TabType, label: 'Inbox', icon: '📧' },
    { id: 'microsite' as TabType, label: 'Microsite', icon: '🌐' },
    { id: 'statistics' as TabType, label: 'Statistics', icon: '📊' },
    { id: 'documents' as TabType, label: 'Documents', icon: '📄' },
    { id: 'affiliation' as TabType, label: 'Affiliation', icon: '🏛️' },
    { id: 'management' as TabType, label: 'Management', icon: '⚙️' },
    { id: 'members' as TabType, label: 'Member Management', icon: '👥' }
  ]

  const renderAccountTab = () => (
    <>
      {/* Account Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
            <p className="text-gray-900">{user.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
            <p className="text-gray-900">{user.phone || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Account Status</label>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Verification Status</label>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.is_verified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Premium Status</label>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.is_premium ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {user.is_premium ? 'Premium' : 'Standard'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Club Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Club Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Club Name</label>
            <p className="text-gray-900">{club.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Club Type</label>
            <p className="text-gray-900 capitalize">{club.club_type || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">RFC</label>
            <p className="text-gray-900">{club.rfc || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Manager Name</label>
            <p className="text-gray-900">{club.manager_name || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Manager Title</label>
            <p className="text-gray-900">{club.manager_title || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
            <p className="text-gray-900">{club.state?.name || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Has Courts</label>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                club.has_courts ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {club.has_courts ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Website</label>
            <p className="text-gray-900">
              {club.website ? (
                <a href={club.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
                  {club.website}
                </a>
              ) : (
                'Not provided'
              )}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Social Media</label>
            <p className="text-gray-900">{club.social_media || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Affiliation Expires</label>
            <p className="text-gray-900">
              {club.affiliation_expires_at ?
                new Date(club.affiliation_expires_at).toLocaleDateString() :
                'No expiration date'
              }
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Premium Expires</label>
            <p className="text-gray-900">
              {club.premium_expires_at ?
                new Date(club.premium_expires_at).toLocaleDateString() :
                'Not premium member'
              }
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
            <p className="text-gray-900">{new Date(club.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
            <p className="text-gray-900">{new Date(club.updated_at).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Last Login</label>
            <p className="text-gray-900">
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

  const renderPlaceholderTab = (title: string, icon: string, description: string, comingSoon = true) => (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      <div className="bg-gray-50 rounded-lg p-6">
        <p className="text-sm text-gray-600">
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
        return renderPlaceholderTab('Club Inbox', '📧', 'Manage announcements and messages from federation administrators', false)
      case 'microsite':
        return renderPlaceholderTab('Club Microsite', '🌐', 'Create and manage your public club webpage')
      case 'statistics':
        return renderPlaceholderTab('Club Statistics', '📊', 'View detailed analytics about your club\'s activity')
      case 'documents':
        return renderPlaceholderTab('Club Documents', '📄', 'Upload and manage official club documents')
      case 'affiliation':
        return renderPlaceholderTab('Federation Affiliation', '🏛️', 'Manage your club\'s affiliation with the Pickleball Federation', false)
      case 'management':
        return renderPlaceholderTab('Club Management', '⚙️', 'Configure club settings and manage operations')
      case 'members':
        return renderPlaceholderTab('Member Management', '👥', 'Manage club memberships and member information')
      default:
        return renderAccountTab()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-purple-700 rounded-full flex items-center justify-center mr-6">
              {club.logo_url ? (
                <img 
                  src={club.logo_url} 
                  alt="Club Logo" 
                  className="w-20 h-20 rounded-full object-cover" 
                />
              ) : (
                <span className="text-3xl text-white">🏟️</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{club.name}</h1>
              <p className="text-purple-100">
                {club.club_type || 'Club'} • {club.state?.name || 'Unknown State'}
              </p>
              <p className="text-purple-100">
                {club.has_courts ? 'Has Courts Available' : 'No Courts'}
              </p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-8">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default ClubProfileView