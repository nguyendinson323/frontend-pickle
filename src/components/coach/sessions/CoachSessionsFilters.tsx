import React from 'react'
import {
  FiFilter,
  FiX,
  FiCalendar,
  FiSearch,
  FiCheckCircle
} from 'react-icons/fi'

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
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
            <FiFilter className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Filter Sessions</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Status Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
          <div className="flex items-center mb-3">
            <FiCheckCircle className="w-5 h-5 text-indigo-600 mr-2" />
            <label htmlFor="status" className="block text-sm font-bold text-gray-700">
              Status
            </label>
          </div>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => onFiltersChange({ status: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        {/* Date From Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
          <div className="flex items-center mb-3">
            <FiCalendar className="w-5 h-5 text-green-600 mr-2" />
            <label htmlFor="date_from" className="block text-sm font-bold text-gray-700">
              From Date
            </label>
          </div>
          <input
            type="date"
            id="date_from"
            value={filters.date_from}
            onChange={(e) => onFiltersChange({ date_from: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
          />
        </div>

        {/* Date To Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
          <div className="flex items-center mb-3">
            <FiCalendar className="w-5 h-5 text-orange-600 mr-2" />
            <label htmlFor="date_to" className="block text-sm font-bold text-gray-700">
              To Date
            </label>
          </div>
          <input
            type="date"
            id="date_to"
            value={filters.date_to}
            onChange={(e) => onFiltersChange({ date_to: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
          />
        </div>

        {/* Player Search Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
          <div className="flex items-center mb-3">
            <FiSearch className="w-5 h-5 text-blue-600 mr-2" />
            <label htmlFor="player_search" className="block text-sm font-bold text-gray-700">
              Search Student
            </label>
          </div>
          <input
            type="text"
            id="player_search"
            placeholder="Search by student name..."
            value={filters.player_search}
            onChange={(e) => onFiltersChange({ player_search: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200 placeholder-gray-500"
          />
        </div>
      </div>
    </div>
  )
}

export default CoachSessionsFilters