import React from 'react'

interface StateData {
  stats: {
    totalPlayers: number
    totalClubs: number
    totalPartners: number
    totalCoaches: number
    totalCourts: number
    activePlayers: number
    verifiedPlayers: number
    tournamentsThisYear: number
    activeTournaments: number
    playerGrowth: number
    clubGrowth: number
    newClubs: number
    tournamentParticipation: number
    nationalRanking: number
  }
}

interface StateStatsGridProps {
  stateData: StateData
}

const StateStatsGrid: React.FC<StateStatsGridProps> = ({ stateData }) => {
  const stats = [
    { 
      label: 'Total Players', 
      value: stateData.stats.totalPlayers, 
      icon: '👥', 
      color: 'bg-blue-600',
      subtitle: `${stateData.stats.activePlayers} active`
    },
    { 
      label: 'Active Clubs', 
      value: stateData.stats.totalClubs, 
      icon: '🏢', 
      color: 'bg-purple-600',
      subtitle: `+${stateData.stats.newClubs} this month`
    },
    { 
      label: 'Total Courts', 
      value: stateData.stats.totalCourts, 
      icon: '🎾', 
      color: 'bg-indigo-600',
      subtitle: 'Available courts'
    },
    { 
      label: 'Tournaments', 
      value: stateData.stats.tournamentsThisYear, 
      icon: '🏆', 
      color: 'bg-yellow-600',
      subtitle: `${stateData.stats.activeTournaments} active`
    },
    { 
      label: 'Partners', 
      value: stateData.stats.totalPartners, 
      icon: '🤝', 
      color: 'bg-green-600',
      subtitle: 'Business partners'
    },
    { 
      label: 'Coaches', 
      value: stateData.stats.totalCoaches, 
      icon: '👨‍🏫', 
      color: 'bg-red-600',
      subtitle: 'Certified coaches'
    },
    { 
      label: 'Player Growth', 
      value: `${stateData.stats.playerGrowth > 0 ? '+' : ''}${stateData.stats.playerGrowth}%`, 
      icon: stateData.stats.playerGrowth >= 0 ? '📈' : '📉', 
      color: stateData.stats.playerGrowth >= 0 ? 'bg-emerald-600' : 'bg-orange-600',
      subtitle: 'Last 30 days'
    },
    { 
      label: 'State Ranking', 
      value: `#${stateData.stats.nationalRanking}`, 
      icon: '🏅', 
      color: 'bg-amber-600',
      subtitle: 'National position'
    }
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
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StateStatsGrid