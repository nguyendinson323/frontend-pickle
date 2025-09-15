import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { FiFilter, FiSearch, FiX } from 'react-icons/fi'
import { RootState } from '../../../store'

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
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-12 opacity-0 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-in-left [animation-delay:0.2s]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <FiFilter className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Filter Tournaments</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
          >
            <FiX className="w-4 h-4" />
            Clear All Filters
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div className="space-y-2 opacity-0 animate-fade-in-up [animation-delay:0.3s]">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FiSearch className="w-4 h-4" />
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Tournament name..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2 opacity-0 animate-fade-in-up [animation-delay:0.4s]">
            <label className="block text-sm font-semibold text-gray-700">
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* Tournament Type */}
          <div className="space-y-2 opacity-0 animate-fade-in-up [animation-delay:0.5s]">
            <label className="block text-sm font-semibold text-gray-700">
              Tournament Type
            </label>
            <select
              value={filters.tournament_type || ''}
              onChange={(e) => handleFilterChange('tournament_type', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
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
          <div className="space-y-2 opacity-0 animate-fade-in-up [animation-delay:0.6s]">
            <label className="block text-sm font-semibold text-gray-700">
              State
            </label>
            <select
              value={filters.state_id || ''}
              onChange={(e) => handleFilterChange('state_id', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Organizer Type */}
          <div className="space-y-2 opacity-0 animate-fade-in-up [animation-delay:0.7s]">
            <label className="block text-sm font-semibold text-gray-700">
              Organizer Type
            </label>
            <select
              value={filters.organizer_type || ''}
              onChange={(e) => handleFilterChange('organizer_type', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
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
    </div>
  )
}

export default TournamentsFilters