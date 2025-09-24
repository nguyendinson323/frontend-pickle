import React from 'react'
import { Court } from '../../../store/slices/partnerManagementSlice'
import {
  FiSearch,
  FiMapPin,
  FiHome,
  FiSun,
  FiEdit2,
  FiTrash2,
  FiLoader,
  FiInfo
} from 'react-icons/fi'

interface CourtsListProps {
  courts: Court[]
  filter: {
    status: string
    searchTerm: string
  }
  onFilterChange: (filter: Partial<{ status: string; searchTerm: string }>) => void
  onEditCourt: (court: Court) => void
  onDeleteCourt: (courtId: number) => void
  loading: boolean
}

const CourtsList: React.FC<CourtsListProps> = ({
  courts,
  filter,
  onFilterChange,
  onEditCourt,
  onDeleteCourt,
  loading
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
      maintenance: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300',
      inactive: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
    }
    return colors[status as keyof typeof colors] || colors.active
  }

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredCourts = courts.filter(court => {
    if (filter.status && court.status !== filter.status) return false
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase()
      return (
        court.name.toLowerCase().includes(searchLower) ||
        court.address.toLowerCase().includes(searchLower) ||
        (court.description && court.description.toLowerCase().includes(searchLower))
      )
    }
    return true
  })

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="text-white">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-3">
                <FiHome className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold">Courts Management</h2>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courts..."
                value={filter.searchTerm}
                onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
                className="pl-10 pr-4 py-3 border-2 border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
              />
            </div>

            <select
              value={filter.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="px-4 py-3 border-2 border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <FiLoader className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Courts...</h3>
            <p className="text-gray-600 font-medium">Please wait while we fetch your courts</p>
          </div>
        ) : filteredCourts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiHome className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No Courts Found</h3>
            <p className="text-gray-600 font-medium">
              {filter.status || filter.searchTerm
                ? 'No courts match your current filters'
                : 'Start by adding your first court'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourts.map((court) => (
              <div key={court.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{court.name}</h3>
                  <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(court.status)}`}>
                    {court.status}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start text-sm text-gray-700">
                    <FiMapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-red-500" />
                    <span className="font-medium">{court.address}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center mb-1">
                        <FiHome className="w-4 h-4 text-blue-600 mr-1" />
                        <span className="font-bold text-gray-600">Courts</span>
                      </div>
                      <span className="text-gray-900 font-bold text-lg">{court.court_count}</span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center mb-1">
                        <FiInfo className="w-4 h-4 text-green-600 mr-1" />
                        <span className="font-bold text-gray-600">Surface</span>
                      </div>
                      <span className="text-gray-900 font-bold capitalize">{court.surface_type}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm">
                    {court.indoor && (
                      <span className="inline-flex items-center px-3 py-1 text-xs font-bold text-green-700 bg-gradient-to-r from-green-100 to-green-200 border border-green-300 rounded-full">
                        <FiHome className="w-3 h-3 mr-1" />
                        Indoor
                      </span>
                    )}
                    {court.lights && (
                      <span className="inline-flex items-center px-3 py-1 text-xs font-bold text-yellow-700 bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300 rounded-full">
                        <FiSun className="w-3 h-3 mr-1" />
                        Lights
                      </span>
                    )}
                  </div>

                  {court.description && (
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-sm text-blue-800 font-medium line-clamp-2">{court.description}</p>
                    </div>
                  )}

                  {court.amenities && court.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {court.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300 rounded-full">
                          {amenity}
                        </span>
                      ))}
                      {court.amenities.length > 3 && (
                        <span className="inline-flex px-2 py-1 text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border border-gray-300 rounded-full">
                          +{court.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => onEditCourt(court)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-bold text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 rounded-2xl hover:from-blue-200 hover:to-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <FiEdit2 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteCourt(court.id)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-bold text-red-700 bg-gradient-to-r from-red-100 to-red-200 border border-red-300 rounded-2xl hover:from-red-200 hover:to-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <FiTrash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CourtsList