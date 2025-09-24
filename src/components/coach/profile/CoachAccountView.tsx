import React from 'react'
import { CoachProfileData } from '../../../store/slices/coachProfileSlice'
import {
  FiEdit2,
  FiUser,
  FiMail,
  FiPhone,
  FiDollarSign,
  FiAward,
  FiMapPin,
  FiCamera,
  FiCheckCircle,
  FiX,
  FiEye,
  FiEyeOff,
  FiSettings,
  FiCalendar
} from 'react-icons/fi'

interface CoachAccountViewProps {
  profile: CoachProfileData
  onEdit: () => void
}

const CoachAccountView: React.FC<CoachAccountViewProps> = ({ profile, onEdit }) => {
  return (
    <div className="space-y-8">
      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={onEdit}
          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
        >
          <FiEdit2 className="w-5 h-5 mr-2" />
          Edit Account Information
        </button>
      </div>

      {/* Personal Information */}
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
            <FiUser className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center mb-2">
              <FiUser className="w-5 h-5 text-blue-600 mr-2" />
              <label className="text-sm font-bold text-gray-700">Full Name</label>
            </div>
            <p className="text-gray-900 font-bold text-lg">{profile.full_name}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center mb-2">
              <FiAward className="w-5 h-5 text-purple-600 mr-2" />
              <label className="text-sm font-bold text-gray-700">NRTP Level</label>
            </div>
            <p className="text-gray-900 font-bold text-lg">{profile.nrtp_level || 'Not Assigned'}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center mb-2">
              <FiDollarSign className="w-5 h-5 text-green-600 mr-2" />
              <label className="text-sm font-bold text-gray-700">Hourly Rate</label>
            </div>
            <p className="text-green-600 font-bold text-lg">
              {profile.hourly_rate ? `$${profile.hourly_rate}/hour` : 'Not Set'}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center mb-2">
              <FiMapPin className="w-5 h-5 text-orange-600 mr-2" />
              <label className="text-sm font-bold text-gray-700">State</label>
            </div>
            <p className="text-gray-900 font-bold text-lg">{profile.state_name || 'Not Specified'}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center mb-2">
              <FiCamera className="w-5 h-5 text-indigo-600 mr-2" />
              <label className="text-sm font-bold text-gray-700">Profile Photo</label>
            </div>
            <div className="flex items-center">
              {profile.profile_photo_url ? (
                <div className="flex items-center">
                  <img
                    src={profile.profile_photo_url}
                    alt="Profile"
                    className="w-12 h-12 rounded-2xl object-cover mr-3 border-2 border-gray-200"
                  />
                  <div className="flex items-center">
                    <FiCheckCircle className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-bold">Uploaded</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <FiX className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-gray-500 font-medium">No photo uploaded</span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center mb-2">
              <FiCalendar className="w-5 h-5 text-red-600 mr-2" />
              <label className="text-sm font-bold text-gray-700">Affiliation Expires</label>
            </div>
            <p className="text-gray-900 font-bold text-lg">
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