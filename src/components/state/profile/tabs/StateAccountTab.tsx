import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../store'
import { fetchStateDashboard } from '../../../../store/slices/stateDashboardSlice'
import { startLoading, stopLoading } from '../../../../store/slices/loadingSlice'
import { StateProfile } from '../../../../store/slices/stateDashboardSlice'
import { User } from '../../../../types/auth'
import api from '../../../../services/api'
import SimpleImageUpload from '../../../common/SimpleImageUpload'
import { FiEdit, FiUser, FiMail, FiPhone, FiGlobe, FiUsers, FiHome, FiSave, FiX, FiCamera, FiCheck, FiAlertCircle, FiClock, FiFileText, FiCalendar, FiActivity } from 'react-icons/fi'

interface StateAccountTabProps {
  profile: StateProfile
  user: User
}

interface StateProfileFormProps {
  profile: StateProfile
  user: User
  onCancel: () => void
}

// Separate form component using the same pattern as PlayerProfileForm
const StateProfileForm: React.FC<StateProfileFormProps> = ({ profile, user, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>()

  const [userData, setUserData] = useState({
    username: user.username || '',
    email: user.email || '',
    phone: user.phone || ''
  })

  const [stateData, setStateData] = useState({
    name: profile.name || '',
    president_name: profile.president_name || '',
    president_title: profile.president_title || '',
    rfc: profile.rfc || '',
    website: profile.website || '',
    social_media: profile.social_media || '',
    logo_url: profile.logo_url || '',
    institutional_email: profile.institutional_email || '',
    phone: profile.phone || ''
  })

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

    try {
      dispatch(startLoading('Updating profile...'))

      const updateData = {
        ...stateData,
        user_data: userData
      }

      // Update state profile
      await api.put('/api/auth/profile/state', updateData)

      // Refresh dashboard data to get updated profile
      await dispatch(fetchStateDashboard())

      // Close editing mode
      onCancel()

    } catch (error: any) {
      console.error('Failed to update profile:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update profile'
      alert(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 backdrop-blur-sm">
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
        <div className="relative z-10 flex items-center space-x-3">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shadow-lg">
            <FiEdit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>
            <p className="text-blue-100">Update your state committee information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* User Account Info Section */}
        <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-6">
            <FiUser className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Account Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleUserInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="email" className="flex items-center space-x-2 text-sm font-bold text-gray-700 mb-2">
                <FiMail className="w-4 h-4 text-blue-600" />
                <span>Email</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleUserInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="phone" className="flex items-center space-x-2 text-sm font-bold text-gray-700 mb-2">
                <FiPhone className="w-4 h-4 text-blue-600" />
                <span>Phone</span>
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={userData.phone}
                onChange={handleUserInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* State Committee Profile Info Section */}
        <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-6">
            <FiHome className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">State Committee Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                Committee Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={stateData.name}
                onChange={handleStateInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="rfc" className="block text-sm font-bold text-gray-700 mb-2">
                RFC
              </label>
              <input
                type="text"
                id="rfc"
                name="rfc"
                value={stateData.rfc}
                onChange={handleStateInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="president_name" className="flex items-center space-x-2 text-sm font-bold text-gray-700 mb-2">
                <FiUsers className="w-4 h-4 text-blue-600" />
                <span>President Name</span>
              </label>
              <input
                type="text"
                id="president_name"
                name="president_name"
                value={stateData.president_name}
                onChange={handleStateInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="president_title" className="block text-sm font-bold text-gray-700 mb-2">
                President Title
              </label>
              <input
                type="text"
                id="president_title"
                name="president_title"
                value={stateData.president_title}
                onChange={handleStateInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="institutional_email" className="flex items-center space-x-2 text-sm font-bold text-gray-700 mb-2">
                <FiMail className="w-4 h-4 text-blue-600" />
                <span>Institutional Email</span>
              </label>
              <input
                type="email"
                id="institutional_email"
                name="institutional_email"
                value={stateData.institutional_email}
                onChange={handleStateInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="phone" className="flex items-center space-x-2 text-sm font-bold text-gray-700 mb-2">
                <FiPhone className="w-4 h-4 text-blue-600" />
                <span>Committee Phone</span>
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={stateData.phone}
                onChange={handleStateInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="website" className="flex items-center space-x-2 text-sm font-bold text-gray-700 mb-2">
                <FiGlobe className="w-4 h-4 text-blue-600" />
                <span>Website</span>
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={stateData.website}
                onChange={handleStateInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="social_media" className="block text-sm font-bold text-gray-700 mb-2">
                Social Media
              </label>
              <input
                type="text"
                id="social_media"
                name="social_media"
                value={stateData.social_media}
                onChange={handleStateInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <FiCamera className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm font-bold text-gray-700">Committee Logo</h4>
              </div>
              <SimpleImageUpload
                fieldName="committee_logo_url"
                fileType="image"
                value={stateData.logo_url}
                onChange={handleLogoUpload}
                title="Committee Logo"
                className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-2xl"
                enableCropping={true}
                aspectRatio={1}
                icon={
                  <FiCamera className="w-6 h-6" />
                }
              />
              <p className="mt-3 text-sm text-gray-600">
                Upload a logo for your state committee (PNG, JPG up to 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
          >
            <FiX className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
          >
            <FiSave className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  )
}

// Main component with view/edit toggle
export const StateAccountTab: React.FC<StateAccountTabProps> = ({ profile, user }) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  if (isEditing) {
    return <StateProfileForm profile={profile} user={user} onCancel={handleCancel} />
  }

  // View mode
  return (
    <div className="space-y-8">
      {/* Header Section with Modern Design */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border-2 border-gray-200/50 p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <FiUser className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-2">Account Information</h3>
              <p className="text-lg text-gray-600 font-medium">View and manage your state committee profile with advanced settings</p>
            </div>
          </div>
          <button
            onClick={handleEdit}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <FiEdit className="w-5 h-5 mr-3" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* User Account Information */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200/50 backdrop-blur-sm overflow-hidden">
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
          <div className="relative z-10 flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <FiUser className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-2">User Account Details</h4>
              <p className="text-blue-100">Personal account information and verification status</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm border-2 border-blue-200/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FiUser className="w-5 h-5 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-700 uppercase">Username</label>
                  <p className="text-xl font-bold text-gray-900">{user.username}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm border-2 border-green-200/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FiMail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-green-700 uppercase">Email</label>
                  <p className="text-xl font-bold text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm border-2 border-purple-200/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FiPhone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-purple-700 uppercase">Personal Phone</label>
                  <p className="text-xl font-bold text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm border-2 border-emerald-200/30">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                    user.is_active ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}>
                    {user.is_active ? <FiCheck className="w-5 h-5 text-white" /> : <FiX className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-emerald-700 uppercase">Account Status</label>
                    <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${
                      user.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm border-2 border-yellow-200/30">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                    user.is_verified ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                  }`}>
                    {user.is_verified ? <FiCheck className="w-5 h-5 text-white" /> : <FiClock className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-yellow-700 uppercase">Verification Status</label>
                    <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${
                      user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm border-2 border-purple-200/30">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                    user.is_premium ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'
                  }`}>
                    <FiAlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-700 uppercase">Premium Status</label>
                    <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${
                      user.is_premium ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.is_premium ? 'Premium' : 'Standard'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}