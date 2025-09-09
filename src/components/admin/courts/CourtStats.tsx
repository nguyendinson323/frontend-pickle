import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const CourtStats: React.FC = () => {
  const { courtStats } = useSelector((state: RootState) => state.adminCourts)

  const statsConfig = [
    { 
      label: 'Total Courts', 
      value: courtStats.totalCourts, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: '🎾'
    },
    { 
      label: 'Available', 
      value: courtStats.availableCourts, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: '✅'
    },
    { 
      label: 'Occupied', 
      value: courtStats.occupiedCourts, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: '🏓'
    },
    { 
      label: 'Maintenance', 
      value: courtStats.maintenanceCourts, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: '🔧'
    },
    { 
      label: 'Total Reservations', 
      value: courtStats.totalReservations, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      icon: '📅'
    },
    { 
      label: 'Total Revenue', 
      value: `$${courtStats.totalRevenue.toLocaleString()}`, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      icon: '💰',
      isText: true
    },
  ]

  const utilizationRate = courtStats.totalCourts > 0 
    ? Math.round((courtStats.occupiedCourts / courtStats.totalCourts) * 100) 
    : 0

  return (
    <div className="mb-6">
      {/* Main Statistics */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Court System Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statsConfig.map((stat) => (
            <div
              key={stat.label}
              className={`p-4 rounded-lg border ${stat.bgColor} ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <div className={`text-xl font-bold ${stat.color}`}>
                  {stat.isText ? stat.value : typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">📊</span>
            <div className="text-lg font-bold text-teal-600">
              {utilizationRate}%
            </div>
          </div>
          <div className="text-sm text-gray-600">Current Utilization</div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teal-600 h-2 rounded-full" 
                style={{ width: `${utilizationRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">📈</span>
            <div className="text-lg font-bold text-orange-600">
              {courtStats.averageUtilization}
            </div>
          </div>
          <div className="text-sm text-gray-600">Avg. Utilization</div>
          <div className="text-xs text-gray-500 mt-1">
            Per court per day
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">🏆</span>
            <div className="text-sm font-bold text-yellow-600 truncate">
              {courtStats.topPerformingCourt || 'N/A'}
            </div>
          </div>
          <div className="text-sm text-gray-600">Top Performing</div>
          <div className="text-xs text-gray-500 mt-1">
            By revenue
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">⏳</span>
            <div className="text-lg font-bold text-pink-600">
              {courtStats.pendingApprovals}
            </div>
          </div>
          <div className="text-sm text-gray-600">Pending Approvals</div>
          <div className="text-xs text-gray-500 mt-1">
            Require review
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourtStats