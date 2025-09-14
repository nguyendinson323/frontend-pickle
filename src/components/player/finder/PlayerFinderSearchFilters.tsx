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
  onFilterChange,
  onSearch
}) => {
  const navigate = useNavigate()


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