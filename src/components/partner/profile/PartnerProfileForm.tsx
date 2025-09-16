import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../../store'
import { updatePartnerProfile, updateProfileImage } from '../../../store/slices/authSlice'
import { Partner, User, PartnerDashboard } from '../../../types/auth'
import SimpleImageUpload from '../../common/SimpleImageUpload'

interface PartnerProfileFormProps {
  partner: Partner
  user: User
  onCancel: () => void
}

const PartnerProfileForm: React.FC<PartnerProfileFormProps> = ({ partner, user, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  
  const [userData, setUserData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone || ''
  })

  const [partnerData, setPartnerData] = useState({
    business_name: partner.business_name,
    rfc: partner.rfc || '',
    contact_name: partner.contact_name || '',
    contact_title: partner.contact_title || '',
    partner_type: partner.partner_type || '',
    website: partner.website || '',
    social_media: partner.social_media || '',
    logo_url: partner.logo_url || '',
    has_courts: partner.has_courts
  })

  const partnerTypes = [
    { value: 'hotel', label: 'Hotel' },
    { value: 'sports_center', label: 'Sports Center' },
    { value: 'country_club', label: 'Country Club' },
    { value: 'business', label: 'Business' }
  ]

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handlePartnerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setPartnerData(prev => ({ ...prev, [name]: checked }))
    } else {
      setPartnerData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleLogoChange = (url: string) => {
    setPartnerData(prev => ({ ...prev, logo_url: url }))
  }

  // Immediate upload handler for Redux state updates
  const handleLogoUpload = (url: string) => {
    // Update form data immediately
    setPartnerData(prev => ({ ...prev, logo_url: url }))
    // Update Redux state for immediate visual updates
    dispatch(updateProfileImage({ imageType: 'business_logo_url', imageUrl: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const updateData = {
      ...partnerData,
      user_data: userData
    }

    dispatch(updatePartnerProfile(updateData))
    navigate('/partner/profile')
  }

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-blue-600 text-white p-6">
        <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
        <p className="text-blue-100">Update your partner information</p>
      </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Partner Profile Info Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Partner Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                id="business_name"
                name="business_name"
                value={partnerData.business_name}
                onChange={handlePartnerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="partner_type" className="block text-sm font-medium text-gray-700 mb-2">
                Partner Type
              </label>
              <select
                id="partner_type"
                name="partner_type"
                value={partnerData.partner_type}
                onChange={handlePartnerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select partner type</option>
                {partnerTypes.map((type) => (
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
                value={partnerData.rfc}
                onChange={handlePartnerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                id="contact_name"
                name="contact_name"
                value={partnerData.contact_name}
                onChange={handlePartnerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="contact_title" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Title
              </label>
              <input
                type="text"
                id="contact_title"
                name="contact_title"
                value={partnerData.contact_title}
                onChange={handlePartnerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                value={partnerData.website}
                onChange={handlePartnerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                value={partnerData.social_media}
                onChange={handlePartnerInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <SimpleImageUpload
                uploadType="partner-logo-auth"
                value={partnerData.logo_url}
                onChange={handleLogoChange}
                onUploadComplete={handleLogoUpload}
                title="Business Logo"
                className="bg-gray-50 border border-gray-200"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>}
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="has_courts"
                  name="has_courts"
                  checked={partnerData.has_courts}
                  onChange={handlePartnerInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="has_courts" className="ml-2 block text-sm text-gray-900">
                  Partner has courts available
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
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover: focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default PartnerProfileForm