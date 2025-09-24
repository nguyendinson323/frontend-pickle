import React from 'react'
import { PlayerStats } from '../../../store/slices/playerRankingsSlice'
import {
  FiAward,
  FiBarChart2,
  FiActivity,
  FiTrendingUp
} from 'react-icons/fi'

interface StatsOverviewCardsProps {
  playerStats: PlayerStats | null
}

const StatsOverviewCards: React.FC<StatsOverviewCardsProps> = ({
  playerStats
}) => {
  if (!playerStats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-3xl shadow-xl border-2 border-green-100 p-8 hover:transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
            <FiAward className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-700 mb-1">Win Rate</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {playerStats.win_percentage.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 font-medium">
              {playerStats.wins}W - {playerStats.losses}L
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border-2 border-blue-100 p-8 hover:transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
            <FiBarChart2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-700 mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {Math.abs(playerStats.current_streak)}
            </p>
            <p className={`text-sm font-medium ${
              playerStats.current_streak >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {playerStats.current_streak >= 0 ? 'Wins' : 'Losses'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border-2 border-purple-100 p-8 hover:transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
            <FiActivity className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-purple-700 mb-1">Tournaments</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {playerStats.tournament_wins}
            </p>
            <p className="text-sm text-gray-600 font-medium">
              of {playerStats.total_tournaments} won
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border-2 border-orange-100 p-8 hover:transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
            <FiTrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-orange-700 mb-1">Avg Points/Match</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {playerStats.average_points_per_match.toFixed(1)}
            </p>
            <p className="text-sm text-green-600 font-bold">
              +{playerStats.point_differential}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsOverviewCards