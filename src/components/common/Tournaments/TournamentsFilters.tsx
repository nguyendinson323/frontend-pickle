import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { fetchTournaments } from '../../../store/slices/tournamentsSlice'

interface TournamentsFiltersProps {
  onFiltersChange: (filters: TournamentFilters) => void
}

export interface TournamentFilters {
  status?: string
  tournament_type?: string
  state_id?: number
  organizer_type?: string
  search?: string
}

const TournamentsFilters: React.FC<TournamentsFiltersProps> = ({ onFiltersChange }) => {
  const dispatch = useDispatch()
  const { data: commonData } = useSelector((state: RootState) => state.common)
  
  const [filters, setFilters] = useState<TournamentFilters>({})
  const [searchTerm, setSearchTerm] = useState('')

  const states = commonData?.states || []

  const handleFilterChange = (key: keyof TournamentFilters, value: string | number | undefined) => {
    const newFilters = {
      ...filters,
      [key]: value === '' ? undefined : value
    }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    const newFilters = {
      ...filters,
      search: value === '' ? undefined : value
    }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {}
    setFilters(emptyFilters)
    setSearchTerm('')
    onFiltersChange(emptyFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '')

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter Tournaments</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Tournament name..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        {/* Tournament Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tournament Type
          </label>
          <select
            value={filters.tournament_type || ''}
            onChange={(e) => handleFilterChange('tournament_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Types</option>
            <option value="National">National</option>
            <option value="State">State</option>
            <option value="Regional">Regional</option>
            <option value="Local">Local</option>
            <option value="International">International</option>
            <option value="Charity">Charity</option>
            <option value="Resort">Resort</option>
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <select
            value={filters.state_id || ''}
            onChange={(e) => handleFilterChange('state_id', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Organizer Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organizer Type
          </label>
          <select
            value={filters.organizer_type || ''}
            onChange={(e) => handleFilterChange('organizer_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Organizers</option>
            <option value="federation">Federation</option>
            <option value="state">State Committee</option>
            <option value="club">Club</option>
            <option value="partner">Partner</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default TournamentsFilters