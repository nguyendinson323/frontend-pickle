import React, { useState, useEffect } from 'react'
import { MicrositeCustomization as CustomizationData } from '../../../store/slices/clubMicrositeSlice'

interface MicrositeCustomizationProps {
  customization: CustomizationData | null
  onSaveCustomization: (data: {
    primary_color?: string
    secondary_color?: string
    description?: string
  }) => Promise<void>
  onUploadBanner: (file: File) => Promise<void>
  loading: boolean
}

const MicrositeCustomization: React.FC<MicrositeCustomizationProps> = ({
  customization,
  onSaveCustomization,
  onUploadBanner,
  loading
}) => {
  const [formData, setFormData] = useState({
    primary_color: '#3B82F6',
    secondary_color: '#EFF6FF',
    description: ''
  })
  
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (customization) {
      setFormData({
        primary_color: customization.primary_color || '#3B82F6',
        secondary_color: customization.secondary_color || '#EFF6FF',
        description: customization.description || ''
      })
      setHasChanges(false)
    }
  }, [customization])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setHasChanges(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await onSaveCustomization(formData)
      setHasChanges(false)
    } catch (error) {
      console.error('Error saving customization:', error)
    }
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        await onUploadBanner(file)
      } catch (error) {
        console.error('Error uploading banner:', error)
      }
    }
  }

  const resetColors = () => {
    setFormData(prev => ({
      ...prev,
      primary_color: '#3B82F6',
      secondary_color: '#EFF6FF'
    }))
    setHasChanges(true)
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Microsite Customization</h2>
        <p className="text-sm text-gray-600">Customize the look and feel of your public microsite</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Color Customization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="primary_color" className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                id="primary_color"
                name="primary_color"
                value={formData.primary_color}
                onChange={handleInputChange}
                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={formData.primary_color}
                onChange={handleInputChange}
                name="primary_color"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                placeholder="#3B82F6"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Used for headers, buttons, and accents</p>
          </div>

          <div>
            <label htmlFor="secondary_color" className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                id="secondary_color"
                name="secondary_color"
                value={formData.secondary_color}
                onChange={handleInputChange}
                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={formData.secondary_color}
                onChange={handleInputChange}
                name="secondary_color"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                placeholder="#EFF6FF"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Used for backgrounds and highlights</p>
          </div>
        </div>

        {/* Color Preview */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Color Preview</h3>
          <div className="space-y-2">
            <div 
              className="h-12 rounded flex items-center px-4 text-white font-medium"
              style={{ backgroundColor: formData.primary_color }}
            >
              Primary Color Preview
            </div>
            <div 
              className="h-12 rounded flex items-center px-4 border"
              style={{ 
                backgroundColor: formData.secondary_color,
                color: formData.primary_color,
                borderColor: formData.primary_color
              }}
            >
              Secondary Color Preview
            </div>
          </div>
          <button
            type="button"
            onClick={resetColors}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
          >
            Reset to Default Colors
          </button>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Club Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell visitors about your club, facilities, and what makes you special..."
          />
          <p className="text-xs text-gray-500 mt-1">
            This description will appear on your public microsite. {formData.description.length}/500 characters
          </p>
        </div>

        {/* Banner Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Image
          </label>
          <div className="space-y-3">
            {customization?.banner_url && (
              <div className="relative">
                <img
                  src={customization.banner_url}
                  alt="Current banner"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  Current Banner
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="banner-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload a banner image</span>
                    <input
                      id="banner-upload"
                      name="banner-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB. Recommended size: 1200x400px</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              if (customization) {
                setFormData({
                  primary_color: customization.primary_color || '#3B82F6',
                  secondary_color: customization.secondary_color || '#EFF6FF',
                  description: customization.description || ''
                })
                setHasChanges(false)
              }
            }}
            disabled={loading || !hasChanges}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Changes
          </button>
          <button
            type="submit"
            disabled={loading || !hasChanges}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Customization'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MicrositeCustomization