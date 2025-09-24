import React from 'react'
import { CoachStats } from '../../../store/slices/coachDashboardSlice'
import {
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiStar,
  FiClipboard,
  FiAward,
  FiCheckCircle,
  FiTarget
} from 'react-icons/fi'

interface StatCard {
  label: string
  value: string | number
  icon: React.ReactElement
  gradient: string
  bgColor: string
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
      icon: <FiCalendar className="w-6 h-6" />,
      gradient: 'from-blue-600 to-blue-700',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      label: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      icon: <FiDollarSign className="w-6 h-6" />,
      gradient: 'from-green-600 to-emerald-700',
      bgColor: 'from-green-50 to-emerald-100'
    },
    {
      label: 'Active Students',
      value: stats.activeStudents,
      icon: <FiUsers className="w-6 h-6" />,
      gradient: 'from-purple-600 to-purple-700',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      label: 'Average Rating',
      value: stats.averageRating > 0 ? `${stats.averageRating}/5` : 'N/A',
      icon: <FiStar className="w-6 h-6" />,
      gradient: 'from-yellow-500 to-amber-600',
      bgColor: 'from-yellow-50 to-amber-100'
    },
    {
      label: 'Upcoming Sessions',
      value: stats.upcomingSessionsCount,
      icon: <FiClipboard className="w-6 h-6" />,
      gradient: 'from-indigo-600 to-purple-700',
      bgColor: 'from-indigo-50 to-purple-100'
    },
    {
      label: 'Active Certifications',
      value: stats.activeCertifications,
      icon: <FiAward className="w-6 h-6" />,
      gradient: 'from-emerald-600 to-teal-700',
      bgColor: 'from-emerald-50 to-teal-100'
    },
    {
      label: 'Completed Sessions',
      value: stats.completedSessions,
      icon: <FiCheckCircle className="w-6 h-6" />,
      gradient: 'from-teal-600 to-cyan-700',
      bgColor: 'from-teal-50 to-cyan-100'
    },
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: <FiTarget className="w-6 h-6" />,
      gradient: 'from-orange-600 to-red-600',
      bgColor: 'from-orange-50 to-red-100'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className={`bg-gradient-to-br ${stat.bgColor} border border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:transform hover:scale-105`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-4 text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm font-bold text-gray-600">{stat.label}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${stat.gradient} transform transition-transform duration-1000 group-hover:translate-x-0 -translate-x-full`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CoachStatsGrid