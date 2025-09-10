import React from 'react'

interface ClubStats {
  totalMembers: number
  totalCourts: number
  activeTournaments: number
  monthlyRevenue: number
  memberGrowth: number
  memberSatisfaction: number
  todaysBookings: number
  weeklyUsage: number
}

interface StatCard {
  label: string
  value: string | number
  icon: string
  color: string
}

interface ClubStatsGridProps {
  stats: ClubStats
}

const ClubStatsGrid: React.FC<ClubStatsGridProps> = ({ stats }) => {
  const statCards: StatCard[] = [
    { label: 'Active Members', value: stats.totalMembers, icon: '👥', color: 'bg-purple-600' },
    { label: 'Registered Courts', value: stats.totalCourts, icon: '🎾', color: 'bg-green-600' },
    { label: 'Active Tournaments', value: stats.activeTournaments, icon: '🏆', color: 'bg-yellow-600' },
    { label: 'Monthly Revenue', value: `$${stats.monthlyRevenue.toFixed(2)}`, icon: '💰', color: 'bg-blue-600' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => (
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

export default ClubStatsGrid