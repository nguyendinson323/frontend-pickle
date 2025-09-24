import React from 'react'
import { PlayerRanking } from '../../../store/slices/playerRankingsSlice'
import {
  FiAward,
  FiUsers,
  FiTarget,
  FiTrendingUp,
  FiActivity,
  FiUser
} from 'react-icons/fi'

interface LeaderboardViewProps {
  selectedRankingType: 'overall' | 'state' | 'club' | 'age_group'
  onRankingTypeChange: (rankingType: 'overall' | 'state' | 'club' | 'age_group') => void
  leaderboards: {
    overall: PlayerRanking[]
    state: PlayerRanking[]
    club: PlayerRanking[]
    age_group: PlayerRanking[]
  }
  getRankChangeIcon: (change: string) => string
  getRankChangeColor: (change: string) => string
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  selectedRankingType,
  onRankingTypeChange,
  leaderboards,
  getRankChangeIcon,
  getRankChangeColor
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
            <FiUsers className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Leaderboards</h3>
        </div>
        <div className="flex items-center space-x-3">
          <FiTarget className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Category:</span>
          <select
            value={selectedRankingType}
            onChange={(e) => onRankingTypeChange(e.target.value as any)}
            className="px-4 py-3 border-2 border-indigo-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium bg-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <option value="overall">Overall</option>
            <option value="state">State</option>
            <option value="club">Club</option>
            <option value="age_group">Age Group</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100">
        <div className="px-8 py-6 border-b-2 border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center">
            <FiAward className="w-6 h-6 text-indigo-600 mr-3" />
            <h4 className="text-xl font-bold text-gray-900 capitalize">
              {selectedRankingType.replace('_', ' ')} Rankings
            </h4>
          </div>
        </div>
        
        <div className="divide-y-2 divide-gray-100">
          {leaderboards[selectedRankingType].map((player: any, index: number) => (
            <div key={`${selectedRankingType}-${player.player_id}-${index}`} className="px-8 py-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-6 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${
                    index < 3
                      ? index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                        : index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
                        : 'bg-gradient-to-r from-orange-400 to-red-500 text-white'
                      : 'bg-gradient-to-r from-blue-400 to-indigo-600 text-white'
                  }`}>
                    {index + 1}
                  </div>

                  <div className="w-14 h-14 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {player.player.full_name.charAt(0)}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center mb-1">
                      <FiUser className="w-4 h-4 text-gray-600 mr-2" />
                      <p className="font-bold text-gray-900 text-lg">{player.player.full_name}</p>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{player.player.skill_level}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border-2 border-blue-100 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <FiTrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                      <p className="text-lg font-bold text-blue-900">{player.points}</p>
                    </div>
                    <p className="text-xs text-blue-600 font-bold">Points</p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-100 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <FiActivity className="w-4 h-4 text-green-600 mr-1" />
                      <p className="text-lg font-bold text-green-900">{player.matches_played_period}</p>
                    </div>
                    <p className="text-xs text-green-600 font-bold">Matches</p>
                  </div>

                  <div className={`px-4 py-3 rounded-2xl font-bold flex items-center shadow-lg ${getRankChangeColor(player.rank_change)} bg-gray-100`}>
                    <span className="text-xl mr-2">{getRankChangeIcon(player.rank_change)}</span>
                    {player.rank_change_amount > 0 && (
                      <span className="text-sm font-bold">
                        {player.rank_change_amount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeaderboardView