import React, { useEffect, useState } from 'react'
import { CourtFilters } from '../../../store/slices/courtReservationSlice'
import api from '../../../services/api'

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Search Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <select
            value={filters.state_id || ''}
            onChange={(e) => onFilterChange('state_id', e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All States</option>
            {states.map(state => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Surface Type
          </label>
          <select
            value={filters.surface_type || ''}
            onChange={(e) => onFilterChange('surface_type', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Any</option>
            <option value="hard">Hard Court</option>
            <option value="clay">Clay</option>
            <option value="grass">Grass</option>
            <option value="synthetic">Synthetic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Court Type
          </label>
          <select
            value={filters.indoor === null ? '' : filters.indoor.toString()}
            onChange={(e) => onFilterChange('indoor', e.target.value === '' ? null : e.target.value === 'true')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Any</option>
            <option value="false">Outdoor</option>
            <option value="true">Indoor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lights Available
          </label>
          <select
            value={filters.lights === null ? '' : filters.lights.toString()}
            onChange={(e) => onFilterChange('lights', e.target.value === '' ? null : e.target.value === 'true')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Any</option>
            <option value="false">No Lights</option>
            <option value="true">Has Lights</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Owner Type
          </label>
          <select
            value={filters.owner_type || ''}
            onChange={(e) => onFilterChange('owner_type', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Any</option>
            <option value="club">Clubs</option>
            <option value="partner">Partners</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Distance {userLocation ? '' : '(Enable location first)'}
          </label>
          <select
            value={filters.distance_km || 25}
            onChange={(e) => onFilterChange('distance_km', parseInt(e.target.value))}
            disabled={!userLocation}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
            <option value={100}>100 km</option>
          </select>
        </div>
      </div>

      {/* Location and Search Buttons */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-4">
          {!userLocation && (
            <button
              onClick={onGetLocation}
              className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 text-sm font-medium rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              📍 Use My Location
            </button>
          )}
          
          {userLocation && (
            <span className="text-sm text-green-600 font-medium">
              📍 Location enabled
            </span>
          )}
        </div>

        <button
          onClick={onSearch}
          disabled={isLoading}
          className="inline-flex items-center px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search Courts'}
        </button>
      </div>
    </div>
  )
}

export default CourtReservationsFilters