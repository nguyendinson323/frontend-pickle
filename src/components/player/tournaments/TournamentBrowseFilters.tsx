import React from 'react'
import { TournamentFilters } from '../../../store/slices/tournamentBrowseSlice'
import { FiSliders, FiSearch, FiMapPin, FiClock, FiDollarSign, FiUsers, FiCalendar, FiAward } from 'react-icons/fi'

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
    <div className="bg-white shadow-xl rounded-3xl border-2 border-gray-100">
      <div className="px-8 py-6 border-b-2 border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-xl">
            <FiSliders className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Tournament Filters</h3>
        </div>
      </div>
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* State Filter */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border-2 border-blue-100">
            <div className="flex items-center mb-3">
              <FiMapPin className="w-5 h-5 text-blue-600 mr-2" />
              <label className="block text-sm font-bold text-blue-700">State</label>
            </div>
            <select
              value={filters.state_id || ''}
              onChange={(e) => onFilterChange('state_id', e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-4 py-3 text-sm border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-2xl bg-white shadow-lg font-medium"
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
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-100">
            <div className="flex items-center mb-3">
              <FiClock className="w-5 h-5 text-green-600 mr-2" />
              <label className="block text-sm font-bold text-green-700">Status</label>
            </div>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange('status', e.target.value || null)}
              className="w-full px-4 py-3 text-sm border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-2xl bg-white shadow-lg font-medium"
            >
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Tournament Type Filter */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-100">
            <div className="flex items-center mb-3">
              <FiAward className="w-5 h-5 text-purple-600 mr-2" />
              <label className="block text-sm font-bold text-purple-700">Tournament Type</label>
            </div>
            <select
              value={filters.tournament_type || ''}
              onChange={(e) => onFilterChange('tournament_type', e.target.value || null)}
              className="w-full px-4 py-3 text-sm border-2 border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-2xl bg-white shadow-lg font-medium"
            >
              <option value="">All Types</option>
              <option value="National">National</option>
              <option value="State">State</option>
              <option value="Local">Local</option>
              <option value="Regional">Regional</option>
            </select>
          </div>

          {/* Organizer Type Filter */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-2xl border-2 border-orange-100">
            <div className="flex items-center mb-3">
              <FiUsers className="w-5 h-5 text-orange-600 mr-2" />
              <label className="block text-sm font-bold text-orange-700">Organizer</label>
            </div>
            <select
              value={filters.organizer_type || ''}
              onChange={(e) => onFilterChange('organizer_type', e.target.value || null)}
              className="w-full px-4 py-3 text-sm border-2 border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-2xl bg-white shadow-lg font-medium"
            >
              <option value="">All Organizers</option>
              <option value="federation">Federation</option>
              <option value="state">State</option>
              <option value="club">Club</option>
              <option value="partner">Partner</option>
            </select>
          </div>

          {/* Entry Fee Filter */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-2xl border-2 border-yellow-100">
            <div className="flex items-center mb-3">
              <FiDollarSign className="w-5 h-5 text-yellow-600 mr-2" />
              <label className="block text-sm font-bold text-yellow-700">Max Entry Fee</label>
            </div>
            <select
              value={filters.entry_fee_max || ''}
              onChange={(e) => onFilterChange('entry_fee_max', e.target.value ? parseFloat(e.target.value) : null)}
              className="w-full px-4 py-3 text-sm border-2 border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 rounded-2xl bg-white shadow-lg font-medium"
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
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-2xl border-2 border-teal-100">
            <div className="flex items-center mb-3">
              <FiUsers className="w-5 h-5 text-teal-600 mr-2" />
              <label className="block text-sm font-bold text-teal-700">Availability</label>
            </div>
            <select
              value={filters.has_available_spots === null ? '' : filters.has_available_spots ? 'true' : 'false'}
              onChange={(e) => onFilterChange('has_available_spots', e.target.value === '' ? null : e.target.value === 'true')}
              className="w-full px-4 py-3 text-sm border-2 border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-2xl bg-white shadow-lg font-medium"
            >
              <option value="">All Tournaments</option>
              <option value="true">Available Spots Only</option>
            </select>
          </div>

          {/* Date Range Filters */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-2xl border-2 border-indigo-100">
            <div className="flex items-center mb-3">
              <FiCalendar className="w-5 h-5 text-indigo-600 mr-2" />
              <label className="block text-sm font-bold text-indigo-700">Start Date From</label>
            </div>
            <input
              type="date"
              value={filters.start_date_from || ''}
              onChange={(e) => onFilterChange('start_date_from', e.target.value || null)}
              className="w-full px-4 py-3 text-sm border-2 border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-2xl bg-white shadow-lg font-medium"
            />
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-2xl border-2 border-indigo-100">
            <div className="flex items-center mb-3">
              <FiCalendar className="w-5 h-5 text-indigo-600 mr-2" />
              <label className="block text-sm font-bold text-indigo-700">Start Date To</label>
            </div>
            <input
              type="date"
              value={filters.start_date_to || ''}
              onChange={(e) => onFilterChange('start_date_to', e.target.value || null)}
              className="w-full px-4 py-3 text-sm border-2 border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-2xl bg-white shadow-lg font-medium"
            />
          </div>

          {/* Ranking Filter */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-2xl border-2 border-pink-100">
            <div className="flex items-center mb-3">
              <FiAward className="w-5 h-5 text-pink-600 mr-2" />
              <label className="block text-sm font-bold text-pink-700">Ranking Status</label>
            </div>
            <select
              value={filters.is_ranking === null ? '' : filters.is_ranking ? 'true' : 'false'}
              onChange={(e) => onFilterChange('is_ranking', e.target.value === '' ? null : e.target.value === 'true')}
              className="w-full px-4 py-3 text-sm border-2 border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 rounded-2xl bg-white shadow-lg font-medium"
            >
              <option value="">All Tournaments</option>
              <option value="true">Ranking Tournaments Only</option>
              <option value="false">Non-Ranking Only</option>
            </select>
          </div>

        </div>
        
        <div className="flex justify-center pt-4">
          <button
            onClick={onSearch}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-green-300"
          >
            <FiSearch className="w-6 h-6 mr-3" />
            Search Tournaments
          </button>
        </div>
      </div>
    </div>
  )
}

export default TournamentBrowseFilters