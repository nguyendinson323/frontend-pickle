import React, { useState, useEffect } from 'react'
import { Court } from '../../../store/slices/partnerManagementSlice'

interface CourtModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (courtData: Partial<Court>) => Promise<any>
  court: Court | null
  loading: boolean
}

const CourtModal: React.FC<CourtModalProps> = ({
  isOpen,
  onClose,
  onSave,
  court,
  loading
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    court_count: 1,
    surface_type: 'hard' as string,
    indoor: false,
    lights: false,
    description: '',
    status: 'active' as 'active' | 'maintenance' | 'inactive',
    amenities: [] as string[]
  })
  const [error, setError] = useState('')
  const [newAmenity, setNewAmenity] = useState('')

  useEffect(() => {
    if (court) {
      setFormData({
        name: court.name,
        address: court.address || '',
        court_count: court.court_count,
        surface_type: court.surface_type || 'hard',
        indoor: court.indoor,
        lights: court.lights,
        description: court.description || '',
        status: court.status,
        amenities: court.amenities || []
      })
    } else {
      setFormData({
        name: '',
        address: '',
        court_count: 1,
        surface_type: 'hard',
        indoor: false,
        lights: false,
        description: '',
        status: 'active',
        amenities: []
      })
    }
    setError('')
  }, [court, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim() || !formData.address.trim()) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.court_count < 1) {
      setError('Number of courts must be at least 1')
      return
    }

    if (formData.hourly_rate < 0) {
      setError('Hourly rate cannot be negative')
      return
    }

    try {
      await onSave(formData)
    } catch (error) {
      setError('Failed to save court. Please try again.')
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // const handleOperatingHoursChange = (index: number, field: string, value: any) => {
  //   const updatedHours = [...formData.operating_hours]
  //   updatedHours[index] = { ...updatedHours[index], [field]: value }
  //   setFormData(prev => ({ ...prev, operating_hours: updatedHours }))
  // }

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }))
      setNewAmenity('')
    }
  }

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-lg font-bold text-gray-900">
            {court ? 'Edit Court' : 'Add New Court'}
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Court Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Downtown Tennis Center"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  >
                    <option value="active">Active</option>
                    <option value="maintenance">Under Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Street address"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.zip_code}
                    onChange={(e) => handleInputChange('zip_code', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Court Details */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Court Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Courts
                  </label>
                  <input
                    type="number"
                    value={formData.court_count}
                    onChange={(e) => handleInputChange('court_count', parseInt(e.target.value))}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surface Type
                  </label>
                  <select
                    value={formData.surface_type}
                    onChange={(e) => handleInputChange('surface_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  >
                    <option value="hard">Hard Court</option>
                    <option value="clay">Clay Court</option>
                    <option value="grass">Grass Court</option>
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.indoor}
                      onChange={(e) => handleInputChange('indoor', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-gray-700">Indoor</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.lights}
                      onChange={(e) => handleInputChange('lights', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-gray-700">Lights</span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Optional description of the court facilities"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Amenities</h4>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add amenity (e.g., Parking, Restrooms, Pro Shop)"
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={loading}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8 pt-6 border-t gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {court ? 'Update Court' : 'Add Court'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CourtModal