import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../../store'
import { updatePartnerProfile, PartnerProfile } from '../../../../store/slices/partnerProfileSlice'
import { fetchCommonData } from '../../../../store/slices/commonSlice'
import SimpleImageUpload from '../../../common/SimpleImageUpload'

interface PartnerAccountTabProps {
  profile: PartnerProfile | null
}

export const PartnerAccountTab: React.FC<PartnerAccountTabProps> = ({ profile }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { data: commonData } = useSelector((state: RootState) => state.common)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    business_name: profile?.business_name || '',
    rfc: profile?.rfc || '',
    contact_name: profile?.contact_name || '',
    contact_title: profile?.contact_title || '',
    partner_type: profile?.partner_type || '',
    state_id: profile?.state_id || null,
    website: profile?.website || '',
    social_media: profile?.social_media || '',
    logo_url: profile?.logo_url || '',
    has_courts: profile?.has_courts || false,
    user_data: {
      username: profile?.user?.username || '',
      email: profile?.user?.email || '',
      phone: profile?.user?.phone || ''
    }
  })

  useEffect(() => {
    if (!commonData) {
      dispatch(fetchCommonData())
    }
  }, [dispatch, commonData])

  const partnerTypes = [
    { value: 'hotel', label: 'Hotel' },
    { value: 'sports_center', label: 'Sports Center' },
    { value: 'country_club', label: 'Country Club' },
    { value: 'business', label: 'Business' },
    { value: 'resort', label: 'Resort' },
    { value: 'camp', label: 'Camp' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (name.startsWith('user_')) {
      const userField = name.replace('user_', '')
      setFormData(prev => ({
        ...prev,
        user_data: {
          ...prev.user_data,
          [userField]: value
        }
      }))
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'state_id') {
      const numericValue = value === '' ? null : parseInt(value, 10)
      setFormData(prev => ({ ...prev, [name]: numericValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(updatePartnerProfile(formData))
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleCancel = () => {
    setFormData({
      business_name: profile?.business_name || '',
      rfc: profile?.rfc || '',
      contact_name: profile?.contact_name || '',
      contact_title: profile?.contact_title || '',
      partner_type: profile?.partner_type || '',
      state_id: profile?.state_id || null,
      website: profile?.website || '',
      social_media: profile?.social_media || '',
      logo_url: profile?.logo_url || '',
      has_courts: profile?.has_courts || false,
      user_data: {
        username: profile?.user?.username || '',
        email: profile?.user?.email || '',
        phone: profile?.user?.phone || ''
      }
    })
    setIsEditing(false)
  }

  if (!profile) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Edit Account Information</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* User Account Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Account Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="user_username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="user_username"
                  name="user_username"
                  value={formData.user_data.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  value={formData.user_data.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="user_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  id="user_phone"
                  name="user_phone"
                  value={formData.user_data.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Business Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  id="business_name"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="partner_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Partner Type
                </label>
                <select
                  id="partner_type"
                  name="partner_type"
                  value={formData.partner_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  RFC (Tax ID)
                </label>
                <input
                  type="text"
                  id="rfc"
                  name="rfc"
                  value={formData.rfc}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  value={formData.contact_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  value={formData.contact_title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="state_id" className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  id="state_id"
                  name="state_id"
                  value={formData.state_id?.toString() || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select state</option>
                  {commonData?.states?.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  value={formData.social_media}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="md:col-span-2">
                <SimpleImageUpload
                  uploadType="partner-logo-auth"
                  value={formData.logo_url}
                  onChange={(imageUrl) => setFormData(prev => ({ ...prev, logo_url: imageUrl }))}
                  className="bg-gray-50 border border-gray-200"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="has_courts"
                    name="has_courts"
                    checked={formData.has_courts}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="has_courts" className="ml-2 block text-sm text-gray-900">
                    Partner has courts available for booking
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Edit Profile
        </button>
      </div>

      <div className="space-y-8">
        {/* Account Information */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Account Details</h4>
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
              <p className="text-gray-900">{profile.user.phone || 'Not provided'}</p>
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

        {/* Business Information */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Business Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Business Name</label>
              <p className="text-gray-900">{profile.business_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Partner Type</label>
              <p className="text-gray-900 capitalize">{profile.partner_type?.replace('_', ' ') || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">RFC (Tax ID)</label>
              <p className="text-gray-900">{profile.rfc || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Contact Name</label>
              <p className="text-gray-900">{profile.contact_name || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Contact Title</label>
              <p className="text-gray-900">{profile.contact_title || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
              <p className="text-gray-900">{profile.state?.name || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Has Courts</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                profile.has_courts ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {profile.has_courts ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Website</label>
              <p className="text-gray-900">
                {profile.website ? (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
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

        {/* Membership Information */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Membership Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Premium Expires</label>
              <p className="text-gray-900">
                {profile.premium_expires_at ? 
                  new Date(profile.premium_expires_at).toLocaleDateString() : 
                  'Not premium member'
                }
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
              <p className="text-gray-900">{new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}