import React, { useState, useEffect } from 'react'
import { StateMicrositeInfo } from '../../../store/slices/stateMicrositeSlice'
import CentralizedImageUpload from '../../common/CentralizedImageUpload'

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Edit State Profile</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="established_year" className="block text-sm font-medium text-gray-700">
                  Established Year
                </label>
                <input
                  type="number"
                  id="established_year"
                  name="established_year"
                  value={formData.established_year}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="mission_statement" className="block text-sm font-medium text-gray-700">
                Mission Statement
              </label>
              <textarea
                id="mission_statement"
                name="mission_statement"
                value={formData.mission_statement}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contact_email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Website & Social Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="website_url" className="block text-sm font-medium text-gray-700">
                  Website URL
                </label>
                <input
                  type="url"
                  id="website_url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="facebook_url" className="block text-sm font-medium text-gray-700">
                  Facebook URL
                </label>
                <input
                  type="url"
                  id="facebook_url"
                  name="facebook_url"
                  value={formData.facebook_url}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="twitter_url" className="block text-sm font-medium text-gray-700">
                  Twitter URL
                </label>
                <input
                  type="url"
                  id="twitter_url"
                  name="twitter_url"
                  value={formData.twitter_url}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-700">
                  Instagram URL
                </label>
                <input
                  type="url"
                  id="instagram_url"
                  name="instagram_url"
                  value={formData.instagram_url}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CentralizedImageUpload
                  uploadType="state-logo"
                  value={formData.logo_url}
                  onChange={handleLogoUpload}
                  title="Committee Logo"
                  color="blue"
                  className="bg-gray-50 border border-gray-200"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  }
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload your state committee logo (PNG, JPG up to 5MB)
                </p>
              </div>

              <div>
                <CentralizedImageUpload
                  uploadType="state-banner"
                  value={formData.banner_image_url}
                  onChange={handleBannerUpload}
                  title="Banner Image"
                  color="blue"
                  className="bg-gray-50 border border-gray-200"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload a banner image for your microsite header (PNG, JPG up to 5MB)
                </p>
              </div>
            </div>

            {/* Additional Content */}
            <div>
              <label htmlFor="custom_content" className="block text-sm font-medium text-gray-700">
                Additional Content
              </label>
              <textarea
                id="custom_content"
                name="custom_content"
                value={formData.custom_content}
                onChange={handleInputChange}
                rows={4}
                placeholder="Add any additional information you'd like to display on your microsite"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Visibility */}
            <div className="flex items-center">
              <input
                id="is_public"
                name="is_public"
                type="checkbox"
                checked={formData.is_public}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_public" className="text-sm text-gray-700">
                Make this microsite publicly visible
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title || !formData.description || !formData.contact_email}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditMicrositeModal