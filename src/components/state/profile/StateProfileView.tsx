import React from 'react'
import { StateCommittee, User } from '../../../types/auth'

interface StateProfileViewProps {
  stateCommittee: StateCommittee
  user: User
  onEdit: () => void
}

const StateProfileView: React.FC<StateProfileViewProps> = ({ stateCommittee, user, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-red-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-red-700 rounded-full flex items-center justify-center mr-6">
              {stateCommittee.logo_url ? (
                <img 
                  src={stateCommittee.logo_url} 
                  alt="Committee Logo" 
                  className="w-20 h-20 rounded-full object-cover" 
                />
              ) : (
                <span className="text-3xl text-white">🏛️</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{stateCommittee.name}</h1>
              <p className="text-red-100">
                State Committee • {stateCommittee.state?.name || 'Unknown State'}
              </p>
              <p className="text-red-100">
                President: {stateCommittee.president_name || 'Not assigned'}
              </p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="bg-white text-red-600 px-4 py-2 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="p-8">
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

        {/* State Committee Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">State Committee Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Committee Name</label>
              <p className="text-gray-900">{stateCommittee.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">RFC</label>
              <p className="text-gray-900">{stateCommittee.rfc || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">President Name</label>
              <p className="text-gray-900">{stateCommittee.president_name || 'Not assigned'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">President Title</label>
              <p className="text-gray-900">{stateCommittee.president_title || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
              <p className="text-gray-900">{stateCommittee.state?.name || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Institutional Email</label>
              <p className="text-gray-900">{stateCommittee.institutional_email || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Committee Phone</label>
              <p className="text-gray-900">{stateCommittee.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Website</label>
              <p className="text-gray-900">
                {stateCommittee.website ? (
                  <a href={stateCommittee.website} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800">
                    {stateCommittee.website}
                  </a>
                ) : (
                  'Not provided'
                )}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Social Media</label>
              <p className="text-gray-900">{stateCommittee.social_media || 'Not provided'}</p>
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
                {stateCommittee.affiliation_expires_at ? 
                  new Date(stateCommittee.affiliation_expires_at).toLocaleDateString() : 
                  'No expiration date'
                }
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
              <p className="text-gray-900">{new Date(stateCommittee.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
              <p className="text-gray-900">{new Date(stateCommittee.updated_at).toLocaleDateString()}</p>
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
      </div>
    </div>
  )
}

export default StateProfileView