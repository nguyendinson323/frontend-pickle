import React from 'react'
import { PlayerStats } from '../../../store/slices/playerRankingsSlice'

interface StatsOverviewCardsProps {
  playerStats: PlayerStats | null
}

const StatsOverviewCards: React.FC<StatsOverviewCardsProps> = ({
  playerStats
}) => {
  if (!playerStats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="text-2xl text-green-600 mr-3">🏆</div>
          <div>
            <p className="text-sm font-medium text-gray-500">Win Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {playerStats.win_percentage.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">
              {playerStats.wins}W - {playerStats.losses}L
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="text-2xl text-blue-600 mr-3">📊</div>
          <div>
            <p className="text-sm font-medium text-gray-500">Current Streak</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.abs(playerStats.current_streak)}
            </p>
            <p className="text-sm text-gray-500">
              {playerStats.current_streak >= 0 ? 'Wins' : 'Losses'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="text-2xl text-purple-600 mr-3">🎾</div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tournaments</p>
            <p className="text-2xl font-bold text-gray-900">
              {playerStats.tournament_wins}
            </p>
            <p className="text-sm text-gray-500">
              of {playerStats.total_tournaments} won
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="text-2xl text-orange-600 mr-3">🔥</div>
          <div>
            <p className="text-sm font-medium text-gray-500">Avg Points/Match</p>
            <p className="text-2xl font-bold text-gray-900">
              {playerStats.average_points_per_match.toFixed(1)}
            </p>
            <p className="text-sm text-gray-500">
              +{playerStats.point_differential}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsOverviewCards