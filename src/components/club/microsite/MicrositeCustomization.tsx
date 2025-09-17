import React, { useState, useEffect } from 'react'
import { MicrositeCustomization as CustomizationData } from '../../../store/slices/clubMicrositeSlice'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import {
  FiSliders,
  FiImage,
  FiEye,
  FiRotateCcw,
  FiSave,
  FiEdit3,
  FiFileText,
  FiDroplet,
  FiRefreshCw
} from 'react-icons/fi'

interface MicrositeCustomizationProps {
  customization: CustomizationData | null
  onSaveCustomization: (data: {
    primary_color?: string
    secondary_color?: string
    description?: string
    banner_url?: string
  }) => Promise<void>
  loading: boolean
}

const MicrositeCustomization: React.FC<MicrositeCustomizationProps> = ({
  customization,
  onSaveCustomization,
  loading
}) => {
  const [formData, setFormData] = useState({
    primary_color: '#3B82F6',
    secondary_color: '#EFF6FF',
    description: '',
    banner_url: ''
  })
  
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (customization) {
      setFormData({
        primary_color: customization.primary_color || '#3B82F6',
        secondary_color: customization.secondary_color || '#EFF6FF',
        description: customization.description || '',
        banner_url: customization.banner_url || ''
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

  const handleBannerChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      banner_url: url
    }))
    setHasChanges(true)
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
    <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 text-white px-8 py-6 border-b-4 border-purple-800">
        <h2 className="text-2xl font-bold flex items-center">
          <FiSliders className="h-7 w-7 mr-3" />
          Microsite Customization
        </h2>
        <p className="text-purple-100 text-sm font-medium mt-1">Customize the look and feel of your public microsite</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Color Customization */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FiDroplet className="h-6 w-6 mr-3 text-blue-600" />
            Color Scheme
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="primary_color" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiSliders className="h-4 w-4 mr-2" />
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  id="primary_color"
                  name="primary_color"
                  value={formData.primary_color}
                  onChange={handleInputChange}
                  className="h-12 w-24 rounded-2xl border-2 border-gray-300 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
                />
                <input
                  type="text"
                  value={formData.primary_color}
                  onChange={handleInputChange}
                  name="primary_color"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-2xl font-mono font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                  placeholder="#3B82F6"
                />
              </div>
              <p className="text-xs text-gray-600 font-medium mt-2">Used for headers, buttons, and accents</p>
            </div>

            <div>
              <label htmlFor="secondary_color" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiDroplet className="h-4 w-4 mr-2" />
                Secondary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  id="secondary_color"
                  name="secondary_color"
                  value={formData.secondary_color}
                  onChange={handleInputChange}
                  className="h-12 w-24 rounded-2xl border-2 border-gray-300 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
                />
                <input
                  type="text"
                  value={formData.secondary_color}
                  onChange={handleInputChange}
                  name="secondary_color"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-2xl font-mono font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                  placeholder="#EFF6FF"
                />
              </div>
              <p className="text-xs text-gray-600 font-medium mt-2">Used for backgrounds and highlights</p>
            </div>
          </div>
        </div>

        {/* Color Preview */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FiEye className="h-6 w-6 mr-3 text-green-600" />
            Color Preview
          </h3>
          <div className="space-y-4">
            <div
              className="h-16 rounded-2xl flex items-center px-6 text-white font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              style={{ backgroundColor: formData.primary_color }}
            >
              Primary Color Preview
            </div>
            <div
              className="h-16 rounded-2xl flex items-center px-6 border-2 font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
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
            className="mt-6 px-4 py-2 bg-white border-2 border-green-300 rounded-2xl text-green-700 font-bold hover:bg-green-50 transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Reset to Default Colors
          </button>
        </div>

        {/* Description */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FiFileText className="h-6 w-6 mr-3 text-yellow-600" />
            Club Description
          </h3>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            maxLength={500}
            className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 hover:border-gray-400 resize-none"
            placeholder="Tell visitors about your club, facilities, and what makes you special..."
          />
          <div className="flex justify-between items-center mt-3">
            <p className="text-xs text-gray-600 font-medium">
              This description will appear on your public microsite
            </p>
            <span className={`text-xs font-bold ${formData.description.length > 450 ? 'text-red-600' : 'text-gray-500'}`}>
              {formData.description.length}/500 characters
            </span>
          </div>
        </div>

        {/* Banner Image Upload */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FiImage className="h-6 w-6 mr-3 text-indigo-600" />
            Banner Image
          </h3>
          <SimpleImageUpload
            fieldName="banner_url"
            fileType="image"
            value={formData.banner_url}
            onChange={handleBannerChange}
            title="Upload Banner Image"
          />
          <p className="text-xs text-gray-600 font-medium mt-3 bg-white border border-indigo-200 rounded-xl p-3">
            💡 <span className="font-bold">Tip:</span> Recommended size: 1200x400px for best display quality.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-8 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={() => {
              if (customization) {
                setFormData({
                  primary_color: customization.primary_color || '#3B82F6',
                  secondary_color: customization.secondary_color || '#EFF6FF',
                  description: customization.description || '',
                  banner_url: customization.banner_url || ''
                })
                setHasChanges(false)
              }
            }}
            disabled={loading || !hasChanges}
            className="px-6 py-3 border-2 border-gray-300 rounded-2xl text-gray-700 font-bold bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md flex items-center"
          >
            <FiRotateCcw className="w-4 h-4 mr-2" />
            Reset Changes
          </button>
          <button
            type="submit"
            disabled={loading || !hasChanges}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 border border-transparent rounded-2xl text-white font-bold hover:from-purple-700 hover:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105 flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4 mr-2" />
                Save Customization
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MicrositeCustomization