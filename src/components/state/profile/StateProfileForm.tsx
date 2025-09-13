import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { updateStateProfile } from '../../../store/slices/stateDashboardSlice'
import { StateCommittee, User } from '../../../types/auth'
import CentralizedImageUpload from '../../common/CentralizedImageUpload'

interface StateProfileFormProps {
  stateCommittee: StateCommittee
  user: User
  onCancel: () => void
}

const StateProfileForm: React.FC<StateProfileFormProps> = ({ stateCommittee, user, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading } = useSelector((state: RootState) => state.loading)
  
  const [userData, setUserData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone || ''
  })

  const [stateData, setStateData] = useState({
    name: stateCommittee.name,
    president_name: stateCommittee.president_name || '',
    president_title: stateCommittee.president_title || '',
    rfc: stateCommittee.rfc || '',
    website: stateCommittee.website || '',
    social_media: stateCommittee.social_media || '',
    logo_url: stateCommittee.logo_url || '',
    institutional_email: stateCommittee.institutional_email || '',
    phone: stateCommittee.phone || ''
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

      // Navigate back to profile view after a short delay
      setTimeout(() => {
        onCancel() // This will switch back to view mode
      }, 1500)
    } catch (error) {
      setError((error as { message?: string }).message || 'Failed to update profile')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-red-600 text-white p-6">
        <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
        <p className="text-red-100">Update your state committee information</p>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mx-8 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mx-8 mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* User Account Info Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={userData.phone}
                onChange={handleUserInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* State Committee Profile Info Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">State Committee Information</h3>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Committee Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={stateData.phone}
                onChange={handleStateInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Committee Logo
              </label>
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
              <p className="mt-1 text-sm text-gray-500">
                Upload a logo for your state committee (PNG, JPG up to 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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

export default StateProfileForm