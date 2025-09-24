import React, { useState, useEffect } from 'react'
import { PartnerMicrositeInfo } from '../../../store/slices/partnerMicrositeSlice'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import {
  FiEdit3,
  FiX,
  FiSave,
  FiType,
  FiLink,
  FiImage,
  FiSliders
} from 'react-icons/fi'

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
      <div className="relative top-20 mx-auto p-0 border-0 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-2xl rounded-3xl bg-gradient-to-br from-white to-gray-50 overflow-hidden">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-700 px-8 py-6">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-3">
                <FiEdit3 className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold">Edit Microsite</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mr-3">
                <FiType className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Basic Information</h4>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Microsite Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
                placeholder="Enter microsite title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
                placeholder="Enter microsite description"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Subdomain (Optional)
              </label>
              <div className="flex items-center bg-white border-2 border-gray-300 rounded-2xl overflow-hidden hover:bg-gray-50 transition-all duration-200">
                <div className="flex items-center px-4 py-3 flex-1">
                  <FiLink className="w-5 h-5 text-purple-600 mr-2" />
                  <input
                    type="text"
                    value={formData.subdomain}
                    onChange={(e) => handleInputChange('subdomain', e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none font-medium text-gray-900"
                    placeholder="mypartner"
                  />
                </div>
                <span className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 text-sm font-bold border-l-2 border-gray-300">
                  .pickleballfed.com
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 font-medium">
                Choose a unique subdomain for your microsite
              </p>
            </div>
          </div>

          {/* Branding */}
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center mr-3">
                <FiSliders className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Branding & Colors</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center bg-white border-2 border-gray-300 rounded-2xl overflow-hidden hover:bg-gray-50 transition-all duration-200">
                  <input
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="w-16 h-12 border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="flex-1 px-4 py-3 bg-transparent focus:outline-none font-medium text-gray-900"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center bg-white border-2 border-gray-300 rounded-2xl overflow-hidden hover:bg-gray-50 transition-all duration-200">
                  <input
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="w-16 h-12 border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="flex-1 px-4 py-3 bg-transparent focus:outline-none font-medium text-gray-900"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-red-700 rounded-xl flex items-center justify-center mr-3">
                <FiImage className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Media</h4>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Logo Image
              </label>
              <SimpleImageUpload
                value={formData.logo_url}
                onChange={(url) => handleInputChange('logo_url', url)}
                className="w-full"
              />
              <p className="mt-3 text-sm text-blue-800 font-medium">
                Upload your logo image (square format recommended)
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Banner Image
              </label>
              <SimpleImageUpload
                value={formData.banner_url}
                onChange={(url) => handleInputChange('banner_url', url)}
                className="w-full"
              />
              <p className="mt-3 text-sm text-purple-800 font-medium">
                Upload your banner image (3:1 aspect ratio recommended)
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-6 py-3 border-2 border-gray-300 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 transition-all duration-200"
              disabled={saving}
            >
              <FiX className="w-5 h-5 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-2xl hover:from-purple-700 hover:to-pink-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <FiSave className="w-5 h-5 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MicrositeEditModal