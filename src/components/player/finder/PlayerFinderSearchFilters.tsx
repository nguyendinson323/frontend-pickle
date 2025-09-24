import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PlayerFinderFilters } from '../../../store/slices/playerFinderSlice'
import {
  FiSearch,
  FiMapPin,
  FiUsers,
  FiStar,
  FiCalendar
} from 'react-icons/fi'

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
      <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-3xl border-2 border-gray-100">
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
              <FiSearch className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Search Filters</h3>
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* State Filter */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <FiMapPin className="w-5 h-5 text-blue-600 mr-3" />
                <label className="block text-sm font-bold text-blue-800">State</label>
              </div>
              <select
                value={filters.state_id || ''}
                onChange={(e) => onFilterChange('state_id', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium bg-white"
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
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
              <div className="flex items-center mb-3">
                <FiUsers className="w-5 h-5 text-purple-600 mr-3" />
                <label className="block text-sm font-bold text-purple-800">Gender</label>
              </div>
              <select
                value={filters.gender || ''}
                onChange={(e) => onFilterChange('gender', e.target.value || null)}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium bg-white"
              >
                <option value="">Any Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Distance filtering not available - players don't have stored location coordinates */}

            {/* NRTP Level Min */}
            <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
              <div className="flex items-center mb-3">
                <FiStar className="w-5 h-5 text-green-600 mr-3" />
                <label className="block text-sm font-bold text-green-800">Min NRTP Level</label>
              </div>
              <select
                value={filters.nrtp_level_min || ''}
                onChange={(e) => onFilterChange('nrtp_level_min', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-white"
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
            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
              <div className="flex items-center mb-3">
                <FiStar className="w-5 h-5 text-orange-600 mr-3" />
                <label className="block text-sm font-bold text-orange-800">Max NRTP Level</label>
              </div>
              <select
                value={filters.nrtp_level_max || ''}
                onChange={(e) => onFilterChange('nrtp_level_max', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium bg-white"
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
            <div className="bg-pink-50 rounded-2xl p-4 border border-pink-200">
              <div className="flex items-center mb-3">
                <FiCalendar className="w-5 h-5 text-pink-600 mr-3" />
                <label className="block text-sm font-bold text-pink-800">Min Age</label>
              </div>
              <select
                value={filters.age_min || ''}
                onChange={(e) => onFilterChange('age_min', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-medium bg-white"
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
          
          <div className="flex justify-center mt-8">
            <button
              onClick={onSearch}
              className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-2xl shadow-xl py-4 px-8 text-base font-bold text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:transform hover:scale-105"
            >
              <FiSearch className="w-5 h-5 mr-3" />
              Search Players
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerFinderSearchFilters