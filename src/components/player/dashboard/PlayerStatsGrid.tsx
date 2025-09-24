import React from 'react'
import {
  FiAward,
  FiActivity,
  FiBarChart2,
  FiStar
} from 'react-icons/fi'

interface PlayerData {
  tournamentWins: number
  totalMatches: number
  currentRanking: number
}

interface PlayerProfile {
  nrtpLevel: string
}

interface PlayerStatsGridProps {
  playerData: PlayerData
  profile: PlayerProfile
}

const PlayerStatsGrid: React.FC<PlayerStatsGridProps> = ({ playerData, profile }) => {
  const stats = [
    { label: 'Tournament Wins', value: playerData.tournamentWins, icon: FiAward, color: 'from-yellow-500 to-orange-600', bgColor: 'bg-yellow-50', textColor: 'text-yellow-800', iconBg: 'from-yellow-500 to-orange-600' },
    { label: 'Matches Played', value: playerData.totalMatches, icon: FiActivity, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-800', iconBg: 'from-blue-500 to-indigo-600' },
    { label: 'Current Ranking', value: playerData.currentRanking > 0 ? `#${playerData.currentRanking}` : 'Unranked', icon: FiBarChart2, color: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-50', textColor: 'text-purple-800', iconBg: 'from-purple-500 to-pink-600' },
    { label: 'NRTP Level', value: profile.nrtpLevel, icon: FiStar, color: 'from-green-500 to-emerald-600', bgColor: 'bg-green-50', textColor: 'text-green-800', iconBg: 'from-green-500 to-emerald-600' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const IconComponent = stat.icon
        return (
          <div
            key={stat.label}
            className={`${stat.bgColor} rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-white hover:transform hover:scale-105`}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${stat.textColor} mb-1`}>{stat.value}</p>
                </div>
              </div>
              <div>
                <p className={`text-sm font-bold ${stat.textColor} opacity-80`}>{stat.label}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PlayerStatsGrid