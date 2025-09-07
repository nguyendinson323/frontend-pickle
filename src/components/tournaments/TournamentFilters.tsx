import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

const TournamentFilters: React.FC = () => {
  const { data: appData } = useSelector((state: RootState) => state.appData)
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    status: '',
    organizer_type: '',
    is_ranking: ''
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      state: '',
      status: '',
      organizer_type: '',
      is_ranking: ''
    })
  }

  const states = appData?.states || []

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="xl:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Tournament name or venue..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <select
            id="state"
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state.id} value={state.id.toString()}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Organizer Type */}
        <div>
          <label htmlFor="organizer_type" className="block text-sm font-medium text-gray-700 mb-2">
            Organizer
          </label>
          <select
            id="organizer_type"
            value={filters.organizer_type}
            onChange={(e) => handleFilterChange('organizer_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Organizers</option>
            <option value="federation">Federation</option>
            <option value="state">State</option>
            <option value="club">Club</option>
            <option value="partner">Partner</option>
          </select>
        </div>

        {/* Ranking Tournament */}
        <div>
          <label htmlFor="is_ranking" className="block text-sm font-medium text-gray-700 mb-2">
            Tournament Type
          </label>
          <select
            id="is_ranking"
            value={filters.is_ranking}
            onChange={(e) => handleFilterChange('is_ranking', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="true">Ranking</option>
            <option value="false">Non-Ranking</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          {Object.values(filters).some(filter => filter !== '') && (
            <span>Filters applied</span>
          )}
        </div>
        <div className="space-x-3">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Clear All
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default TournamentFilters