import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import {
  FiMapPin,
  FiCheckCircle,
  FiPlay,
  FiTool,
  FiCalendar,
  FiDollarSign,
  FiBarChart,
  FiTrendingUp,
  FiAward,
  FiClock
} from 'react-icons/fi'

const CourtStats: React.FC = () => {
  const { courtStats } = useSelector((state: RootState) => state.adminCourts)

  const statsConfig = [
    {
      label: 'Total Courts',
      value: courtStats.totalCourts,
      color: 'from-blue-500 to-blue-600',
      bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
      icon: FiMapPin,
      change: '+2%',
      changeType: 'increase'
    },
    {
      label: 'Available',
      value: courtStats.availableCourts,
      color: 'from-green-500 to-green-600',
      bgGradient: 'bg-gradient-to-br from-green-50 to-green-100',
      icon: FiCheckCircle,
      change: '+5%',
      changeType: 'increase'
    },
    {
      label: 'Occupied',
      value: courtStats.occupiedCourts,
      color: 'from-orange-500 to-orange-600',
      bgGradient: 'bg-gradient-to-br from-orange-50 to-orange-100',
      icon: FiPlay,
      change: '+12%',
      changeType: 'increase'
    },
    {
      label: 'Maintenance',
      value: courtStats.maintenanceCourts,
      color: 'from-red-500 to-red-600',
      bgGradient: 'bg-gradient-to-br from-red-50 to-red-100',
      icon: FiTool,
      change: '-3%',
      changeType: 'decrease'
    },
    {
      label: 'Total Reservations',
      value: courtStats.totalReservations,
      color: 'from-purple-500 to-purple-600',
      bgGradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
      icon: FiCalendar,
      change: '+18%',
      changeType: 'increase'
    },
    {
      label: 'Total Revenue',
      value: `$${courtStats.totalRevenue.toLocaleString()}`,
      color: 'from-emerald-500 to-emerald-600',
      bgGradient: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      icon: FiDollarSign,
      isText: true,
      change: '+24%',
      changeType: 'increase'
    },
  ]

  const utilizationRate = courtStats.totalCourts > 0 
    ? Math.round((courtStats.occupiedCourts / courtStats.totalCourts) * 100) 
    : 0

  const getChangeIcon = (changeType: string) => {
    return changeType === 'increase' ?
      <FiTrendingUp className="w-3 h-3 text-green-500" /> :
      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 15.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
  }

  return (
    <div className="mb-8">
      {/* Main Statistics */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Court System Overview</h3>
          <p className="text-sm text-gray-600 mt-1">Real-time statistics and performance metrics</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {statsConfig.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div
                  key={stat.label}
                  className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 ${stat.bgGradient} opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      {stat.change && (
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          stat.changeType === 'increase'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {getChangeIcon(stat.changeType || 'increase')}
                          <span>{stat.change}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                        {stat.label}
                      </h3>
                      <p className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
                        {stat.isText ? stat.value : typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FiBarChart className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-teal-600">
              {utilizationRate}%
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-600">Current Utilization</h4>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-600 h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${utilizationRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">Real-time court occupancy</p>
          </div>
        </div>

        <div className="group bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FiTrendingUp className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {courtStats.averageUtilization}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-600">Avg. Utilization</h4>
            <p className="text-xs text-gray-500">Per court per day</p>
          </div>
        </div>

        <div className="group bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FiAward className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-yellow-600 truncate max-w-20">
              {courtStats.topPerformingCourt || 'N/A'}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-600">Top Performing</h4>
            <p className="text-xs text-gray-500">By revenue generation</p>
          </div>
        </div>

        <div className="group bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FiClock className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-pink-600">
              {courtStats.pendingApprovals}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-600">Pending Approvals</h4>
            <p className="text-xs text-gray-500">Require admin review</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourtStats