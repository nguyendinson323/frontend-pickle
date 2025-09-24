import React from 'react'
import { Tournament } from '../../../store/slices/partnerManagementSlice'
import {
  FiSearch,
  FiAward,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiPlay,
  FiPause,
  FiLoader,
  FiTag
} from 'react-icons/fi'

interface TournamentsListProps {
  tournaments: Tournament[]
  filter: {
    status: string
    searchTerm: string
  }
  onFilterChange: (filter: Partial<{ status: string; searchTerm: string }>) => void
  onEditTournament: (tournament: Tournament) => void
  onDeleteTournament: (tournamentId: number) => void
  onPublishTournament: (tournamentId: number) => void
  onCancelTournament: (tournamentId: number) => void
  loading: boolean
}

const TournamentsList: React.FC<TournamentsListProps> = ({
  tournaments,
  filter,
  onFilterChange,
  onEditTournament,
  onDeleteTournament,
  onPublishTournament,
  onCancelTournament,
  loading
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300',
      ongoing: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300',
      completed: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
      canceled: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
    }
    return colors[status as keyof typeof colors] || colors.upcoming
  }

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredTournaments = tournaments.filter(tournament => {
    if (filter.status && tournament.status !== filter.status) return false
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase()
      return (
        tournament.name.toLowerCase().includes(searchLower) ||
        tournament.tournament_type.toLowerCase().includes(searchLower) ||
        tournament.skill_level.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const canPublish = (tournament: Tournament) => tournament.status === 'upcoming'
  const canCancel = (tournament: Tournament) => !['completed', 'canceled'].includes(tournament.status)
  const canDelete = (tournament: Tournament) => tournament.status === 'upcoming' && tournament.current_participants === 0

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="text-white">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-3">
                <FiAward className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold">Tournaments Management</h2>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={filter.searchTerm}
                onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
                className="pl-10 pr-4 py-3 border-2 border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
              />
            </div>

            <select
              value={filter.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="px-4 py-3 border-2 border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              <option value="">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <FiLoader className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Tournaments...</h3>
            <p className="text-gray-600 font-medium">Please wait while we fetch your tournaments</p>
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiAward className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No Tournaments Found</h3>
            <p className="text-gray-600 font-medium">
              {filter.status || filter.searchTerm
                ? 'No tournaments match your current filters'
                : 'Start by creating your first tournament'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTournaments.map((tournament) => (
              <div key={tournament.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-3 mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{tournament.name}</h3>
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(tournament.status)}`}>
                        {tournament.status.replace('_', ' ')}
                      </span>
                      <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border border-indigo-300">
                        <FiTag className="w-3 h-3 mr-1" />
                        {tournament.tournament_type}
                      </span>
                    </div>

                    {tournament.description && (
                      <p className="text-sm text-gray-600 mb-4">{tournament.description}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-500">Tournament Dates:</span>
                        <p className="text-gray-900">
                          {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
                        </p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-500">Registration:</span>
                        <p className="text-gray-900">
                          {formatDate(tournament.registration_start)} - {formatDate(tournament.registration_end)}
                        </p>
                      </div>

                      <div>
                        <span className="font-medium text-gray-500">Participants:</span>
                        <p className="text-gray-900">
                          {tournament.current_participants}
                          {tournament.max_participants && ` / ${tournament.max_participants}`}
                        </p>
                      </div>

                      <div>
                        <span className="font-medium text-gray-500">Entry Fee:</span>
                        <p className="text-gray-900">
                          {tournament.entry_fee ? formatCurrency(tournament.entry_fee) : 'Free'}
                        </p>
                      </div>
                    </div>

                    {tournament.prize_pool && (
                      <div className="mt-3 text-sm">
                        <span className="font-medium text-gray-500">Prize Pool:</span>
                        <span className="ml-2 text-lg font-semibold text-green-600">
                          {formatCurrency(tournament.prize_pool)}
                        </span>
                      </div>
                    )}

                    {tournament.venue_name && (
                      <div className="mt-3 text-sm">
                        <span className="font-medium text-gray-500">Venue:</span>
                        <span className="ml-2 text-gray-900">{tournament.venue_name}</span>
                        {tournament.venue_address && (
                          <span className="text-gray-600">, {tournament.venue_address}</span>
                        )}
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-500">
                      Created: {formatDate(tournament.created_at)} | Updated: {formatDate(tournament.updated_at)}
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6 flex-shrink-0">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => onEditTournament(tournament)}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      
                      {canPublish(tournament) && (
                        <button
                          onClick={() => onPublishTournament(tournament.id)}
                          className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Publish
                        </button>
                      )}
                      
                      {canCancel(tournament) && (
                        <button
                          onClick={() => onCancelTournament(tournament.id)}
                          className="px-3 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      
                      {canDelete(tournament) && (
                        <button
                          onClick={() => onDeleteTournament(tournament.id)}
                          className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TournamentsList