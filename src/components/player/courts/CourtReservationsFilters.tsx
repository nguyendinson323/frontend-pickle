import React, { useEffect, useState } from 'react'
import { CourtFilters } from '../../../store/slices/courtReservationSlice'
import api from '../../../services/api'
import {
  FiFilter,
  FiMapPin,
  FiLayers,
  FiHome,
  FiSun,
  FiUsers,
  FiSearch,
  FiNavigation
} from 'react-icons/fi'

interface State {
  id: number
  name: string
  short_code: string
}

interface CourtReservationsFiltersProps {
  filters: CourtFilters
  userLocation: { lat: number; lng: number } | null
  onFilterChange: (key: keyof CourtFilters, value: string | number | boolean | null) => void
  onGetLocation: () => void
  onSearch: () => void
  isLoading: boolean
}

const CourtReservationsFilters: React.FC<CourtReservationsFiltersProps> = ({
  filters,
  userLocation,
  onFilterChange,
  onGetLocation,
  onSearch,
  isLoading
}) => {
  const [states, setStates] = useState<State[]>([])

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get<State[]>('/api/common/states')
        // Remove duplicates by creating a Map with unique names
        const uniqueStates = Array.from(
          new Map(response.data.map((state: State) => [state.name, state])).values()
        )
        setStates(uniqueStates.sort((a, b) => a.name.localeCompare(b.name)))
      } catch (error) {
        console.error('Failed to fetch states:', error)
      }
    }
    fetchStates()
  }, [])

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-8 mb-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-700 rounded-2xl flex items-center justify-center mr-4">
          <FiFilter className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Search Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* State Filter */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center mb-4">
            <FiMapPin className="w-5 h-5 text-blue-600 mr-2" />
            <label className="block text-sm font-bold text-blue-800">
              State
            </label>
          </div>
          <select
            value={filters.state_id || ''}
            onChange={(e) => onFilterChange('state_id', e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium bg-white"
          >
            <option value="">All States</option>
            {states.map(state => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* Surface Type Filter */}
        <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center mb-4">
            <FiLayers className="w-5 h-5 text-green-600 mr-2" />
            <label className="block text-sm font-bold text-green-800">
              Surface Type
            </label>
          </div>
          <select
            value={filters.surface_type || ''}
            onChange={(e) => onFilterChange('surface_type', e.target.value || null)}
            className="w-full px-4 py-3 border-2 border-green-300 rounded-2xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-white"
          >
            <option value="">Any Surface</option>
            <option value="hard">🏓 Hard Court</option>
            <option value="clay">🟤 Clay</option>
            <option value="grass">🌱 Grass</option>
            <option value="synthetic">⚡ Synthetic</option>
          </select>
        </div>

        {/* Court Type Filter */}
        <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center mb-4">
            <FiHome className="w-5 h-5 text-purple-600 mr-2" />
            <label className="block text-sm font-bold text-purple-800">
              Court Type
            </label>
          </div>
          <select
            value={filters.indoor === null ? '' : filters.indoor.toString()}
            onChange={(e) => onFilterChange('indoor', e.target.value === '' ? null : e.target.value === 'true')}
            className="w-full px-4 py-3 border-2 border-purple-300 rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium bg-white"
          >
            <option value="">Any Type</option>
            <option value="false">🌤️ Outdoor</option>
            <option value="true">🏢 Indoor</option>
          </select>
        </div>

        {/* Lights Filter */}
        <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-center mb-4">
            <FiSun className="w-5 h-5 text-yellow-600 mr-2" />
            <label className="block text-sm font-bold text-yellow-800">
              Lights Available
            </label>
          </div>
          <select
            value={filters.lights === null ? '' : filters.lights.toString()}
            onChange={(e) => onFilterChange('lights', e.target.value === '' ? null : e.target.value === 'true')}
            className="w-full px-4 py-3 border-2 border-yellow-300 rounded-2xl text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-medium bg-white"
          >
            <option value="">Any Lighting</option>
            <option value="false">🌙 No Lights</option>
            <option value="true">💡 Has Lights</option>
          </select>
        </div>

        {/* Owner Type Filter */}
        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200">
          <div className="flex items-center mb-4">
            <FiUsers className="w-5 h-5 text-indigo-600 mr-2" />
            <label className="block text-sm font-bold text-indigo-800">
              Owner Type
            </label>
          </div>
          <select
            value={filters.owner_type || ''}
            onChange={(e) => onFilterChange('owner_type', e.target.value || null)}
            className="w-full px-4 py-3 border-2 border-indigo-300 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium bg-white"
          >
            <option value="">Any Owner</option>
            <option value="club">🏛️ Clubs</option>
            <option value="partner">🤝 Partners</option>
          </select>
        </div>
      </div>

      {/* Distance Filter - Full width on smaller screens */}
      <div className="mt-8">
        <div className="bg-red-50 rounded-2xl p-6 border border-red-200 max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <FiNavigation className="w-5 h-5 text-red-600 mr-2" />
            <label className="block text-sm font-bold text-red-800">
              Max Distance {userLocation ? '' : '(Enable location first)'}
            </label>
          </div>
          <select
            value={filters.distance_km || 25}
            onChange={(e) => onFilterChange('distance_km', parseInt(e.target.value))}
            disabled={!userLocation}
            className="w-full px-4 py-3 border-2 border-red-300 rounded-2xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value={5}>📍 5 km radius</option>
            <option value={10}>📍 10 km radius</option>
            <option value={25}>📍 25 km radius</option>
            <option value={50}>📍 50 km radius</option>
            <option value={100}>📍 100 km radius</option>
          </select>
        </div>
      </div>

      {/* Location and Search Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-8">
        <div className="flex items-center space-x-4">
          {!userLocation && (
            <button
              onClick={onGetLocation}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold rounded-2xl hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
            >
              <FiNavigation className="w-5 h-5 mr-3" />
              Use My Location
            </button>
          )}

          {userLocation && (
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm font-bold rounded-2xl border-2 border-green-200 shadow-md">
              <FiNavigation className="w-5 h-5 mr-3 text-green-600" />
              Location Enabled
            </div>
          )}
        </div>

        <button
          onClick={onSearch}
          disabled={isLoading}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
              Searching...
            </>
          ) : (
            <>
              <FiSearch className="w-6 h-6 mr-3" />
              Search Courts
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default CourtReservationsFilters