import React from 'react'
import { AdminDashboard } from '../../../types'

interface StatCard {
  label: string
  value: number
  icon: string
  color: string
}

interface AdminStatsGridProps {
  stats: AdminDashboard['stats']
}

const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({ stats }) => {
  const statCards: StatCard[] = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-600' },
    { label: 'Active Players', value: stats.totalPlayers, icon: '🏓', color: 'bg-green-600' },
    { label: 'Registered Coaches', value: stats.totalClubs, icon: '👨‍🏫', color: 'bg-purple-600' },
    { label: 'Active Clubs', value: stats.totalClubs, icon: '🏢', color: 'bg-orange-600' },
    { label: 'Business Partners', value: stats.totalPartners, icon: '🏨', color: 'bg-yellow-600' },
    { label: 'State Committees', value: stats.totalStates, icon: '🏛️', color: 'bg-red-600' },
    { label: 'Total Tournaments', value: stats.totalTournaments, icon: '🏆', color: 'bg-indigo-600' },
    { label: 'Active Courts', value: stats.totalCourts, icon: '🎾', color: 'bg-teal-600' }
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
                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminStatsGrid