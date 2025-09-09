import React from 'react'
import { ClubTournament } from '../../../store/slices/clubTournamentsSlice'

interface TournamentsListProps {
  tournaments: ClubTournament[]
  onViewDetails: (tournament: ClubTournament) => void
  onEditTournament: (tournament: ClubTournament) => void
  onDeleteTournament: (tournamentId: number) => void
  onUpdateStatus: (tournamentId: number, status: string) => void
}

const TournamentsList: React.FC<TournamentsListProps> = ({
  tournaments,
  onViewDetails,
  onEditTournament,
  onDeleteTournament,
  onUpdateStatus
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'ongoing':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusOptions = (currentStatus: string) => {
    const statuses = ['upcoming', 'ongoing', 'completed', 'canceled']
    return statuses.filter(status => status !== currentStatus)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="grid gap-4 p-6">
        {tournaments.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tournaments</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first tournament.</p>
          </div>
        ) : (
          tournaments.map((tournament) => (
            <div key={tournament.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{tournament.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{tournament.tournament_type}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tournament.status)}`}>
                    {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                  </span>
                  <div className="relative">
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          onUpdateStatus(tournament.id, e.target.value)
                          e.target.value = ""
                        }
                      }}
                      className="text-xs border-gray-300 rounded text-gray-600 bg-white cursor-pointer"
                    >
                      <option value="">Change Status</option>
                      {getStatusOptions(tournament.status).map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {tournament.description && (
                <p className="text-gray-600 mb-4">{tournament.description}</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Tournament Dates</div>
                  <div className="font-medium">{formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Registration</div>
                  <div className="font-medium">{formatDate(tournament.registration_start)} - {formatDate(tournament.registration_end)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Participants</div>
                  <div className="font-medium">{tournament.registration_count || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Revenue</div>
                  <div className="font-medium">${tournament.revenue || 0}</div>
                </div>
              </div>

              {tournament.venue_name && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500">Venue</div>
                  <div className="font-medium">{tournament.venue_name}</div>
                  {tournament.venue_address && (
                    <div className="text-sm text-gray-600">{tournament.venue_address}</div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {tournament.entry_fee && (
                    <div>
                      <span className="text-sm text-gray-500">Entry Fee: </span>
                      <span className="font-medium">${tournament.entry_fee}</span>
                    </div>
                  )}
                  {tournament.categories && tournament.categories.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-500">Categories: </span>
                      <span className="font-medium">{tournament.categories.length}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewDetails(tournament)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onEditTournament(tournament)}
                    className="text-green-600 hover:text-green-900 text-sm font-medium"
                    title="Edit Tournament"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteTournament(tournament.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                    title="Delete Tournament"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TournamentsList