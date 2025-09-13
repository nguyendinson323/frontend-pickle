import React from 'react'
import { AdminStats } from '../../../store/slices/adminDashboardSlice'

interface StatCard {
  label: string
  value: number
  icon: string
  color: string
}

interface AdminStatsGridProps {
  stats: AdminStats
}

const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({ stats }) => {
  const statCards: StatCard[] = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-600' },
    { label: 'Active Users', value: stats.activeUsers, icon: '🏓', color: 'bg-green-600' },
    { label: 'Total Payments', value: stats.totalPayments, icon: '💰', color: 'bg-purple-600' },
    { label: 'Monthly Revenue', value: stats.monthlyRevenue, icon: '📈', color: 'bg-orange-600' },
    { label: 'Total Tournaments', value: stats.totalTournaments, icon: '🏆', color: 'bg-yellow-600' },
    { label: 'Active Tournaments', value: stats.activeTournaments, icon: '🏛️', color: 'bg-red-600' },
    { label: 'Total Courts', value: stats.totalCourts, icon: '🎾', color: 'bg-indigo-600' },
    { label: 'Active Courts', value: stats.activeCourts, icon: '⚡', color: 'bg-teal-600' },
    { label: 'Total Messages', value: stats.totalMessages, icon: '📧', color: 'bg-slate-600' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: '📬', color: 'bg-pink-600' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
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