import React, { useState, useEffect } from 'react'

interface Court {
  id: number
  name: string
  owner_type: string
  owner_id: number
  address: string
  state_id: number
  court_count: number
  surface_type: string
  indoor: boolean
  lights: boolean
  amenities: string
  description: string
  status: 'active' | 'maintenance' | 'inactive'
  created_at: string
  updated_at: string
}

interface CourtFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (courtData: any) => void
  court: Court | null
  loading: boolean
}

const CourtFormModal: React.FC<CourtFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  court,
  loading
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    court_count: 1,
    surface_type: 'Hard Court',
    indoor: false,
    lights: false,
    amenities: '',
    description: ''
  })

  useEffect(() => {
    if (court) {
      setFormData({
        name: court.name,
        address: court.address,
        court_count: court.court_count,
        surface_type: court.surface_type,
        indoor: court.indoor,
        lights: court.lights,
        amenities: court.amenities || '',
        description: court.description || ''
      })
    } else {
      setFormData({
        name: '',
        address: '',
        court_count: 1,
        surface_type: 'Hard Court',
        indoor: false,
        lights: false,
        amenities: '',
        description: ''
      })
    }
  }, [court, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
              : type === 'number' ? Number(value)
              : value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {court ? 'Edit Court' : 'Add New Court'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Court Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Court 1, Main Court"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Courts
              </label>
              <input
                type="number"
                name="court_count"
                value={formData.court_count}
                onChange={handleChange}
                min="1"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address of the court location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Surface Type
            </label>
            <select
              name="surface_type"
              value={formData.surface_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Hard Court">Hard Court</option>
              <option value="Clay">Clay</option>
              <option value="Grass">Grass</option>
              <option value="Synthetic">Synthetic</option>
              <option value="Concrete">Concrete</option>
              <option value="Asphalt">Asphalt</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="indoor"
                checked={formData.indoor}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Indoor Court
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="lights"
                checked={formData.lights}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Has Lights
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="e.g., Parking, Restrooms, Water Fountain, Pro Shop"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple amenities with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Additional information about the court"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Saving...' : court ? 'Update Court' : 'Add Court'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CourtFormModal