import React from 'react'

interface RankingsCardsProps {
  playerRankings: any[]
  getRankChangeIcon: (change: string) => string
  getRankChangeColor: (change: string) => string
}

const RankingsCards: React.FC<RankingsCardsProps> = ({
  playerRankings,
  getRankChangeIcon,
  getRankChangeColor
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Current Rankings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playerRankings.map(ranking => (
          <div key={`${ranking.ranking_type}-${ranking.category}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 capitalize">
                  {ranking.ranking_type.replace('_', ' ')} Ranking
                </h4>
                <p className="text-sm text-gray-600">{ranking.region}</p>
              </div>
              <div className={`flex items-center ${getRankChangeColor(ranking.rank_change)}`}>
                <span className="mr-1">{getRankChangeIcon(ranking.rank_change)}</span>
                {ranking.rank_change_amount > 0 && (
                  <span className="text-sm font-medium">
                    {ranking.rank_change_amount}
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Position:</span>
                <span className="text-sm font-bold text-gray-900">
                  #{ranking.ranking_position}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Points:</span>
                <span className="text-sm font-medium text-gray-900">
                  {ranking.points}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Matches:</span>
                <span className="text-sm text-gray-900">
                  {ranking.matches_played_period}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Last 30 days</p>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>{ranking.recent_performance.last_30_days.wins}W</span>
                <span>{ranking.recent_performance.last_30_days.tournaments}T</span>
                <span>+{ranking.recent_performance.last_30_days.points_earned}pts</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RankingsCards