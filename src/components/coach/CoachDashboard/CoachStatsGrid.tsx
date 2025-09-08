import React from 'react'
import { CoachDashboard } from '../../../types'

interface StatCard {
  label: string
  value: string | number
  icon: string
  color: string
}

interface CoachStatsGridProps {
  stats: CoachDashboard['stats']
}

const CoachStatsGrid: React.FC<CoachStatsGridProps> = ({ stats }) => {
  const statCards: StatCard[] = [
    { label: 'Total Sessions', value: stats.totalSessions, icon: '📅', color: 'bg-blue-600' },
    { label: 'Active Certifications', value: stats.activeCertifications, icon: '🎓', color: 'bg-green-600' },
    { label: 'Monthly Sessions', value: '12', icon: '🏓', color: 'bg-purple-600' }, // Would come from API
    { label: 'Average Rating', value: '4.8/5', icon: '⭐', color: 'bg-yellow-600' } // Would come from API
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