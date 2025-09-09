import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { setTournamentFilter, fetchTournaments } from '../../../store/slices/adminTournamentsSlice'

const TournamentFilters: React.FC = () => {
  const dispatch = useDispatch()
  const { tournamentFilter } = useSelector((state: RootState) => state.adminTournaments)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (field: string, value: string) => {
    dispatch(setTournamentFilter({ [field]: value }))
  }

  const handleSearch = () => {
    dispatch(fetchTournaments(tournamentFilter) as any)
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
    dispatch(fetchTournaments(resetFilter) as any)
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Tournament Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
          <svg
            className={`ml-2 h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Tournament name, description..."
            value={tournamentFilter.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={tournamentFilter.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organizer Type
          </label>
          <select
            value={tournamentFilter.organizer}
            onChange={(e) => handleFilterChange('organizer', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Organizers</option>
            <option value="club">Club</option>
            <option value="partner">Partner</option>
            <option value="state">State Committee</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="City, state, venue..."
            value={tournamentFilter.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              value={tournamentFilter.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date To
            </label>
            <input
              type="date"
              value={tournamentFilter.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entry Fee Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={tournamentFilter.entryFeeMin}
                onChange={(e) => handleFilterChange('entryFeeMin', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={tournamentFilter.entryFeeMax}
                onChange={(e) => handleFilterChange('entryFeeMax', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Participants Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={tournamentFilter.participantsMin}
                onChange={(e) => handleFilterChange('participantsMin', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={tournamentFilter.participantsMax}
                onChange={(e) => handleFilterChange('participantsMax', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reset
        </button>
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}

export default TournamentFilters