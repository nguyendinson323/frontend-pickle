import React from 'react'
import { Tournament } from '../../../store/slices/partnerManagementSlice'

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
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-blue-100 text-blue-800',
      registration_open: 'bg-green-100 text-green-800',
      registration_closed: 'bg-yellow-100 text-yellow-800',
      ongoing: 'bg-purple-100 text-purple-800',
      completed: 'bg-teal-100 text-teal-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || colors.draft
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

  const canPublish = (tournament: Tournament) => tournament.status === 'draft'
  const canCancel = (tournament: Tournament) => !['completed', 'cancelled'].includes(tournament.status)
  const canDelete = (tournament: Tournament) => tournament.status === 'draft' || tournament.current_participants === 0

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Tournaments</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tournaments..."
                value={filter.searchTerm}
                onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <select
              value={filter.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="registration_open">Registration Open</option>
              <option value="registration_closed">Registration Closed</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
            <p className="text-gray-600">Loading tournaments...</p>
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <p className="text-gray-500">
              {filter.status || filter.searchTerm 
                ? 'No tournaments match your filters' 
                : 'No tournaments created yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTournaments.map((tournament) => (
              <div key={tournament.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{tournament.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tournament.status)}`}>
                        {tournament.status.replace('_', ' ')}
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {tournament.tournament_type}
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        {tournament.skill_level}
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