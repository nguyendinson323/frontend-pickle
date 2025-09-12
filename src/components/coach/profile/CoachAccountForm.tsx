import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { CoachProfileData, updateCoachProfile, uploadProfilePhoto } from '../../../store/slices/coachProfileSlice'
import CentralizedImageUpload from '../../common/CentralizedImageUpload'

interface CoachAccountFormProps {
  profile: CoachProfileData
  onCancel: () => void
}

const CoachAccountForm: React.FC<CoachAccountFormProps> = ({ profile, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    email: profile.user.email || '',
    phone: profile.user.phone || '',
    hourly_rate: profile.hourly_rate || '',
    nrtp_level: profile.nrtp_level || '',
    is_searchable: profile.user.is_searchable
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      const updateData = {
        ...formData,
        hourly_rate: typeof formData.hourly_rate === 'string' ? 
          (formData.hourly_rate === '' ? undefined : parseFloat(formData.hourly_rate)) : 
          formData.hourly_rate,
        nrtp_level: typeof formData.nrtp_level === 'string' ? 
          (formData.nrtp_level === '' ? undefined : parseFloat(formData.nrtp_level)) : 
          formData.nrtp_level
      }
      await dispatch(updateCoachProfile(updateData))
      onCancel() // Close edit mode
    } catch (error: any) {
      console.error('Failed to update profile:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.'
      setErrors({ general: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Edit Account Information</h3>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Personal Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            {errors.full_name && (
              <p className="text-red-600 text-sm mt-1">{errors.full_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NRTP Level
            </label>
            <select
              name="nrtp_level"
              value={formData.nrtp_level}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select NRTP Level</option>
              <option value="1.0">1.0</option>
              <option value="1.5">1.5</option>
              <option value="2.0">2.0</option>
              <option value="2.5">2.5</option>
              <option value="3.0">3.0</option>
              <option value="3.5">3.5</option>
              <option value="4.0">4.0</option>
              <option value="4.5">4.5</option>
              <option value="5.0">5.0</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                name="hourly_rate"
                value={formData.hourly_rate}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Set your coaching rate per hour
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+52 123 456 7890"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Privacy Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Profile Visibility</p>
              <p className="text-sm text-gray-600">
                Allow other coaches and players to find you in searches
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="is_searchable"
                checked={formData.is_searchable}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Profile Photo Section */}
      <CentralizedImageUpload
        uploadType="coach-photo"
        value={profile.profile_photo_url || ''}
        onChange={async (photoUrl) => {
          try {
            await dispatch(uploadProfilePhoto(photoUrl))
          } catch (error) {
            console.error('Failed to update profile photo:', error)
          }
        }}
        color="green"
        className="bg-white rounded-lg border border-gray-200"
      />
    </form>
  )
}

export default CoachAccountForm