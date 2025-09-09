import React, { useState } from 'react'

interface PlayerComparisonProps {
  comparisonResults: any[]
  comparisonPlayer: any
  comparisonData: any
  playerStats: any
  onComparePlayer: (player: any) => void
  formatDate: (dateString: string) => string
}

const PlayerComparison: React.FC<PlayerComparisonProps> = ({
  comparisonResults,
  comparisonPlayer,
  comparisonData,
  playerStats,
  onComparePlayer,
  formatDate
}) => {
  const [comparisonSearch, setComparisonSearch] = useState('')

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Compare Players</h3>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-4">
          <input
            type="text"
            value={comparisonSearch}
            onChange={(e) => setComparisonSearch(e.target.value)}
            placeholder="Search for a player to compare with..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {comparisonResults.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {comparisonResults.map(player => (
              <div
                key={player.player_id}
                onClick={() => onComparePlayer(player)}
                className="flex items-center space-x-3 p-3 hover: rounded-md cursor-pointer"
              >
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {player.player.full_name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{player.player.full_name}</p>
                  <p className="text-sm text-gray-500">
                    Rank #{player.ranking_position} • {player.player.skill_level}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{player.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {comparisonPlayer && comparisonData && playerStats && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-6">
            Comparison Results
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h5 className="font-medium text-gray-900 mb-4">You</h5>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Matches:</span>
                  <span className="text-sm font-medium">{comparisonData.player1.stats.total_matches}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Win Rate:</span>
                  <span className="text-sm font-medium">{comparisonData.player1.stats.win_percentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Tournament Wins:</span>
                  <span className="text-sm font-medium">{comparisonData.player1.stats.tournament_wins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Ranking:</span>
                  <span className="text-sm font-medium">#{comparisonData.player1.stats.ranking_position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Points:</span>
                  <span className="text-sm font-medium">{comparisonData.player1.stats.points}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-4">{comparisonPlayer.player.full_name}</h5>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Matches:</span>
                  <span className="text-sm font-medium">{comparisonData.player2.stats.total_matches}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Win Rate:</span>
                  <span className="text-sm font-medium">{comparisonData.player2.stats.win_percentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Tournament Wins:</span>
                  <span className="text-sm font-medium">{comparisonData.player2.stats.tournament_wins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Ranking:</span>
                  <span className="text-sm font-medium">#{comparisonData.player2.stats.ranking_position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Points:</span>
                  <span className="text-sm font-medium">{comparisonData.player2.stats.points}</span>
                </div>
              </div>
            </div>
          </div>

          {comparisonData.head_to_head && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h5 className="font-medium text-gray-900 mb-4">Head to Head</h5>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {comparisonData.head_to_head.player1_wins} - {comparisonData.head_to_head.player2_wins}
                </div>
                <p className="text-sm text-gray-500">
                  Total matches: {comparisonData.head_to_head.total_matches}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Last match: {formatDate(comparisonData.head_to_head.last_match_date)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PlayerComparison