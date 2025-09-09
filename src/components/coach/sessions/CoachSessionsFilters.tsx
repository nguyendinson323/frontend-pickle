import React from 'react'

interface CoachSessionsFiltersProps {
  filters: {
    status: string
    date_from: string
    date_to: string
    player_search: string
  }
  onFiltersChange: (filters: Partial<{
    status: string
    date_from: string
    date_to: string
    player_search: string
  }>) => void
  onClearFilters: () => void
}

const CoachSessionsFilters: React.FC<CoachSessionsFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const hasActiveFilters = filters.status !== 'all' || 
                          filters.date_from || 
                          filters.date_to || 
                          filters.player_search

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => onFiltersChange({ status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        {/* Date From Filter */}
        <div>
          <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 mb-2">
            From Date
          </label>
          <input
            type="date"
            id="date_from"
            value={filters.date_from}
            onChange={(e) => onFiltersChange({ date_from: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Date To Filter */}
        <div>
          <label htmlFor="date_to" className="block text-sm font-medium text-gray-700 mb-2">
            To Date
          </label>
          <input
            type="date"
            id="date_to"
            value={filters.date_to}
            onChange={(e) => onFiltersChange({ date_to: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Player Search Filter */}
        <div>
          <label htmlFor="player_search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Student
          </label>
          <input
            type="text"
            id="player_search"
            placeholder="Search by student name..."
            value={filters.player_search}
            onChange={(e) => onFiltersChange({ player_search: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  )
}

export default CoachSessionsFilters