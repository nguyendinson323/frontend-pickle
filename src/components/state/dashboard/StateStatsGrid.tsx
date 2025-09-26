import React from 'react'
import { FiUsers, FiAward, FiTarget, FiTrendingUp, FiUserCheck, FiMapPin } from 'react-icons/fi'

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
      icon: FiUsers,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'from-blue-50 to-blue-100',
      subtitle: `${stateData.stats.activePlayers} active`
    },
    {
      label: 'Active Clubs',
      value: stateData.stats.totalClubs,
      icon: FiMapPin,
      color: 'from-purple-600 to-purple-700',
      bgColor: 'from-purple-50 to-purple-100',
      subtitle: `+${stateData.stats.newClubs} this month`
    },
    {
      label: 'Total Courts',
      value: stateData.stats.totalCourts,
      icon: FiTarget,
      color: 'from-indigo-600 to-indigo-700',
      bgColor: 'from-indigo-50 to-indigo-100',
      subtitle: 'Available courts'
    },
    {
      label: 'Tournaments',
      value: stateData.stats.tournamentsThisYear,
      icon: FiAward,
      color: 'from-yellow-600 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-100',
      subtitle: `${stateData.stats.activeTournaments} active`
    },
    {
      label: 'Partners',
      value: stateData.stats.totalPartners,
      icon: FiUserCheck,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-100',
      subtitle: 'Business partners'
    },
    {
      label: 'Coaches',
      value: stateData.stats.totalCoaches,
      icon: FiUsers,
      color: 'from-red-600 to-pink-600',
      bgColor: 'from-red-50 to-pink-100',
      subtitle: 'Certified coaches'
    },
    {
      label: 'Player Growth',
      value: `${stateData.stats.playerGrowth > 0 ? '+' : ''}${stateData.stats.playerGrowth}%`,
      icon: FiTrendingUp,
      color: stateData.stats.playerGrowth >= 0 ? 'from-emerald-600 to-green-600' : 'from-orange-600 to-red-600',
      bgColor: stateData.stats.playerGrowth >= 0 ? 'from-emerald-50 to-green-100' : 'from-orange-50 to-red-100',
      subtitle: 'Last 30 days'
    },
    {
      label: 'State Ranking',
      value: `#${stateData.stats.nationalRanking}`,
      icon: FiAward,
      color: 'from-amber-600 to-yellow-600',
      bgColor: 'from-amber-50 to-yellow-100',
      subtitle: 'National position'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const IconComponent = stat.icon
        return (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.bgColor} rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden border-2 border-white hover:scale-105 transform`}
          >
            <div className="p-8">
              <div className="flex items-center mb-4">
                <div className={`bg-gradient-to-r ${stat.color} rounded-2xl p-4 text-white shadow-xl`}>
                  <IconComponent className="w-8 h-8" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-sm text-gray-600 font-medium">{stat.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StateStatsGrid