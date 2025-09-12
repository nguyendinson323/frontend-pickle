import React from 'react'

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
    { label: 'Tournament Wins', value: playerData.tournamentWins, icon: '🏆', color: 'bg-yellow-600' },
    { label: 'Matches Played', value: playerData.totalMatches, icon: '🏓', color: 'bg-blue-600' },
    { label: 'Current Ranking', value: playerData.currentRanking > 0 ? `#${playerData.currentRanking}` : 'Unranked', icon: '📊', color: 'bg-purple-600' },
    { label: 'NRTP Level', value: profile.nrtpLevel, icon: '⭐', color: 'bg-green-600' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3 text-white text-2xl`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlayerStatsGrid