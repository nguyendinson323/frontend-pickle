import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import {
  FiUsers,
  FiUserCheck,
  FiAward,
  FiActivity,
  FiTarget,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiLoader
} from 'react-icons/fi'

const ReportStats: React.FC = () => {
  const { reportStats } = useSelector((state: RootState) => state.adminReports)
  const { isLoading: loading } = useSelector((state: RootState) => state.loading)


  const stats = [
    {
      label: 'Total Users',
      value: reportStats.systemMetrics?.totalUsers || 0,
      icon: FiUsers,
      iconColor: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Active Users',
      value: reportStats.systemMetrics?.activeUsers || 0,
      icon: FiUserCheck,
      iconColor: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200'
    },
    {
      label: 'Total Tournaments',
      value: reportStats.systemMetrics?.totalTournaments || 0,
      icon: FiAward,
      iconColor: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      label: 'Active Tournaments',
      value: reportStats.systemMetrics?.activeTournaments || 0,
      icon: FiActivity,
      iconColor: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200'
    },
    {
      label: 'Total Courts',
      value: reportStats.systemMetrics?.totalCourts || 0,
      icon: FiTarget,
      iconColor: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200'
    },
    {
      label: 'Total Payments',
      value: reportStats.systemMetrics?.totalPayments || 0,
      icon: FiDollarSign,
      iconColor: 'from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200'
    },
    {
      label: 'Total Revenue',
      value: `$${(reportStats.systemMetrics?.totalRevenue || 0).toLocaleString()}`,
      icon: FiTrendingUp,
      iconColor: 'from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200'
    },
    {
      label: 'Ranked Players',
      value: reportStats.systemMetrics?.totalRankedPlayers || 0,
      icon: FiTrendingDown,
      iconColor: 'from-cyan-500 to-cyan-600',
      textColor: 'text-cyan-600',
      bgColor: 'from-cyan-50 to-cyan-100',
      borderColor: 'border-cyan-200'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <FiLoader className="animate-spin h-6 w-6 text-gray-400" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const StatIcon = stat.icon
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl border-2 ${stat.borderColor} p-6 shadow-lg transform hover:scale-105 transition-all duration-200`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.iconColor} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                <StatIcon className="h-6 w-6" />
              </div>
              <div className={`px-3 py-1 rounded-xl text-xs font-bold ${stat.textColor} bg-white bg-opacity-70 border-2 ${stat.borderColor}`}>
                LIVE DATA
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.textColor} mb-1`}>
                {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
              </p>
              <div className="flex items-center">
                <FiTrendingUp className={`h-4 w-4 mr-1 ${stat.textColor}`} />
                <span className={`text-sm font-bold ${stat.textColor}`}>Updated now</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ReportStats