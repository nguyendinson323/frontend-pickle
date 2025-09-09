import React from 'react'
import { useDispatch } from 'react-redux'
import { setFilters } from '../../../store/slices/coachingSessionsSlice'
import { AppDispatch } from '../../../store'

interface CoachingSessionsFiltersProps {
  filters: any
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Search Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Session Type
          </label>
          <select
            value={filters.session_type || ''}
            onChange={(e) => dispatch(setFilters({ session_type: e.target.value || null }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Any</option>
            <option value="individual">Individual</option>
            <option value="group">Group</option>
            <option value="clinic">Clinic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Session Format
          </label>
          <select
            value={filters.session_format || ''}
            onChange={(e) => dispatch(setFilters({ session_format: e.target.value || null }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Any</option>
            <option value="in_person">In Person</option>
            <option value="virtual">Virtual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price ($)
          </label>
          <input
            type="number"
            value={filters.price_range.min || ''}
            onChange={(e) => dispatch(setFilters({ 
              price_range: { ...filters.price_range, min: e.target.value ? parseInt(e.target.value) : null }
            }))}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price ($)
          </label>
          <input
            type="number"
            value={filters.price_range.max || ''}
            onChange={(e) => dispatch(setFilters({ 
              price_range: { ...filters.price_range, max: e.target.value ? parseInt(e.target.value) : null }
            }))}
            placeholder="200"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={filters.date_range.start || ''}
            onChange={(e) => dispatch(setFilters({ 
              date_range: { ...filters.date_range, start: e.target.value || null }
            }))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={filters.date_range.end || ''}
            onChange={(e) => dispatch(setFilters({ 
              date_range: { ...filters.date_range, end: e.target.value || null }
            }))}
            min={filters.date_range.start || new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={onSearch}
          disabled={isLoading}
          className="inline-flex items-center px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search Sessions'}
        </button>
      </div>
    </div>
  )
}

export default CoachingSessionsFilters