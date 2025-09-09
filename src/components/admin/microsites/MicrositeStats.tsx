import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const MicrositeStats: React.FC = () => {
  const { micrositeStats, loading } = useSelector((state: RootState) => state.adminMicrosites)

  const stats = [
    {
      label: 'Total Microsites',
      value: micrositeStats.totalMicrosites,
      icon: '🌐',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Active',
      value: micrositeStats.activeMicrosites,
      icon: '✅',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Inactive',
      value: micrositeStats.inactiveMicrosites,
      icon: '⭕',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      label: 'Pending Approval',
      value: micrositeStats.pendingApprovalMicrosites,
      icon: '⏳',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      label: 'Club Sites',
      value: micrositeStats.clubMicrosites,
      icon: '🏸',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      label: 'Partner Sites',
      value: micrositeStats.partnerMicrosites,
      icon: '🤝',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      label: 'State Sites',
      value: micrositeStats.stateMicrosites,
      icon: '🏛️',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      label: 'Avg Content Score',
      value: micrositeStats.averageContentScore.toFixed(1),
      icon: '📊',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200'
    },
    {
      label: 'Total Page Views',
      value: micrositeStats.totalPageViews.toLocaleString(),
      icon: '👁️',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      label: 'Avg Monthly Visitors',
      value: Math.round(micrositeStats.averageMonthlyVisitors).toLocaleString(),
      icon: '📈',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(10)].map((_, index) => (
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className={`bg-white rounded-lg border ${stat.borderColor} p-6 ${stat.bgColor}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
            <div className="text-2xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MicrositeStats