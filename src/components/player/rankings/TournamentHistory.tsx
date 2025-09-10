import React from 'react'
import { TournamentPerformance } from '../../../store/slices/playerRankingsSlice'

interface TournamentHistoryProps {
  tournamentHistory: TournamentPerformance[]
  formatDate: (dateString: string) => string
}

const TournamentHistory: React.FC<TournamentHistoryProps> = ({
  tournamentHistory,
  formatDate
}) => {
  if (tournamentHistory.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6">Tournament History</h3>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Tournament History</h4>
          <p className="text-gray-500">Your tournament results will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Tournament History</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tournamentHistory.map(tournament => (
          <div key={tournament.tournament_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  {tournament.tournament_name}
                </h4>
                <p className="text-sm text-gray-600">{tournament.tournament_level}</p>
                <p className="text-sm text-gray-500">{formatDate(tournament.tournament_date)}</p>
              </div>
              <div className={`px-3 py-1 text-sm font-medium rounded-full ${
                tournament.final_position === 'Winner' 
                  ? 'bg-yellow-100 text-yellow-800'
                  : tournament.final_position === 'Runner-up'
                  ? 'bg-gray-100 text-gray-800'
                  : tournament.final_position.includes('Semifinalist')
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {tournament.final_position}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{tournament.matches_won}</p>
                <p className="text-sm text-gray-500">Wins</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{tournament.matches_lost}</p>
                <p className="text-sm text-gray-500">Losses</p>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Points Earned:</span>
                <span className="font-medium text-gray-900">+{tournament.points_earned}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tournament Size:</span>
                <span className="text-gray-900">{tournament.tournament_size} players</span>
              </div>
              {tournament.prize_money && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Prize Money:</span>
                  <span className="text-green-600 font-medium">${tournament.prize_money}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TournamentHistory