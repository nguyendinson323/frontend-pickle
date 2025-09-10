import React from 'react'
import { TournamentFilters } from '../../../store/slices/tournamentBrowseSlice'

interface State {
  id: number
  name: string
}

interface TournamentBrowseFiltersProps {
  filters: TournamentFilters
  statesList: State[]
  onFilterChange: (key: keyof TournamentFilters, value: string | number | boolean | null) => void
  onSearch: () => void
}

const TournamentBrowseFilters: React.FC<TournamentBrowseFiltersProps> = ({
  filters,
  statesList,
  onFilterChange,
  onSearch
}) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Search Filters</h3>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* State Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <select
              value={filters.state_id || ''}
              onChange={(e) => onFilterChange('state_id', e.target.value ? parseInt(e.target.value) : null)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All States</option>
              {statesList.map(state => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange('status', e.target.value || null)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Tournament Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tournament Type</label>
            <select
              value={filters.tournament_type || ''}
              onChange={(e) => onFilterChange('tournament_type', e.target.value || null)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Types</option>
              <option value="National">National</option>
              <option value="State">State</option>
              <option value="Local">Local</option>
              <option value="Regional">Regional</option>
            </select>
          </div>

          {/* Organizer Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Organizer</label>
            <select
              value={filters.organizer_type || ''}
              onChange={(e) => onFilterChange('organizer_type', e.target.value || null)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Organizers</option>
              <option value="federation">Federation</option>
              <option value="state">State</option>
              <option value="club">Club</option>
              <option value="partner">Partner</option>
            </select>
          </div>

          {/* Entry Fee Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Entry Fee</label>
            <select
              value={filters.entry_fee_max || ''}
              onChange={(e) => onFilterChange('entry_fee_max', e.target.value ? parseFloat(e.target.value) : null)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Any Fee</option>
              <option value={0}>Free</option>
              <option value={100}>Up to $100</option>
              <option value={250}>Up to $250</option>
              <option value={500}>Up to $500</option>
              <option value={1000}>Up to $1000</option>
            </select>
          </div>

          {/* Available Spots Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Availability</label>
            <select
              value={filters.has_available_spots ? 'true' : 'false'}
              onChange={(e) => onFilterChange('has_available_spots', e.target.value === 'true')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="false">All Tournaments</option>
              <option value="true">Available Spots Only</option>
            </select>
          </div>

        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onSearch}
            className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Search Tournaments
          </button>
        </div>
      </div>
    </div>
  )
}

export default TournamentBrowseFilters