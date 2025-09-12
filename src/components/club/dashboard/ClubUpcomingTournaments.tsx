import React from 'react'
import { useNavigate } from 'react-router-dom'

interface ClubUpcomingTournament {
  id: number
  name: string
  description: string | null
  start_date: string
  end_date: string
  registration_deadline?: string
  entry_fee: number
  max_participants: number
  status: string
  tournament_type?: string
  created_at: string
}

interface ClubUpcomingTournamentsProps {
  tournaments: ClubUpcomingTournament[]
}

const ClubUpcomingTournaments: React.FC<ClubUpcomingTournamentsProps> = ({ tournaments }) => {
  const navigate = useNavigate()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Tournaments</h3>
      {tournaments.length > 0 ? (
        <div className="space-y-4">
          {tournaments.slice(0, 3).map((tournament) => (
            <div key={tournament.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{tournament.name}</p>
                  <p className="text-sm text-gray-600">{tournament.tournament_type}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(tournament.start_date)} at {formatTime(tournament.start_date)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {tournament.max_participants || 'Unlimited'} max
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/club/tournaments')}
            className="text-purple-600 hover:text-purple-500 text-sm font-medium"
          >
            View all tournaments →
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🏆</div>
          <p className="text-gray-600 mb-4">No upcoming tournaments</p>
          <button
            onClick={() => navigate('/club/tournaments')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Create Tournament
          </button>
        </div>
      )}
    </div>
  )
}

export default ClubUpcomingTournaments