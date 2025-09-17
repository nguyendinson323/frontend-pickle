import React from 'react'
import {
  FiUsers,
  FiMapPin,
  FiAward,
  FiDollarSign,
  FiTrendingUp
} from 'react-icons/fi'

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
  icon: React.ElementType
  gradient: string
  bgGradient: string
  borderColor: string
}

interface ClubStatsGridProps {
  stats: ClubStats
}

const ClubStatsGrid: React.FC<ClubStatsGridProps> = ({ stats }) => {
  const statCards: StatCard[] = [
    {
      label: 'Active Members',
      value: stats.totalMembers,
      icon: FiUsers,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      label: 'Registered Courts',
      value: stats.totalCourts,
      icon: FiMapPin,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-100',
      borderColor: 'border-green-200'
    },
    {
      label: 'Active Tournaments',
      value: stats.activeTournaments,
      icon: FiAward,
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-100',
      borderColor: 'border-yellow-200'
    },
    {
      label: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toFixed(2)}`,
      icon: FiDollarSign,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-100',
      borderColor: 'border-blue-200'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <div
            key={stat.label}
            className={`bg-gradient-to-r ${stat.bgGradient} border-2 ${stat.borderColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-table-row`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <div className="text-right">
                <FiTrendingUp className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm font-bold text-gray-600">{stat.label}</div>
          </div>
        )
      })}
    </div>
  )
}

export default ClubStatsGrid