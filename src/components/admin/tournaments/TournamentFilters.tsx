import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { setTournamentFilter, fetchTournaments } from '../../../store/slices/adminTournamentsSlice'
import {
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiRefreshCcw,
  FiCheck
} from 'react-icons/fi'

const TournamentFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { tournamentFilter } = useSelector((state: RootState) => state.adminTournaments)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (field: string, value: string) => {
    dispatch(setTournamentFilter({ [field]: value }))
  }

  const handleSearch = () => {
    dispatch(fetchTournaments(tournamentFilter))
  }

  const handleReset = () => {
    const resetFilter = {
      status: '',
      organizer: '',
      location: '',
      dateFrom: '',
      dateTo: '',
      searchTerm: '',
      entryFeeMin: '',
      entryFeeMax: '',
      participantsMin: '',
      participantsMax: ''
    }
    dispatch(setTournamentFilter(resetFilter))
    dispatch(fetchTournaments(resetFilter))
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mr-4">
            <FiFilter className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Tournament Filters</h3>
            <p className="text-gray-600 font-medium">Filter and search tournaments by criteria</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {isExpanded ? 'Collapse' : 'Advanced Filters'}
          {isExpanded ? (
            <FiChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <FiChevronDown className="ml-2 h-4 w-4" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Search Tournaments
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tournament name, description..."
              value={tournamentFilter.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="w-full pl-10 rounded-2xl border-2 border-gray-300 px-4 py-3 text-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Status
          </label>
          <select
            value={tournamentFilter.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full rounded-2xl border-2 border-gray-300 px-4 py-3 text-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Organizer Type
          </label>
          <select
            value={tournamentFilter.organizer}
            onChange={(e) => handleFilterChange('organizer', e.target.value)}
            className="w-full rounded-2xl border-2 border-gray-300 px-4 py-3 text-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
          >
            <option value="">All Organizers</option>
            <option value="club">Club</option>
            <option value="partner">Partner</option>
            <option value="state">State Committee</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="City, state, venue..."
              value={tournamentFilter.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full pl-10 rounded-2xl border-2 border-gray-300 px-4 py-3 text-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                Date From
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={tournamentFilter.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full pl-10 rounded-2xl border-2 border-gray-300 px-4 py-3 text-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                Date To
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={tournamentFilter.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full pl-10 rounded-2xl border-2 border-gray-300 px-4 py-3 text-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                Entry Fee Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    placeholder="Min"
                    value={tournamentFilter.entryFeeMin}
                    onChange={(e) => handleFilterChange('entryFeeMin', e.target.value)}
                    className="w-full pl-8 rounded-xl border-2 border-gray-300 px-3 py-2 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    placeholder="Max"
                    value={tournamentFilter.entryFeeMax}
                    onChange={(e) => handleFilterChange('entryFeeMax', e.target.value)}
                    className="w-full pl-8 rounded-xl border-2 border-gray-300 px-3 py-2 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                Participants Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUsers className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    placeholder="Min"
                    value={tournamentFilter.participantsMin}
                    onChange={(e) => handleFilterChange('participantsMin', e.target.value)}
                    className="w-full pl-8 rounded-xl border-2 border-gray-300 px-3 py-2 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUsers className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    placeholder="Max"
                    value={tournamentFilter.participantsMax}
                    onChange={(e) => handleFilterChange('participantsMax', e.target.value)}
                    className="w-full pl-8 rounded-xl border-2 border-gray-300 px-3 py-2 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={handleReset}
          className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <FiRefreshCcw className="mr-2 h-5 w-5" />
          Reset Filters
        </button>
        <button
          onClick={handleSearch}
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <FiCheck className="mr-2 h-5 w-5" />
          Apply Filters
        </button>
      </div>
    </div>
  )
}

export default TournamentFilters