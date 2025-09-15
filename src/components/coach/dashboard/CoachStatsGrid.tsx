import React from 'react'
import { CoachStats } from '../../../store/slices/coachDashboardSlice'

interface StatCard {
  label: string
  value: string | number
  icon: string
  color: string
}

interface CoachStatsGridProps {
  stats: CoachStats
}

const CoachStatsGrid: React.FC<CoachStatsGridProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const statCards: StatCard[] = [
    {
      label: 'Total Sessions',
      value: stats.totalSessions,
      icon: '📅',
      color: 'bg-blue-600'
    },
    {
      label: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      icon: '💰',
      color: 'bg-green-600'
    },
    {
      label: 'Active Students',
      value: stats.activeStudents,
      icon: '👥',
      color: 'bg-purple-600'
    },
    {
      label: 'Average Rating',
      value: stats.averageRating > 0 ? `${stats.averageRating}/5` : 'N/A',
      icon: '⭐',
      color: 'bg-yellow-600'
    },
    {
      label: 'Upcoming Sessions',
      value: stats.upcomingSessionsCount,
      icon: '📋',
      color: 'bg-indigo-600'
    },
    {
      label: 'Active Certifications',
      value: stats.activeCertifications,
      icon: '🎓',
      color: 'bg-emerald-600'
    },
    {
      label: 'Completed Sessions',
      value: stats.completedSessions,
      icon: '✅',
      color: 'bg-teal-600'
    },
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: '🎯',
      color: 'bg-orange-600'
    }
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

export default CoachStatsGrid