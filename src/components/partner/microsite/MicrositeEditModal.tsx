import React, { useState, useEffect } from 'react'
import { PartnerMicrositeInfo } from '../../../store/slices/partnerMicrositeSlice'
import SimpleImageUpload from '../../common/SimpleImageUpload'

interface MicrositeEditModalProps {
  micrositeInfo: PartnerMicrositeInfo | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<PartnerMicrositeInfo>) => Promise<void>
}

const MicrositeEditModal: React.FC<MicrositeEditModalProps> = ({
  micrositeInfo,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subdomain: '',
    primary_color: '#000000',
    secondary_color: '#FFFFFF',
    logo_url: '',
    banner_url: ''
  })
  
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (micrositeInfo) {
      setFormData({
        title: micrositeInfo.title || '',
        description: micrositeInfo.description || '',
        subdomain: micrositeInfo.subdomain || '',
        primary_color: micrositeInfo.primary_color || '#000000',
        secondary_color: micrositeInfo.secondary_color || '#FFFFFF',
        logo_url: micrositeInfo.logo_url || '',
        banner_url: micrositeInfo.banner_url || ''
      })
    }
  }, [micrositeInfo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Failed to save microsite:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-xl font-bold text-gray-900">Edit Microsite</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Microsite Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter microsite title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter microsite description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subdomain (Optional)
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={formData.subdomain}
                  onChange={(e) => handleInputChange('subdomain', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="mypartner"
                />
                <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 text-gray-500 text-sm">
                  .pickleballfed.com
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Choose a unique subdomain for your microsite
              </p>
            </div>
          </div>

          {/* Branding */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Branding & Colors</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex">
                  <input
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-l-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex">
                  <input
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-l-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Media</h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Image
              </label>
              <SimpleImageUpload
                uploadType="partner-logo-auth"
                value={formData.logo_url}
                onChange={(url) => handleInputChange('logo_url', url)}
                className="w-full"
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload your logo image (square format recommended)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image
              </label>
              <SimpleImageUpload
                uploadType="club-banner"
                value={formData.banner_url}
                onChange={(url) => handleInputChange('banner_url', url)}
                className="w-full"
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload your banner image (3:1 aspect ratio recommended)
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MicrositeEditModal