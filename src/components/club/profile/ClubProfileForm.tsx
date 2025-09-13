import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { updateClubProfile } from '../../../store/slices/authSlice'
import { Club, User, State } from '../../../types/auth'
import api from '../../../services/api'
import CentralizedImageUpload from '../../common/CentralizedImageUpload'

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
    { value: 'recreational', label: 'Recreational Club' },
    { value: 'competitive', label: 'Competitive Club' },
    { value: 'training', label: 'Training Club' },
    { value: 'social', label: 'Social Club' }
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

  // Handle logo URL change from CentralizedImageUpload
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
    
    if (clubData.rfc && !/^[A-Z]{3,4}\d{6}[A-Z0-9]{3}$/.test(clubData.rfc.toUpperCase())) {
      errors.rfc = 'Please enter a valid RFC format'
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
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-purple-600 text-white p-6">
        <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
        <p className="text-purple-100">Update your club information</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        
        {/* Success/Error Messages */}
        {(error || success) && (
          <div className={`p-4 rounded-md ${
            error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
          }`}>
            {error && (
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}
            {success && (
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">Profile updated successfully!</p>
                </div>
              </div>
            )}
          </div>
        )}
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  validationErrors.username 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-purple-500'
                }`}
              />
              {validationErrors.username && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
              )}
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  validationErrors.email 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-purple-500'
                }`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Club Profile Info Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Club Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Club Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={clubData.name}
                onChange={handleClubInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  validationErrors.name 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-purple-500'
                }`}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="club_type" className="block text-sm font-medium text-gray-700 mb-2">
                Club Type
              </label>
              <select
                id="club_type"
                name="club_type"
                value={clubData.club_type}
                onChange={handleClubInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              <label htmlFor="rfc" className="block text-sm font-medium text-gray-700 mb-2">
                RFC
              </label>
              <input
                type="text"
                id="rfc"
                name="rfc"
                value={clubData.rfc}
                onChange={handleClubInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="manager_name" className="block text-sm font-medium text-gray-700 mb-2">
                Manager Name
              </label>
              <input
                type="text"
                id="manager_name"
                name="manager_name"
                value={clubData.manager_name}
                onChange={handleClubInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="manager_title" className="block text-sm font-medium text-gray-700 mb-2">
                Manager Title
              </label>
              <input
                type="text"
                id="manager_title"
                name="manager_title"
                value={clubData.manager_title}
                onChange={handleClubInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                value={clubData.website}
                onChange={handleClubInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                value={clubData.social_media}
                onChange={handleClubInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="state_id" className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                id="state_id"
                name="state_id"
                value={clubData.state_id || ''}
                onChange={handleClubInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              <CentralizedImageUpload
                uploadType="club-logo"
                value={clubData.logo_url}
                onChange={handleLogoChange}
                disabled={isSubmitting}
                color="purple"
                className="bg-gray-50"
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="has_courts"
                  name="has_courts"
                  checked={clubData.has_courts}
                  onChange={handleClubInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="has_courts" className="ml-2 block text-sm text-gray-900">
                  Club has courts available
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {success ? 'Saved!' : (isSubmitting ? 'Saving...' : 'Save Changes')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClubProfileForm