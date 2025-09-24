import React, { useState } from 'react'
import { PlayerRanking, PlayerStats } from '../../../store/slices/playerRankingsSlice'
import {
  FiTarget,
  FiSearch,
  FiUser,
  FiAward,
  FiActivity,
  FiTrendingUp,
  FiBarChart2
} from 'react-icons/fi'

interface PlayerComparisonProps {
  comparisonResults: PlayerRanking[]
  comparisonPlayer: PlayerRanking | null
  comparisonData: any // This would need a specific interface for comparison data
  playerStats: PlayerStats | null
  onComparePlayer: (player: PlayerRanking) => void
  formatDate: (dateString: string) => string
  comparisonSearch: string
  setComparisonSearch: (value: string) => void
}

const PlayerComparison: React.FC<PlayerComparisonProps> = ({
  comparisonResults,
  comparisonPlayer,
  comparisonData,
  playerStats,
  onComparePlayer,
  formatDate,
  comparisonSearch,
  setComparisonSearch
}) => {

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
          <FiTarget className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Compare Players</h3>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8 mb-8">
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={comparisonSearch}
              onChange={(e) => setComparisonSearch(e.target.value)}
              placeholder="Search for a player to compare with..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-lg bg-gray-50"
            />
          </div>
        </div>

        {comparisonResults.length > 0 && (
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {comparisonResults.map(player => (
              <div
                key={player.player_id}
                onClick={() => onComparePlayer(player)}
                className="flex items-center space-x-4 p-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-2xl cursor-pointer transition-all duration-300 border-2 border-transparent hover:border-green-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {player.player.full_name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <FiUser className="w-4 h-4 text-gray-600 mr-2" />
                    <p className="font-bold text-gray-900">{player.player.full_name}</p>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Rank #{player.ranking_position} • {player.player.skill_level}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-2xl border-2 border-blue-100">
                  <div className="flex items-center">
                    <FiTrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                    <p className="text-sm font-bold text-blue-900">{player.points} pts</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {comparisonPlayer && comparisonData && playerStats && (
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <FiTarget className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900">
              Comparison Results
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border-2 border-blue-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <FiUser className="w-6 h-6 text-white" />
                </div>
                <h5 className="text-xl font-bold text-blue-900">You</h5>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <FiActivity className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-bold text-blue-700">Total Matches:</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{comparisonData.player1.stats.total_matches}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <FiAward className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-bold text-blue-700">Win Rate:</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{comparisonData.player1.stats.win_percentage.toFixed(1)}%</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <FiTarget className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-bold text-blue-700">Tournament Wins:</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{comparisonData.player1.stats.tournament_wins}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <FiBarChart2 className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-bold text-blue-700">Ranking:</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">#{comparisonData.player1.stats.ranking_position}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <FiTrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-bold text-blue-700">Points:</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{comparisonData.player1.stats.points}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl border-2 border-green-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <FiUser className="w-6 h-6 text-white" />
                </div>
                <h5 className="text-xl font-bold text-green-900">{comparisonPlayer.player.full_name}</h5>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border-2 border-green-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <FiActivity className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-bold text-green-700">Total Matches:</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{comparisonData.player2.stats.total_matches}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-green-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <FiAward className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-bold text-green-700">Win Rate:</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{comparisonData.player2.stats.win_percentage.toFixed(1)}%</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-green-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <FiTarget className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-bold text-green-700">Tournament Wins:</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{comparisonData.player2.stats.tournament_wins}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-green-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <FiBarChart2 className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-bold text-green-700">Ranking:</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">#{comparisonData.player2.stats.ranking_position}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-green-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <FiTrendingUp className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-bold text-green-700">Points:</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{comparisonData.player2.stats.points}</span>
                </div>
              </div>
            </div>
          </div>

          {comparisonData.head_to_head && (
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <FiTarget className="w-5 h-5 text-white" />
                </div>
                <h5 className="text-xl font-bold text-gray-900">Head to Head</h5>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-3xl border-2 border-purple-200 text-center">
                <div className="text-4xl font-bold text-purple-900 mb-4">
                  {comparisonData.head_to_head.player1_wins} - {comparisonData.head_to_head.player2_wins}
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-purple-300 mb-4">
                  <div className="flex items-center justify-center">
                    <FiActivity className="w-4 h-4 text-purple-600 mr-2" />
                    <p className="text-lg font-bold text-purple-800">
                      Total matches: {comparisonData.head_to_head.total_matches}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-purple-700 font-bold">
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