import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PlayerFinderFilters } from '../../../store/slices/playerFinderSlice'

interface State {
  id: number
  name: string
}

interface PlayerFinderSearchFiltersProps {
  isPremium: boolean
  filters: PlayerFinderFilters
  statesList: State[]
  userLocation: { latitude: number; longitude: number } | null
  locationPermission: 'granted' | 'denied' | 'prompt' | null
  onFilterChange: (key: keyof PlayerFinderFilters, value: string | number | null) => void
  onSearch: () => void
  onLocationRequest: () => void
}

const PlayerFinderSearchFilters: React.FC<PlayerFinderSearchFiltersProps> = ({
  isPremium,
  filters,
  statesList,
  userLocation,
  locationPermission,
  onFilterChange,
  onSearch,
  onLocationRequest
}) => {
  const navigate = useNavigate()

  if (!isPremium) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Premium Feature Required
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Player Finder is a premium feature. Upgrade your account to find and connect with nearby players.</p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  onClick={() => navigate('/player/profile')}
                  className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                >
                  Upgrade Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Search Filters</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* State Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select
                value={filters.state_id || ''}
                onChange={(e) => onFilterChange('state_id', e.target.value ? parseInt(e.target.value) : null)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All States</option>
                {statesList.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                value={filters.gender || ''}
                onChange={(e) => onFilterChange('gender', e.target.value || null)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Any Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Distance filtering not available - players don't have stored location coordinates */}

            {/* NRTP Level Min */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Min NRTP Level</label>
              <select
                value={filters.nrtp_level_min || ''}
                onChange={(e) => onFilterChange('nrtp_level_min', e.target.value ? parseFloat(e.target.value) : null)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Any Level</option>
                <option value={1.0}>1.0+</option>
                <option value={1.5}>1.5+</option>
                <option value={2.0}>2.0+</option>
                <option value={2.5}>2.5+</option>
                <option value={3.0}>3.0+</option>
                <option value={3.5}>3.5+</option>
                <option value={4.0}>4.0+</option>
                <option value={4.5}>4.5+</option>
                <option value={5.0}>5.0</option>
              </select>
            </div>

            {/* NRTP Level Max */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Max NRTP Level</label>
              <select
                value={filters.nrtp_level_max || ''}
                onChange={(e) => onFilterChange('nrtp_level_max', e.target.value ? parseFloat(e.target.value) : null)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Any Level</option>
                <option value={1.5}>Up to 1.5</option>
                <option value={2.0}>Up to 2.0</option>
                <option value={2.5}>Up to 2.5</option>
                <option value={3.0}>Up to 3.0</option>
                <option value={3.5}>Up to 3.5</option>
                <option value={4.0}>Up to 4.0</option>
                <option value={4.5}>Up to 4.5</option>
                <option value={5.0}>Up to 5.0</option>
              </select>
            </div>

            {/* Age Min */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Age</label>
              <select
                value={filters.age_min || ''}
                onChange={(e) => onFilterChange('age_min', e.target.value ? parseInt(e.target.value) : null)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Any Age</option>
                <option value={18}>18+</option>
                <option value={25}>25+</option>
                <option value={35}>35+</option>
                <option value={45}>45+</option>
                <option value={55}>55+</option>
                <option value={65}>65+</option>
              </select>
            </div>

          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onSearch}
              className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Search Players
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerFinderSearchFilters