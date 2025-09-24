import React from 'react'
import { PlayerRanking } from '../../../store/slices/playerRankingsSlice'
import {
  FiAward,
  FiMapPin,
  FiTarget,
  FiUser,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi'

interface RankingsCardsProps {
  playerRankings: PlayerRanking[]
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
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
          <FiAward className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Current Rankings</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playerRankings.map(ranking => (
          <div key={`${ranking.ranking_type}-${ranking.category}`} className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8 hover:transform hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <FiTarget className="w-5 h-5 text-indigo-600 mr-2" />
                  <h4 className="text-lg font-bold text-gray-900 capitalize">
                    {ranking.ranking_type.replace('_', ' ')} Ranking
                  </h4>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  <p className="text-sm font-medium">{ranking.region}</p>
                </div>
              </div>
              <div className={`flex items-center px-3 py-2 rounded-full font-bold ${getRankChangeColor(ranking.rank_change)} bg-gray-100`}>
                <span className="mr-1 text-lg">{getRankChangeIcon(ranking.rank_change)}</span>
                {ranking.rank_change_amount > 0 && (
                  <span className="text-sm font-bold">
                    {ranking.rank_change_amount}
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border-2 border-indigo-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FiAward className="w-4 h-4 text-indigo-600 mr-2" />
                    <span className="text-sm font-bold text-indigo-700">Position:</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    #{ranking.ranking_position}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FiTrendingUp className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-bold text-green-700">Points:</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {ranking.points}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border-2 border-blue-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FiActivity className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-bold text-blue-700">Matches:</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {ranking.matches_played_period}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t-2 border-gray-100">
              <div className="flex items-center mb-3">
                <FiActivity className="w-4 h-4 text-gray-600 mr-2" />
                <p className="text-sm font-bold text-gray-700">Last 30 days</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-100 p-3 rounded-2xl text-center border-2 border-green-200">
                  <div className="text-lg font-bold text-green-700">{ranking.recent_performance.last_30_days.wins}</div>
                  <div className="text-xs text-green-600 font-bold">Wins</div>
                </div>
                <div className="bg-blue-100 p-3 rounded-2xl text-center border-2 border-blue-200">
                  <div className="text-lg font-bold text-blue-700">{ranking.recent_performance.last_30_days.tournaments}</div>
                  <div className="text-xs text-blue-600 font-bold">Tournaments</div>
                </div>
                <div className="bg-orange-100 p-3 rounded-2xl text-center border-2 border-orange-200">
                  <div className="text-lg font-bold text-orange-700">+{ranking.recent_performance.last_30_days.points_earned}</div>
                  <div className="text-xs text-orange-600 font-bold">Points</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RankingsCards