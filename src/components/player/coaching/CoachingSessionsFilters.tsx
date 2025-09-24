import React from 'react'
import { useDispatch } from 'react-redux'
import { setFilters, SessionFilters } from '../../../store/slices/coachingSessionsSlice'
import { AppDispatch } from '../../../store'
import {
  FiFilter,
  FiUsers,
  FiMonitor,
  FiDollarSign,
  FiCalendar,
  FiSearch
} from 'react-icons/fi'

interface CoachingSessionsFiltersProps {
  filters: SessionFilters
  onSearch: () => void
  isLoading: boolean
}

const CoachingSessionsFilters: React.FC<CoachingSessionsFiltersProps> = ({
  filters,
  onSearch,
  isLoading
}) => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-8 mb-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl flex items-center justify-center mr-4">
          <FiFilter className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Search Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Session Type */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center mb-4">
            <FiUsers className="w-5 h-5 text-blue-600 mr-2" />
            <label className="block text-sm font-bold text-blue-800">
              Session Type
            </label>
          </div>
          <select
            value={filters.session_type || ''}
            onChange={(e) => dispatch(setFilters({ session_type: e.target.value || null }))}
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium bg-white"
          >
            <option value="">Any Type</option>
            <option value="individual">👤 Individual</option>
            <option value="group">👥 Group</option>
            <option value="clinic">🏫 Clinic</option>
          </select>
        </div>

        {/* Session Format */}
        <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center mb-4">
            <FiMonitor className="w-5 h-5 text-green-600 mr-2" />
            <label className="block text-sm font-bold text-green-800">
              Session Format
            </label>
          </div>
          <select
            value={filters.session_format || ''}
            onChange={(e) => dispatch(setFilters({ session_format: e.target.value || null }))}
            className="w-full px-4 py-3 border-2 border-green-300 rounded-2xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-white"
          >
            <option value="">Any Format</option>
            <option value="in_person">📍 In Person</option>
            <option value="virtual">💻 Virtual</option>
          </select>
        </div>

        {/* Min Price */}
        <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-center mb-4">
            <FiDollarSign className="w-5 h-5 text-yellow-600 mr-2" />
            <label className="block text-sm font-bold text-yellow-800">
              Min Price ($)
            </label>
          </div>
          <input
            type="number"
            value={filters.price_range.min || ''}
            onChange={(e) => dispatch(setFilters({
              price_range: { ...filters.price_range, min: e.target.value ? parseInt(e.target.value) : null }
            }))}
            placeholder="0"
            className="w-full px-4 py-3 border-2 border-yellow-300 rounded-2xl text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-medium bg-white"
          />
        </div>

        {/* Max Price */}
        <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
          <div className="flex items-center mb-4">
            <FiDollarSign className="w-5 h-5 text-red-600 mr-2" />
            <label className="block text-sm font-bold text-red-800">
              Max Price ($)
            </label>
          </div>
          <input
            type="number"
            value={filters.price_range.max || ''}
            onChange={(e) => dispatch(setFilters({
              price_range: { ...filters.price_range, max: e.target.value ? parseInt(e.target.value) : null }
            }))}
            placeholder="200"
            className="w-full px-4 py-3 border-2 border-red-300 rounded-2xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium bg-white"
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200">
          <div className="flex items-center mb-4">
            <FiCalendar className="w-5 h-5 text-indigo-600 mr-2" />
            <label className="block text-sm font-bold text-indigo-800">
              Start Date
            </label>
          </div>
          <input
            type="date"
            value={filters.date_range.start || ''}
            onChange={(e) => dispatch(setFilters({
              date_range: { ...filters.date_range, start: e.target.value || null }
            }))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border-2 border-indigo-300 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium bg-white"
          />
        </div>

        <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center mb-4">
            <FiCalendar className="w-5 h-5 text-purple-600 mr-2" />
            <label className="block text-sm font-bold text-purple-800">
              End Date
            </label>
          </div>
          <input
            type="date"
            value={filters.date_range.end || ''}
            onChange={(e) => dispatch(setFilters({
              date_range: { ...filters.date_range, end: e.target.value || null }
            }))}
            min={filters.date_range.start || new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border-2 border-purple-300 rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium bg-white"
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={onSearch}
          disabled={isLoading}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
        >
          <FiSearch className="w-5 h-5 mr-3" />
          {isLoading ? 'Searching...' : 'Search Sessions'}
        </button>
      </div>
    </div>
  )
}

export default CoachingSessionsFilters