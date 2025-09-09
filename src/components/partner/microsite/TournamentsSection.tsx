import React from 'react'
import { PartnerTournament } from '../../../store/slices/partnerMicrositeSlice'
import { useNavigate } from 'react-router-dom'

interface TournamentsSectionProps {
  tournaments: PartnerTournament[]
  isOwner: boolean
}

const TournamentsSection: React.FC<TournamentsSectionProps> = ({ tournaments, isOwner }) => {
  const navigate = useNavigate()

  if (tournaments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tournaments</h2>
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 00-2-2H8a2 2 0 00-2 2v2m6 0V6a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6m-6 0H6" />
          </svg>
          <p>No tournaments scheduled</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      canceled: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const handleRegister = (tournamentId: number) => {
    navigate(`/tournament-browse?register=${tournamentId}`)
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Tournaments & Events</h2>
      <div className="space-y-4">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {tournament.name}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tournament.status)}`}>
                    {tournament.status}
                  </span>
                  {tournament.tournament_type && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {tournament.tournament_type}
                    </span>
                  )}
                </div>

                {tournament.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {tournament.description}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Dates:</span>
                    <p className="text-gray-900">
                      {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-500">Registration:</span>
                    <p className="text-gray-900">
                      Until {formatDate(tournament.registration_end)}
                    </p>
                  </div>

                  {tournament.venue_name && (
                    <div>
                      <span className="font-medium text-gray-500">Venue:</span>
                      <p className="text-gray-900">{tournament.venue_name}</p>
                    </div>
                  )}

                  <div>
                    <span className="font-medium text-gray-500">Participants:</span>
                    <p className="text-gray-900">
                      {tournament.current_participants}
                      {tournament.max_participants && ` / ${tournament.max_participants}`}
                    </p>
                  </div>
                </div>

                {tournament.entry_fee !== null && (
                  <div className="mt-3 text-sm">
                    <span className="font-medium text-gray-500">Entry Fee:</span>
                    <span className="ml-2 text-lg font-semibold text-green-600">
                      ${tournament.entry_fee.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 lg:mt-0 lg:ml-6 flex-shrink-0">
                {tournament.status === 'upcoming' && 
                 new Date(tournament.registration_end) > new Date() &&
                 (!tournament.max_participants || tournament.current_participants < tournament.max_participants) &&
                 !isOwner && (
                  <button
                    onClick={() => handleRegister(tournament.id)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Register Now
                  </button>
                )}

                {tournament.status === 'upcoming' && 
                 (new Date(tournament.registration_end) <= new Date() ||
                  (tournament.max_participants && tournament.current_participants >= tournament.max_participants)) && (
                  <span className="inline-flex px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg">
                    Registration Closed
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TournamentsSection