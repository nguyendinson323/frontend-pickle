import React from 'react'
import { useNavigate } from 'react-router-dom'

interface Match {
  tournamentName: string
  opponent: string
  date: string
  time: string
  status: string
}

interface PlayerUpcomingMatchesProps {
  upcomingMatches: Match[]
}

const PlayerUpcomingMatches: React.FC<PlayerUpcomingMatchesProps> = ({ upcomingMatches }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Matches</h3>
      {upcomingMatches.length > 0 ? (
        <div className="space-y-4">
          {upcomingMatches.slice(0, 3).map((match, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">{match.tournamentName}</p>
                <p className="text-sm text-gray-600">{match.opponent}</p>
                <p className="text-xs text-gray-500">{match.date} at {match.time}</p>
              </div>
              <div className="text-right">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {match.status}
                </span>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/player/rankings')}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            View match history →
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🏓</div>
          <p className="text-gray-600 mb-4">No upcoming matches</p>
          <button
            onClick={() => navigate('/player/tournament-browse')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Join a Tournament
          </button>
        </div>
      )}
    </div>
  )
}

export default PlayerUpcomingMatches