import React, { useState, useEffect } from 'react'
import {
  FiMapPin,
  FiX,
  FiHome,
  FiZap,
  FiSun,
  FiInfo,
  FiEdit3,
  FiPlus,
  FiSave,
  FiLoader
} from 'react-icons/fi'

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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                {court ? <FiEdit3 className="h-6 w-6" /> : <FiPlus className="h-6 w-6" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {court ? 'Edit Court Information' : 'Add New Court'}
                </h2>
                <p className="text-blue-100 font-medium">
                  {court ? 'Update your court details and settings' : 'Configure your new court facility'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
              disabled={loading}
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiMapPin className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                  <FiEdit3 className="h-4 w-4 mr-2" />
                  Court Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Court 1, Main Court"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                  <FiHome className="h-4 w-4 mr-2" />
                  Number of Courts
                </label>
                <input
                  type="number"
                  name="court_count"
                  value={formData.court_count}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-100 rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiMapPin className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Location Details</h3>
            </div>
            <div>
              <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                <FiMapPin className="h-4 w-4 mr-2" />
                Court Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address of the court location"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 font-medium"
                required
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiSun className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Surface & Features</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                  <FiSun className="h-4 w-4 mr-2" />
                  Surface Type
                </label>
                <select
                  name="surface_type"
                  value={formData.surface_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 font-medium"
                >
                  <option value="Hard Court">Hard Court</option>
                  <option value="Clay">Clay</option>
                  <option value="Grass">Grass</option>
                  <option value="Synthetic">Synthetic</option>
                  <option value="Concrete">Concrete</option>
                  <option value="Asphalt">Asphalt</option>
                  <option value="Cushioned">Cushioned</option>
                  <option value="Acrylic">Acrylic</option>
                  <option value="Artificial Turf">Artificial Turf</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all duration-200">
                  <input
                    type="checkbox"
                    name="indoor"
                    checked={formData.indoor}
                    onChange={handleChange}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded-lg"
                  />
                  <label className="ml-3 flex items-center text-sm font-bold text-gray-700">
                    <FiHome className="h-4 w-4 mr-2" />
                    Indoor Court
                  </label>
                </div>

                <div className="flex items-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all duration-200">
                  <input
                    type="checkbox"
                    name="lights"
                    checked={formData.lights}
                    onChange={handleChange}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded-lg"
                  />
                  <label className="ml-3 flex items-center text-sm font-bold text-gray-700">
                    <FiZap className="h-4 w-4 mr-2" />
                    Has Lights
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-2xl p-6 border-2 border-yellow-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiInfo className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Additional Information</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                  <FiHome className="h-4 w-4 mr-2" />
                  Amenities
                </label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="e.g., Parking, Restrooms, Water Fountain, Pro Shop"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 font-medium"
                />
                <p className="text-xs font-medium text-yellow-700 mt-2 bg-yellow-100 rounded-lg px-3 py-1">Separate multiple amenities with commas</p>
              </div>

              <div>
                <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                  <FiInfo className="h-4 w-4 mr-2" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Additional information about the court facility, special features, or important notes"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none transition-all duration-200 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-6 bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t-2 border-gray-200 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center px-6 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <FiX className="h-5 w-5 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin h-5 w-5 mr-2" />
                  Saving...
                </>
              ) : court ? (
                <>
                  <FiSave className="h-5 w-5 mr-2" />
                  Update Court
                </>
              ) : (
                <>
                  <FiPlus className="h-5 w-5 mr-2" />
                  Add Court
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CourtFormModal