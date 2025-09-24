import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../../store'
import { updatePartnerProfile, PartnerProfile } from '../../../../store/slices/partnerProfileSlice'
import { fetchCommonData } from '../../../../store/slices/commonSlice'
import SimpleImageUpload from '../../../common/SimpleImageUpload'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiEdit3,
  FiSave,
  FiX,
  FiGlobe,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiMapPin,
  FiTag,
  FiExternalLink,
  FiUsers,
  FiClock,
  FiShield,
  FiCreditCard
} from 'react-icons/fi'

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
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg border border-gray-200">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl"></div>
            <div className="flex-1">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/3 mb-2"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-700 px-8 py-6">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                <FiEdit3 className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold">Edit Account Information</h3>
            </div>
          </div>
        </div>
        <div className="p-8">

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* User Account Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mr-3">
                <FiUser className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Account Details</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="user_username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="user_username"
                    name="user_username"
                    value={formData.user_data.username}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="user_email"
                    name="user_email"
                    value={formData.user_data.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="user_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="user_phone"
                    name="user_phone"
                    value={formData.user_data.phone}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center mr-3">
                <FiHome className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Business Information</h4>
            </div>
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
                />
              </div>
              <div className="md:col-span-2">
                <SimpleImageUpload
                  fieldName="business_logo_url"
                  fileType="image"
                  value={formData.logo_url}
                  onChange={(imageUrl) => setFormData(prev => ({ ...prev, logo_url: imageUrl }))}
                  className="bg-gray-50 border border-gray-200"
                  title="Business Logo"
                  enableCropping={true}
                  aspectRatio={1}
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
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-6 py-3 border-2 border-gray-300 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 transition-all duration-200 hover:transform hover:scale-105"
            >
              <FiX className="w-5 h-5 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-2xl hover:from-purple-700 hover:to-pink-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold"
            >
              <FiSave className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 text-white">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
              <FiUser className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold">Account Information</h3>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 text-white rounded-2xl hover:bg-opacity-30 transition-all duration-300 font-bold hover:transform hover:scale-105"
          >
            <FiEdit3 className="w-5 h-5 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>
      <div className="p-8">

      <div className="space-y-8">
        {/* Account Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mr-3">
              <FiUser className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Account Details</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-4 border border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiUser className="w-4 h-4 text-blue-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">Username</label>
              </div>
              <p className="text-lg font-semibold text-gray-900">{profile.user.username}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiMail className="w-4 h-4 text-blue-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">Email</label>
              </div>
              <p className="text-lg font-semibold text-gray-900">{profile.user.email}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiPhone className="w-4 h-4 text-blue-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">Phone</label>
              </div>
              <p className="text-lg font-semibold text-gray-900">{profile.user.phone || 'Not provided'}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiShield className="w-4 h-4 text-blue-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">Account Status</label>
              </div>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                profile.user.is_active ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300' : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-300'
              }`}>
                {profile.user.is_active ? (
                  <><FiCheckCircle className="w-4 h-4 mr-2" />Active</>
                ) : (
                  <><FiXCircle className="w-4 h-4 mr-2" />Inactive</>
                )}
              </span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiCheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">Verification Status</label>
              </div>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                profile.user.is_verified ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300' : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-300'
              }`}>
                {profile.user.is_verified ? (
                  <><FiCheckCircle className="w-4 h-4 mr-2" />Verified</>
                ) : (
                  <><FiClock className="w-4 h-4 mr-2" />Pending</>
                )}
              </span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiClock className="w-4 h-4 text-blue-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">Last Login</label>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {profile.user.last_login ?
                  new Date(profile.user.last_login).toLocaleDateString() :
                  'Never logged in'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center mr-3">
              <FiHome className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Business Information</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-4 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiHome className="w-4 h-4 text-green-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">Business Name</label>
              </div>
              <p className="text-lg font-semibold text-gray-900">{profile.business_name}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiTag className="w-4 h-4 text-green-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">Partner Type</label>
              </div>
              <p className="text-lg font-semibold text-gray-900 capitalize">{profile.partner_type?.replace('_', ' ') || 'Not specified'}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiCreditCard className="w-4 h-4 text-green-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">RFC (Tax ID)</label>
              </div>
              <p className="text-lg font-semibold text-gray-900">{profile.rfc || 'Not provided'}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiUsers className="w-4 h-4 text-green-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">Contact Name</label>
              </div>
              <p className="text-lg font-semibold text-gray-900">{profile.contact_name || 'Not specified'}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiUser className="w-4 h-4 text-green-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">Contact Title</label>
              </div>
              <p className="text-lg font-semibold text-gray-900">{profile.contact_title || 'Not specified'}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiMapPin className="w-4 h-4 text-green-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">State</label>
              </div>
              <p className="text-lg font-semibold text-gray-900">{profile.state?.name || 'Not specified'}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiHome className="w-4 h-4 text-green-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">Has Courts</label>
              </div>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                profile.has_courts ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300' : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
              }`}>
                {profile.has_courts ? (
                  <><FiCheckCircle className="w-4 h-4 mr-2" />Yes</>
                ) : (
                  <><FiXCircle className="w-4 h-4 mr-2" />No</>
                )}
              </span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiGlobe className="w-4 h-4 text-green-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">Website</label>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {profile.website ? (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors duration-200">
                    <span className="mr-2">{profile.website}</span>
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  'Not provided'
                )}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiUsers className="w-4 h-4 text-green-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">Social Media</label>
              </div>
              <p className="text-lg font-semibold text-gray-900">{profile.social_media || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Membership Information */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl flex items-center justify-center mr-3">
              <FiCreditCard className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Membership Information</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-4 border border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiCreditCard className="w-4 h-4 text-purple-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">Premium Expires</label>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {profile.premium_expires_at ?
                  new Date(profile.premium_expires_at).toLocaleDateString() :
                  'Not premium member'
                }
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <FiCalendar className="w-4 h-4 text-purple-600 mr-2" />
                <label className="block text-sm font-bold text-gray-600">Member Since</label>
              </div>
              <p className="text-lg font-semibold text-gray-900">{new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}