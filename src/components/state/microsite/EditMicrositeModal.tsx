import React, { useState, useEffect } from 'react'
import { StateMicrositeInfo } from '../../../store/slices/stateMicrositeSlice'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import { FiX, FiEdit, FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiCamera, FiImage, FiEye, FiEyeOff, FiSave, FiCalendar } from 'react-icons/fi'

interface EditMicrositeModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (micrositeData: Partial<StateMicrositeInfo>) => Promise<void>
  micrositeInfo: StateMicrositeInfo | null
  loading: boolean
}

const EditMicrositeModal: React.FC<EditMicrositeModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  micrositeInfo,
  loading
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mission_statement: '',
    contact_email: '',
    contact_phone: '',
    website_url: '',
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
    logo_url: '',
    banner_image_url: '',
    address: '',
    established_year: '',
    is_public: true,
    custom_content: ''
  })

  useEffect(() => {
    if (micrositeInfo) {
      setFormData({
        title: micrositeInfo.title || '',
        description: micrositeInfo.description || '',
        mission_statement: micrositeInfo.mission_statement || '',
        contact_email: micrositeInfo.contact_email || '',
        contact_phone: micrositeInfo.contact_phone || '',
        website_url: micrositeInfo.website_url || '',
        facebook_url: micrositeInfo.facebook_url || '',
        twitter_url: micrositeInfo.twitter_url || '',
        instagram_url: micrositeInfo.instagram_url || '',
        logo_url: micrositeInfo.logo_url || '',
        banner_image_url: micrositeInfo.banner_image_url || '',
        address: micrositeInfo.address || '',
        established_year: micrositeInfo.established_year?.toString() || '',
        is_public: micrositeInfo.is_public,
        custom_content: micrositeInfo.custom_content || ''
      })
    }
  }, [micrositeInfo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const updateData: Partial<StateMicrositeInfo> = {
        ...formData,
        established_year: formData.established_year ? parseInt(formData.established_year) : null
      }

      // Remove empty strings and set them to null
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === '') {
          (updateData as any)[key] = null
        }
      })

      await onUpdate(updateData)
      onClose()
    } catch (error) {
      console.error('Error updating microsite:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  const handleLogoUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, logo_url: imageUrl }))
  }

  const handleBannerUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, banner_image_url: imageUrl }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-6 w-full max-w-5xl">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border border-gray-200/50">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 p-3 rounded-2xl shadow-lg">
                  <FiEdit className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Edit State Profile</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-6">
                  <FiUser className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-bold text-gray-900">Basic Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="established_year" className="flex items-center space-x-2 text-sm font-bold text-gray-700 mb-2">
                      <FiCalendar className="w-4 h-4 text-blue-600" />
                      <span>Established Year</span>
                    </label>
                    <input
                      type="number"
                      id="established_year"
                      name="established_year"
                      value={formData.established_year}
                      onChange={handleInputChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="mission_statement" className="block text-sm font-bold text-gray-700 mb-2">
                    Mission Statement
                  </label>
                  <textarea
                    id="mission_statement"
                    name="mission_statement"
                    value={formData.mission_statement}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-6">
                  <FiMail className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-bold text-gray-900">Contact Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact_email" className="block text-sm font-bold text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      id="contact_email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact_phone" className="flex items-center space-x-2 text-sm font-bold text-gray-700 mb-2">
                      <FiPhone className="w-4 h-4 text-blue-600" />
                      <span>Contact Phone</span>
                    </label>
                    <input
                      type="tel"
                      id="contact_phone"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="address" className="flex items-center space-x-2 text-sm font-bold text-gray-700 mb-2">
                    <FiMapPin className="w-4 h-4 text-blue-600" />
                    <span>Address</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Website & Social Media */}
              <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-6">
                  <FiGlobe className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-bold text-gray-900">Website & Social Media</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="website_url" className="block text-sm font-bold text-gray-700 mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      id="website_url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="facebook_url" className="block text-sm font-bold text-gray-700 mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      id="facebook_url"
                      name="facebook_url"
                      value={formData.facebook_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="twitter_url" className="block text-sm font-bold text-gray-700 mb-2">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      id="twitter_url"
                      name="twitter_url"
                      value={formData.twitter_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="instagram_url" className="block text-sm font-bold text-gray-700 mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      id="instagram_url"
                      name="instagram_url"
                      value={formData.instagram_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-6">
                  <FiImage className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-bold text-gray-900">Images</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <SimpleImageUpload
                      fieldName="state-logo"
                      fileType="image"
                      value={formData.logo_url}
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
                      Upload your state committee logo (PNG, JPG up to 5MB)
                    </p>
                  </div>

                  <div>
                    <SimpleImageUpload
                      fieldName="state-banner"
                      fileType="image"
                      value={formData.banner_image_url}
                      onChange={handleBannerUpload}
                      title="Banner Image"
                      className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-2xl"
                      enableCropping={true}
                      aspectRatio={16/9}
                      icon={
                        <FiImage className="w-6 h-6" />
                      }
                    />
                    <p className="mt-3 text-sm text-gray-600">
                      Upload a banner image for your microsite header (PNG, JPG up to 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Content */}
              <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-6">
                  <FiEdit className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-bold text-gray-900">Additional Content & Visibility</h4>
                </div>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="custom_content" className="block text-sm font-bold text-gray-700 mb-2">
                      Additional Content
                    </label>
                    <textarea
                      id="custom_content"
                      name="custom_content"
                      value={formData.custom_content}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Add any additional information you'd like to display on your microsite"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <input
                        id="is_public"
                        name="is_public"
                        type="checkbox"
                        checked={formData.is_public}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                      />
                      <div className="flex items-center space-x-2">
                        {formData.is_public ? (
                          <FiEye className="w-5 h-5 text-blue-600" />
                        ) : (
                          <FiEyeOff className="w-5 h-5 text-gray-500" />
                        )}
                        <label htmlFor="is_public" className="text-sm font-medium text-gray-800">
                          Make this microsite publicly visible
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.title || !formData.description || !formData.contact_email}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditMicrositeModal