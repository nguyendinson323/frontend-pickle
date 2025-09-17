import React, { useState, useEffect } from 'react'
import { ClubMicrositeData } from '../../../store/slices/clubMicrositeSlice'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import {
  FiEdit3,
  FiUser,
  FiBriefcase,
  FiGlobe,
  FiShare2,
  FiImage,
  FiSave,
  FiRotateCcw,
  FiMapPin,
  FiUsers,
  FiAward,
  FiBarChart2,
  FiInfo
} from 'react-icons/fi'

interface MicrositeEditorProps {
  micrositeData: ClubMicrositeData | null
  onSave: (data: {
    name?: string
    manager_name?: string
    manager_title?: string
    club_type?: string
    website?: string
    social_media?: string
    logo_url?: string
  }) => Promise<void>
  loading: boolean
}

const MicrositeEditor: React.FC<MicrositeEditorProps> = ({
  micrositeData,
  onSave,
  loading
}) => {
  const [formData, setFormData] = useState({
    name: '',
    manager_name: '',
    manager_title: '',
    club_type: '',
    website: '',
    social_media: '',
    logo_url: ''
  })
  
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (micrositeData) {
      const newFormData = {
        name: micrositeData.name || '',
        manager_name: micrositeData.manager_name || '',
        manager_title: micrositeData.manager_title || '',
        club_type: micrositeData.club_type || '',
        website: micrositeData.website || '',
        social_media: micrositeData.social_media || '',
        logo_url: micrositeData.logo_url || ''
      }
      setFormData(newFormData)
      setHasChanges(false)
    }
  }, [micrositeData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      await onSave(formData)
      setHasChanges(false)
    } catch (error) {
      console.error('Error saving microsite data:', error)
    }
  }

  const handleLogoChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      logo_url: url
    }))
    setHasChanges(true)
  }

  const validateUrl = (url: string) => {
    if (!url) return true
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-6 border-b-4 border-blue-800">
        <h2 className="text-2xl font-bold flex items-center">
          <FiEdit3 className="h-7 w-7 mr-3" />
          Edit Club Information
        </h2>
        <p className="text-blue-100 text-sm font-medium mt-1">Update your club's public profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Basic Information */}
        <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FiInfo className="h-6 w-6 mr-3 text-blue-600" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiUser className="h-4 w-4 mr-2" />
                Club Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                placeholder="Enter your club name"
              />
            </div>

            <div>
              <label htmlFor="club_type" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiBriefcase className="h-4 w-4 mr-2" />
                Club Type
              </label>
              <select
                id="club_type"
                name="club_type"
                value={formData.club_type}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
              >
                <option value="">Select club type</option>
                <option value="Recreation Center">Recreation Center</option>
                <option value="Country Club">Country Club</option>
                <option value="Sports Club">Sports Club</option>
                <option value="Community Club">Community Club</option>
                <option value="Tennis Club">Tennis Club</option>
                <option value="Private Club">Private Club</option>
                <option value="Public Facility">Public Facility</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Management Information */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FiUser className="h-6 w-6 mr-3 text-green-600" />
            Management Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="manager_name" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiUser className="h-4 w-4 mr-2" />
                Manager/Contact Name
              </label>
              <input
                type="text"
                id="manager_name"
                name="manager_name"
                value={formData.manager_name}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
                placeholder="Enter manager name"
              />
            </div>

            <div>
              <label htmlFor="manager_title" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiBriefcase className="h-4 w-4 mr-2" />
                Manager Title
              </label>
              <input
                type="text"
                id="manager_title"
                name="manager_title"
                value={formData.manager_title}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
                placeholder="e.g., Club Manager, Director, Owner"
              />
            </div>
          </div>
        </div>

        {/* Online Presence */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FiGlobe className="h-6 w-6 mr-3 text-purple-600" />
            Online Presence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="website" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiGlobe className="h-4 w-4 mr-2" />
                Website URL
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-400"
                placeholder="https://yourclub.com"
              />
              {formData.website && !validateUrl(formData.website) && (
                <p className="mt-2 text-sm text-red-600 font-medium">Please enter a valid URL</p>
              )}
            </div>

            <div>
              <label htmlFor="social_media" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                <FiShare2 className="h-4 w-4 mr-2" />
                Social Media Link
              </label>
              <input
                type="url"
                id="social_media"
                name="social_media"
                value={formData.social_media}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-400"
                placeholder="https://facebook.com/yourclub"
              />
              {formData.social_media && !validateUrl(formData.social_media) && (
                <p className="mt-2 text-sm text-red-600 font-medium">Please enter a valid URL</p>
              )}
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FiImage className="h-6 w-6 mr-3 text-indigo-600" />
            Club Logo
          </h3>
          <SimpleImageUpload
            fieldName="logo_url"
            fileType="image"
            value={formData.logo_url}
            onChange={handleLogoChange}
            title="Upload Club Logo"
          />
        </div>

        {/* Club Statistics Display */}
        {micrositeData && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiBarChart2 className="h-6 w-6 mr-3 text-yellow-600" />
              Club Statistics (Auto-generated)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border border-blue-200 rounded-2xl p-4 flex items-center">
                <FiMapPin className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <span className="text-sm text-gray-600 font-medium">Courts</span>
                  <div className="text-xl font-bold text-blue-600">{micrositeData.courts_count || 0}</div>
                </div>
              </div>
              <div className="bg-white border border-green-200 rounded-2xl p-4 flex items-center">
                <FiUsers className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <span className="text-sm text-gray-600 font-medium">Members</span>
                  <div className="text-xl font-bold text-green-600">{micrositeData.members_count || 0}</div>
                </div>
              </div>
              <div className="bg-white border border-purple-200 rounded-2xl p-4 flex items-center">
                <FiAward className="h-5 w-5 text-purple-500 mr-3" />
                <div>
                  <span className="text-sm text-gray-600 font-medium">Tournaments</span>
                  <div className="text-xl font-bold text-purple-600">{micrositeData.tournaments_count || 0}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-8 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={() => {
              if (micrositeData) {
                const resetData = {
                  name: micrositeData.name || '',
                  manager_name: micrositeData.manager_name || '',
                  manager_title: micrositeData.manager_title || '',
                  club_type: micrositeData.club_type || '',
                  website: micrositeData.website || '',
                  social_media: micrositeData.social_media || '',
                  logo_url: micrositeData.logo_url || ''
                }
                setFormData(resetData)
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
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 border border-transparent rounded-2xl text-white font-bold hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105 flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MicrositeEditor