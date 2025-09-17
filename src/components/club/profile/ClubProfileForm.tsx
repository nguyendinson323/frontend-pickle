import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { updateClubProfile } from '../../../store/slices/authSlice'
import { Club, User, State } from '../../../types/auth'
import api from '../../../services/api'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiBriefcase,
  FiFileText,
  FiMapPin,
  FiGlobe,
  FiShare2,
  FiSave,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiEdit3,
  FiImage
} from 'react-icons/fi'

interface ClubProfileFormProps {
  club: Club
  user: User
  onCancel: () => void
}

const ClubProfileForm: React.FC<ClubProfileFormProps> = ({ club, user, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>()
  
  const [states, setStates] = useState<State[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  const [userData, setUserData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone || ''
  })

  const [clubData, setClubData] = useState<{
    name: string
    rfc: string
    manager_name: string
    manager_title: string
    state_id: number | null
    club_type: string
    website: string
    social_media: string
    logo_url: string
    has_courts: boolean
  }>({
    name: club.name,
    rfc: club.rfc || '',
    manager_name: club.manager_name || '',
    manager_title: club.manager_title || '',
    state_id: club.state_id || null,
    club_type: club.club_type || '',
    website: club.website || '',
    social_media: club.social_media || '',
    logo_url: club.logo_url || '',
    has_courts: club.has_courts
  })

  // Load states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get('/api/common/states')
        setStates(response.data as State[])
      } catch (error) {
        console.error('Error fetching states:', error)
      }
    }
    fetchStates()
  }, [])

  const clubTypes = [
    { value: 'Recreation Center', label: 'Recreation Center' },
    { value: 'Country Club', label: 'Country Club' },
    { value: 'Sports Club', label: 'Sports Club' },
    { value: 'Community Club', label: 'Community Club' },
    { value: 'Tennis Club', label: 'Tennis Club' },
    { value: 'Private Club', label: 'Private Club' },
    { value: 'Public Facility', label: 'Public Facility' },
    { value: 'Other', label: 'Other' }
  ]

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleClubInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setClubData(prev => ({ ...prev, [name]: checked }))
    } else {
      // Handle state_id as number
      if (name === 'state_id') {
        setClubData(prev => ({ ...prev, [name]: value ? parseInt(value) : null }))
      } else {
        setClubData(prev => ({ ...prev, [name]: value }))
      }
    }
  }

  // Handle logo URL change from SimpleImageUpload
  const handleLogoChange = (url: string) => {
    setClubData(prev => ({ ...prev, logo_url: url }))
  }


  // Validation function
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    // User data validation
    if (!userData.username.trim()) {
      errors.username = 'Username is required'
    } else if (userData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    }
    
    if (!userData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (userData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(userData.phone)) {
      errors.phone = 'Please enter a valid phone number'
    }
    
    // Club data validation
    if (!clubData.name.trim()) {
      errors.name = 'Club name is required'
    }
    
    if (clubData.website && !/^https?:\/\/.+/.test(clubData.website)) {
      errors.website = 'Please enter a valid URL (starting with http:// or https://)'
    }
    
    if (clubData.rfc && !/^[A-Z]{3,4}\d{6}[A-Z0-9]{3}$/i.test(clubData.rfc)) {
      errors.rfc = 'Please enter a valid RFC format (e.g., ABC123456789)'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setValidationErrors({})
    
    // Validate form
    if (!validateForm()) {
      setError('Please correct the errors below')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const updateData = {
        ...clubData,
        user_data: userData
      }

      await dispatch(updateClubProfile(updateData))
      setSuccess(true)
      
      // Close form after successful update
      setTimeout(() => {
        onCancel()
      }, 1500)
      
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setError(error.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-8">
        <h2 className="text-2xl font-bold mb-3 flex items-center">
          <FiEdit3 className="h-7 w-7 mr-3" />
          Edit Profile
        </h2>
        <p className="text-purple-100 font-medium">Update your club information and settings</p>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-10 bg-gradient-to-br from-gray-50 to-white">
        
        {/* Success/Error Messages */}
        {(error || success) && (
          <div className={`p-6 rounded-2xl shadow-lg border-2 ${
            error ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
          }`}>
            {error && (
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-4">
                  <p className="text-red-800 font-bold">{error}</p>
                </div>
              </div>
            )}
            {success && (
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiCheck className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-green-800 font-bold">Profile updated successfully!</p>
                </div>
              </div>
            )}
          </div>
        )}
        {/* User Account Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FiUser className="h-6 w-6 mr-3 text-blue-600" />
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <FiUser className="h-4 w-4 mr-2 text-blue-500" />
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleUserInputChange}
                className={`w-full px-4 py-3 border-2 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 transition-all duration-200 hover:border-gray-400 ${
                  validationErrors.username
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter username"
              />
              {validationErrors.username && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                  <FiAlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.username}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <FiMail className="h-4 w-4 mr-2 text-green-500" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleUserInputChange}
                className={`w-full px-4 py-3 border-2 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 transition-all duration-200 hover:border-gray-400 ${
                  validationErrors.email
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Enter email address"
              />
              {validationErrors.email && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                  <FiAlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <FiPhone className="h-4 w-4 mr-2 text-purple-500" />
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={userData.phone}
                onChange={handleUserInputChange}
                className={`w-full px-4 py-3 border-2 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 transition-all duration-200 hover:border-gray-400 ${
                  validationErrors.phone
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-purple-500'
                }`}
                placeholder="Enter phone number (optional)"
              />
              {validationErrors.phone && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                  <FiAlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Club Profile Info Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FiHome className="h-6 w-6 mr-3 text-green-600" />
            Club Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <FiHome className="h-4 w-4 mr-2 text-blue-500" />
                Club Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={clubData.name}
                onChange={handleClubInputChange}
                className={`w-full px-4 py-3 border-2 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 transition-all duration-200 hover:border-gray-400 ${
                  validationErrors.name
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Enter club name"
              />
              {validationErrors.name && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                  <FiAlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="club_type" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <FiBriefcase className="h-4 w-4 mr-2 text-green-500" />
                Club Type
              </label>
              <select
                id="club_type"
                name="club_type"
                value={clubData.club_type}
                onChange={handleClubInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-gray-400"
              >
                <option value="">Select club type</option>
                {clubTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rfc" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <FiFileText className="h-4 w-4 mr-2 text-purple-500" />
                RFC
              </label>
              <input
                type="text"
                id="rfc"
                name="rfc"
                value={clubData.rfc}
                onChange={handleClubInputChange}
                className={`w-full px-4 py-3 border-2 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 transition-all duration-200 hover:border-gray-400 ${
                  validationErrors.rfc
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-purple-500'
                }`}
                placeholder="Enter RFC (optional)"
              />
              {validationErrors.rfc && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                  <FiAlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.rfc}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="manager_name" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <FiUser className="h-4 w-4 mr-2 text-indigo-500" />
                Manager Name
              </label>
              <input
                type="text"
                id="manager_name"
                name="manager_name"
                value={clubData.manager_name}
                onChange={handleClubInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-gray-400"
                placeholder="Enter manager name"
              />
            </div>
            <div>
              <label htmlFor="manager_title" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <FiBriefcase className="h-4 w-4 mr-2 text-orange-500" />
                Manager Title
              </label>
              <input
                type="text"
                id="manager_title"
                name="manager_title"
                value={clubData.manager_title}
                onChange={handleClubInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 hover:border-gray-400"
                placeholder="e.g., Club Manager, Director, Owner"
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <FiGlobe className="h-4 w-4 mr-2 text-blue-500" />
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={clubData.website}
                onChange={handleClubInputChange}
                className={`w-full px-4 py-3 border-2 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 transition-all duration-200 hover:border-gray-400 ${
                  validationErrors.website
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="https://yourclub.com"
              />
              {validationErrors.website && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                  <FiAlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.website}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="social_media" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <FiShare2 className="h-4 w-4 mr-2 text-pink-500" />
                Social Media
              </label>
              <input
                type="text"
                id="social_media"
                name="social_media"
                value={clubData.social_media}
                onChange={handleClubInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 hover:border-gray-400"
                placeholder="Social media link (optional)"
              />
            </div>
            <div>
              <label htmlFor="state_id" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                <FiMapPin className="h-4 w-4 mr-2 text-red-500" />
                State
              </label>
              <select
                id="state_id"
                name="state_id"
                value={clubData.state_id || ''}
                onChange={handleClubInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 hover:border-gray-400"
              >
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FiImage className="h-5 w-5 mr-2 text-indigo-600" />
                  Club Logo
                </h4>
                <SimpleImageUpload
                  fieldName="logo_url"
                  fileType="image"
                  value={clubData.logo_url}
                  onChange={handleLogoChange}
                  disabled={isSubmitting}
                  title="Upload Club Logo"
                  enableCropping={true}
                  aspectRatio={1}
                  className="bg-white"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="has_courts"
                    name="has_courts"
                    checked={clubData.has_courts}
                    onChange={handleClubInputChange}
                    className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-2 border-gray-300 rounded-lg"
                  />
                  <label htmlFor="has_courts" className="ml-4 flex items-center text-gray-900 font-bold">
                    <FiHome className="h-5 w-5 mr-2 text-teal-600" />
                    Club has courts available
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-6 pt-8 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <FiX className="w-5 h-5 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-2xl hover:from-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105 flex items-center"
          >
            {isSubmitting && (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
            )}
            {success ? (
              <><FiCheck className="w-5 h-5 mr-2" />Saved!</>
            ) : isSubmitting ? (
              'Saving...'
            ) : (
              <><FiSave className="w-5 h-5 mr-2" />Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClubProfileForm