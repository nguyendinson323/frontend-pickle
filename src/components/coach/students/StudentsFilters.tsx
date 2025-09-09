import React from 'react'

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
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filter Students</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search Filter */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Name or email..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Min Level Filter */}
        <div>
          <label htmlFor="level_min" className="block text-sm font-medium text-gray-700 mb-2">
            Min Level
          </label>
          <select
            id="level_min"
            value={filters.level_min}
            onChange={(e) => onFiltersChange({ level_min: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
        <div>
          <label htmlFor="level_max" className="block text-sm font-medium text-gray-700 mb-2">
            Max Level
          </label>
          <select
            id="level_max"
            value={filters.level_max}
            onChange={(e) => onFiltersChange({ level_max: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <select
            id="state"
            value={filters.state}
            onChange={(e) => onFiltersChange({ state: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
        <div>
          <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-2">
            Activity
          </label>
          <select
            id="activity"
            value={filters.activity}
            onChange={(e) => onFiltersChange({ activity: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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