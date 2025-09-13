import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../store'
import { updateStateProfile, StateProfile } from '../../../../store/slices/stateDashboardSlice'
import { User } from '../../../../types/auth'
import CentralizedImageUpload from '../../../common/CentralizedImageUpload'

interface StateAccountTabProps {
  profile: StateProfile
  user: User
}

export const StateAccountTab: React.FC<StateAccountTabProps> = ({ profile, user }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading } = useSelector((state: RootState) => state.loading)
  const [isEditing, setIsEditing] = useState(false)

  const [userData, setUserData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone || ''
  })

  const [stateData, setStateData] = useState({
    name: profile.name,
    president_name: profile.president_name || '',
    president_title: profile.president_title || '',
    rfc: profile.rfc || '',
    website: profile.website || '',
    social_media: profile.social_media || '',
    logo_url: profile.logo_url || '',
    institutional_email: profile.institutional_email || '',
    phone: profile.phone || ''
  })

  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleStateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setStateData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogoUpload = (imageUrl: string) => {
    setStateData(prev => ({ ...prev, logo_url: imageUrl }))
  }

  const handleEdit = () => {
    setIsEditing(true)
    setError(null)
    setSuccessMessage(null)
  }

  const handleCancel = () => {
    // Reset form data
    setUserData({
      username: user.username,
      email: user.email,
      phone: user.phone || ''
    })
    setStateData({
      name: profile.name,
      president_name: profile.president_name || '',
      president_title: profile.president_title || '',
      rfc: profile.rfc || '',
      website: profile.website || '',
      social_media: profile.social_media || '',
      logo_url: profile.logo_url || '',
      institutional_email: profile.institutional_email || '',
      phone: profile.phone || ''
    })
    setIsEditing(false)
    setError(null)
    setSuccessMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    try {
      const updateData = {
        ...stateData,
        user_data: userData
      }

      await dispatch(updateStateProfile(updateData))
      setSuccessMessage('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      setError((error as { message?: string }).message || 'Failed to update profile')
    }
  }

  if (isEditing) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Edit Profile</h3>
            <p className="text-sm text-gray-600">Update your state committee information</p>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* User Account Info Section */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Account Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={handleUserInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleUserInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label htmlFor="user_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Phone
                </label>
                <input
                  type="text"
                  id="user_phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleUserInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* State Committee Profile Info Section */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">State Committee Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Committee Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={stateData.name}
                  onChange={handleStateInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label htmlFor="rfc" className="block text-sm font-medium text-gray-700 mb-2">
                  RFC
                </label>
                <input
                  type="text"
                  id="rfc"
                  name="rfc"
                  value={stateData.rfc}
                  onChange={handleStateInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label htmlFor="president_name" className="block text-sm font-medium text-gray-700 mb-2">
                  President Name
                </label>
                <input
                  type="text"
                  id="president_name"
                  name="president_name"
                  value={stateData.president_name}
                  onChange={handleStateInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label htmlFor="president_title" className="block text-sm font-medium text-gray-700 mb-2">
                  President Title
                </label>
                <input
                  type="text"
                  id="president_title"
                  name="president_title"
                  value={stateData.president_title}
                  onChange={handleStateInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label htmlFor="institutional_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Institutional Email
                </label>
                <input
                  type="email"
                  id="institutional_email"
                  name="institutional_email"
                  value={stateData.institutional_email}
                  onChange={handleStateInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label htmlFor="state_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Committee Phone
                </label>
                <input
                  type="text"
                  id="state_phone"
                  name="phone"
                  value={stateData.phone}
                  onChange={handleStateInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={stateData.website}
                  onChange={handleStateInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label htmlFor="social_media" className="block text-sm font-medium text-gray-700 mb-2">
                  Social Media
                </label>
                <input
                  type="text"
                  id="social_media"
                  name="social_media"
                  value={stateData.social_media}
                  onChange={handleStateInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Logo Upload Section */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Committee Logo</h4>
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <CentralizedImageUpload
                  uploadType="state-logo"
                  value={stateData.logo_url}
                  onChange={handleLogoUpload}
                  className="w-full"
                />
              </div>
              {stateData.logo_url && (
                <div className="flex-shrink-0">
                  <img
                    src={stateData.logo_url}
                    alt="Current logo"
                    className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Upload a logo for your state committee (PNG, JPG up to 5MB)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  // View mode
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
          <p className="text-sm text-gray-600">View and manage your state committee profile</p>
        </div>
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Edit Profile
        </button>
      </div>

      {/* User Account Information */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-900 mb-4">User Account</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
            <p className="text-gray-900">{user.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Personal Phone</label>
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
        <h4 className="text-md font-medium text-gray-900 mb-4">State Committee Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Committee Name</label>
            <p className="text-gray-900">{profile.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">RFC</label>
            <p className="text-gray-900">{profile.rfc || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">President Name</label>
            <p className="text-gray-900">{profile.president_name || 'Not assigned'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">President Title</label>
            <p className="text-gray-900">{profile.president_title || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
            <p className="text-gray-900">{profile.state?.name || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Institutional Email</label>
            <p className="text-gray-900">{profile.institutional_email || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Committee Phone</label>
            <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Website</label>
            <p className="text-gray-900">
              {profile.website ? (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800">
                  {profile.website}
                </a>
              ) : (
                'Not provided'
              )}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Social Media</label>
            <p className="text-gray-900">{profile.social_media || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Additional Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Affiliation Expires</label>
            <p className="text-gray-900">
              {profile.affiliation_expires_at ?
                new Date(profile.affiliation_expires_at).toLocaleDateString() :
                'No expiration date'
              }
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
            <p className="text-gray-900">{new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
            <p className="text-gray-900">{new Date(profile.updated_at).toLocaleDateString()}</p>
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
  )
}