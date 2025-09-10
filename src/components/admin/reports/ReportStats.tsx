import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const ReportStats: React.FC = () => {
  const { reportStats } = useSelector((state: RootState) => state.adminReports)
  const { isLoading: loading } = useSelector((state: RootState) => state.loading)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`
    return `${(seconds / 3600).toFixed(1)}h`
  }

  const stats = [
    {
      label: 'Total Users',
      value: reportStats.systemMetrics?.totalUsers || 0,
      icon: '👥',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Active Users',
      value: reportStats.systemMetrics?.activeUsers || 0,
      icon: '✅',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Total Tournaments',
      value: reportStats.systemMetrics?.totalTournaments || 0,
      icon: '🏆',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      label: 'Active Tournaments',
      value: reportStats.systemMetrics?.activeTournaments || 0,
      icon: '🏃',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      label: 'Total Courts',
      value: reportStats.systemMetrics?.totalCourts || 0,
      icon: '🎾',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      label: 'Total Payments',
      value: reportStats.systemMetrics?.totalPayments || 0,
      icon: '💰',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      label: 'Total Revenue',
      value: `$${(reportStats.systemMetrics?.totalRevenue || 0).toLocaleString()}`,
      icon: '💵',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      label: 'Ranked Players',
      value: reportStats.systemMetrics?.totalRankedPlayers || 0,
      icon: '🏅',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className={`bg-white rounded-lg border ${stat.borderColor} p-6 ${stat.bgColor}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
              </p>
            </div>
            <div className="text-2xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReportStats