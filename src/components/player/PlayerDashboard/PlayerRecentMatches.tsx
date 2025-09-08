import React from 'react'
import { useNavigate } from 'react-router-dom'

interface RecentMatch {
  opponent: string
  tournament: string
  date: string
  result: 'win' | 'loss' | 'draw'
  score: string
}

interface PlayerRecentMatchesProps {
  recentMatches: RecentMatch[]
}

const PlayerRecentMatches: React.FC<PlayerRecentMatchesProps> = ({ recentMatches }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Matches</h3>
      {recentMatches.length > 0 ? (
        <div className="space-y-4">
          {recentMatches.slice(0, 4).map((match, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{match.opponent}</p>
                <p className="text-sm text-gray-600">{match.tournament}</p>
                <p className="text-xs text-gray-500">{match.date}</p>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${
                  match.result === 'win' ? 'text-green-600' : 
                  match.result === 'loss' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {match.result === 'win' ? 'W' : match.result === 'loss' ? 'L' : 'D'}
                </span>
                <p className="text-xs text-gray-500">{match.score}</p>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/player/match-history')}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            View match history →
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-gray-600">No recent matches</p>
        </div>
      )}
    </div>
  )
}

export default PlayerRecentMatches