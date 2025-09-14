import React, { useState, useEffect } from 'react'
import { ClubMicrositeData } from '../../../store/slices/clubMicrositeSlice'
import CentralizedImageUpload from '../../common/CentralizedImageUpload'

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
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Edit Club Information</h2>
        <p className="text-sm text-gray-600">Update your club's public profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Club Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="club_type" className="block text-sm font-medium text-gray-700">
              Club Type
            </label>
            <select
              id="club_type"
              name="club_type"
              value={formData.club_type}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

        {/* Management Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="manager_name" className="block text-sm font-medium text-gray-700">
              Manager/Contact Name
            </label>
            <input
              type="text"
              id="manager_name"
              name="manager_name"
              value={formData.manager_name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="manager_title" className="block text-sm font-medium text-gray-700">
              Manager Title
            </label>
            <input
              type="text"
              id="manager_title"
              name="manager_title"
              value={formData.manager_title}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Club Manager, Director, Owner"
            />
          </div>
        </div>

        {/* Online Presence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website URL
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://yourclub.com"
            />
            {formData.website && !validateUrl(formData.website) && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid URL</p>
            )}
          </div>

          <div>
            <label htmlFor="social_media" className="block text-sm font-medium text-gray-700">
              Social Media Link
            </label>
            <input
              type="url"
              id="social_media"
              name="social_media"
              value={formData.social_media}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://facebook.com/yourclub"
            />
            {formData.social_media && !validateUrl(formData.social_media) && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid URL</p>
            )}
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Club Logo
          </label>
          <CentralizedImageUpload
            uploadType="club-logo"
            value={formData.logo_url}
            onChange={handleLogoChange}
            color="blue"
            title="Upload Club Logo"
          />
        </div>

        {/* Club Statistics Display */}
        {micrositeData && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Club Statistics (Auto-generated)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Courts:</span>
                <span className="font-medium ml-2">{micrositeData.courts_count || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">Members:</span>
                <span className="font-medium ml-2">{micrositeData.members_count || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">Tournaments:</span>
                <span className="font-medium ml-2">{micrositeData.tournaments_count || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Changes
          </button>
          <button
            type="submit"
            disabled={loading || !hasChanges}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MicrositeEditor