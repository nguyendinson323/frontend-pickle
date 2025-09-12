import React from 'react'
import { CoachProfileData } from '../../../store/slices/coachProfileSlice'

interface CoachAccountViewProps {
  profile: CoachProfileData
  onEdit: () => void
}

const CoachAccountView: React.FC<CoachAccountViewProps> = ({ profile, onEdit }) => {
  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={onEdit}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Edit Account Information
        </button>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
            <p className="text-gray-900 font-medium">{profile.full_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">NRTP Level</label>
            <p className="text-gray-900">{profile.nrtp_level || 'Not Assigned'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Hourly Rate</label>
            <p className="text-gray-900 font-medium text-green-600">
              {profile.hourly_rate ? `$${profile.hourly_rate}/hour` : 'Not Set'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
            <p className="text-gray-900">{profile.state_name || 'Not Specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Profile Photo</label>
            <div className="flex items-center">
              {profile.profile_photo_url ? (
                <div className="flex items-center">
                  <img 
                    src={profile.profile_photo_url} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover mr-3" 
                  />
                  <span className="text-green-600">✓ Uploaded</span>
                </div>
              ) : (
                <span className="text-gray-500">No photo uploaded</span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Affiliation Expires</label>
            <p className="text-gray-900">
              {profile.affiliation_expires_at ? 
                new Date(profile.affiliation_expires_at).toLocaleDateString() : 
                'No expiration date'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
            <p className="text-gray-900">{profile.user.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <p className="text-gray-900">{profile.user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
            <p className="text-gray-900">{profile.user.phone || 'Not Provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Account Status</label>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              profile.user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {profile.user.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Verification Status</label>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              profile.user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {profile.user.is_verified ? 'Verified' : 'Pending'}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Premium Status</label>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              profile.user.is_premium ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {profile.user.is_premium ? 'Premium' : 'Standard'}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Searchable</label>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              profile.user.is_searchable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {profile.user.is_searchable ? 'Discoverable' : 'Hidden'}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Last Login</label>
            <p className="text-gray-900">
              {profile.user.last_login ? 
                new Date(profile.user.last_login).toLocaleDateString() : 
                'Never logged in'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Visibility</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Profile Visibility</p>
              <p className="text-sm text-gray-600">
                Allow other coaches and players to find you in searches
              </p>
            </div>
            <div className="flex items-center">
              <span className={`mr-3 text-sm font-medium ${
                profile.user.is_searchable ? 'text-green-600' : 'text-gray-500'
              }`}>
                {profile.user.is_searchable ? 'Visible' : 'Hidden'}
              </span>
              <div className={`w-10 h-6 rounded-full ${
                profile.user.is_searchable ? 'bg-green-500' : 'bg-gray-300'
              } relative cursor-not-allowed`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  profile.user.is_searchable ? 'translate-x-5' : 'translate-x-1'
                }`}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Premium Features</p>
              <p className="text-sm text-gray-600">
                Access to advanced coaching tools and connections
              </p>
            </div>
            <div className="flex items-center">
              {profile.user.is_premium ? (
                <span className="text-purple-600 font-medium">Active</span>
              ) : (
                <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700">
                  Upgrade to Premium
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachAccountView