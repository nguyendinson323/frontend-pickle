import React from 'react'
import {
  FiFilter,
  FiX,
  FiSearch,
  FiSliders,
  FiMapPin,
  FiUsers
} from 'react-icons/fi'

interface Student {
  id: number
  full_name: string
  profile_photo_url: string | null
  nrtp_level: number
  email: string
  phone: string
  state_id: number
  state_name: string
  created_at: string
  sessions: {
    total_sessions: number
    completed_sessions: number
    upcoming_sessions: number
    last_session_date: string | null
    average_rating: number
    total_spent: number
  }
  progress: {
    initial_level: number
    current_level: number
    improvement: number
    sessions_to_improve: number
  }
}

interface StudentsFiltersProps {
  filters: {
    search: string
    level_min: string
    level_max: string
    state: string
    activity: string
  }
  students: Student[]
  onFiltersChange: (filters: Partial<{
    search: string
    level_min: string
    level_max: string
    state: string
    activity: string
  }>) => void
  onClearFilters: () => void
}

const StudentsFilters: React.FC<StudentsFiltersProps> = ({
  filters,
  students,
  onFiltersChange,
  onClearFilters
}) => {
  const hasActiveFilters = filters.search || 
                          filters.level_min || 
                          filters.level_max || 
                          filters.state || 
                          filters.activity !== 'all'

  // Get unique states for the filter dropdown
  const uniqueStates = Array.from(
    new Set(students.map(student => student.state_name).filter(state => state && state !== 'Unknown'))
  ).sort()

  // Generate level options
  const levelOptions = []
  for (let i = 1.0; i <= 5.0; i += 0.5) {
    levelOptions.push(i)
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
            <FiFilter className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Filter Students</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-2 px-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
          >
            <FiX className="w-4 h-4 mr-2" />
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Search Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
          <div className="flex items-center mb-3">
            <FiSearch className="w-5 h-5 text-blue-600 mr-2" />
            <label htmlFor="search" className="block text-sm font-bold text-gray-700">
              Search
            </label>
          </div>
          <input
            type="text"
            id="search"
            placeholder="Name or email..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200 placeholder-gray-500"
          />
        </div>

        {/* Min Level Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
          <div className="flex items-center mb-3">
            <FiSliders className="w-5 h-5 text-green-600 mr-2" />
            <label htmlFor="level_min" className="block text-sm font-bold text-gray-700">
              Min Level
            </label>
          </div>
          <select
            id="level_min"
            value={filters.level_min}
            onChange={(e) => onFiltersChange({ level_min: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
          >
            <option value="">Any</option>
            {levelOptions.map((level) => (
              <option key={level} value={level}>
                {level.toFixed(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Max Level Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
          <div className="flex items-center mb-3">
            <FiSliders className="w-5 h-5 text-orange-600 mr-2" />
            <label htmlFor="level_max" className="block text-sm font-bold text-gray-700">
              Max Level
            </label>
          </div>
          <select
            id="level_max"
            value={filters.level_max}
            onChange={(e) => onFiltersChange({ level_max: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
          >
            <option value="">Any</option>
            {levelOptions.map((level) => (
              <option key={level} value={level}>
                {level.toFixed(1)}
              </option>
            ))}
          </select>
        </div>

        {/* State Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
          <div className="flex items-center mb-3">
            <FiMapPin className="w-5 h-5 text-purple-600 mr-2" />
            <label htmlFor="state" className="block text-sm font-bold text-gray-700">
              State
            </label>
          </div>
          <select
            id="state"
            value={filters.state}
            onChange={(e) => onFiltersChange({ state: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
          >
            <option value="">All States</option>
            {uniqueStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Activity Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
          <div className="flex items-center mb-3">
            <FiUsers className="w-5 h-5 text-indigo-600 mr-2" />
            <label htmlFor="activity" className="block text-sm font-bold text-gray-700">
              Activity
            </label>
          </div>
          <select
            id="activity"
            value={filters.activity}
            onChange={(e) => onFiltersChange({ activity: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
          >
            <option value="all">All Students</option>
            <option value="active">Active (Has upcoming)</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default StudentsFilters