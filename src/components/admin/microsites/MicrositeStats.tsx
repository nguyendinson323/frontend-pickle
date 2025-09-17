import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import {
  FiGlobe,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUsers,
  FiUserCheck,
  FiMapPin,
  FiBarChart2,
  FiEye,
  FiTrendingUp,
  FiLoader
} from 'react-icons/fi'

const MicrositeStats: React.FC = () => {
  const { micrositeStats, loading } = useSelector((state: RootState) => state.adminMicrosites)

  const stats = [
    {
      label: 'Total Microsites',
      value: micrositeStats.totalMicrosites,
      icon: FiGlobe,
      color: 'from-blue-500 to-blue-600',
      bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      change: '+5%',
      changeType: 'increase'
    },
    {
      label: 'Active',
      value: micrositeStats.activeMicrosites,
      icon: FiCheckCircle,
      color: 'from-green-500 to-green-600',
      bgGradient: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
      change: '+12%',
      changeType: 'increase'
    },
    {
      label: 'Inactive',
      value: micrositeStats.inactiveMicrosites,
      icon: FiXCircle,
      color: 'from-gray-500 to-gray-600',
      bgGradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
      borderColor: 'border-gray-200',
      change: '-8%',
      changeType: 'decrease'
    },
    {
      label: 'Pending Approval',
      value: micrositeStats.pendingApprovalMicrosites,
      icon: FiClock,
      color: 'from-yellow-500 to-yellow-600',
      bgGradient: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      change: '+3%',
      changeType: 'increase'
    },
    {
      label: 'Club Sites',
      value: micrositeStats.clubMicrosites,
      icon: FiUsers,
      color: 'from-purple-500 to-purple-600',
      bgGradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      change: '+7%',
      changeType: 'increase'
    },
    {
      label: 'Partner Sites',
      value: micrositeStats.partnerMicrosites,
      icon: FiUserCheck,
      color: 'from-indigo-500 to-indigo-600',
      bgGradient: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200',
      change: '+15%',
      changeType: 'increase'
    },
    {
      label: 'State Sites',
      value: micrositeStats.stateMicrosites,
      icon: FiMapPin,
      color: 'from-orange-500 to-orange-600',
      bgGradient: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      change: '+2%',
      changeType: 'increase'
    },
    {
      label: 'Avg Content Score',
      value: micrositeStats.averageContentScore.toFixed(1),
      icon: FiBarChart2,
      color: 'from-cyan-500 to-cyan-600',
      bgGradient: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
      borderColor: 'border-cyan-200',
      change: '+4%',
      changeType: 'increase'
    },
    {
      label: 'Total Page Views',
      value: micrositeStats.totalPageViews.toLocaleString(),
      icon: FiEye,
      color: 'from-pink-500 to-pink-600',
      bgGradient: 'bg-gradient-to-br from-pink-50 to-pink-100',
      borderColor: 'border-pink-200',
      change: '+18%',
      changeType: 'increase'
    },
    {
      label: 'Avg Monthly Visitors',
      value: Math.round(micrositeStats.averageMonthlyVisitors).toLocaleString(),
      icon: FiTrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgGradient: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      change: '+25%',
      changeType: 'increase'
    }
  ]

  if (loading) {
    return (
      <div className="mb-8">
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <FiLoader className="animate-spin mr-2 h-5 w-5" />
              Microsite Statistics
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded-xl w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded-xl w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded-xl w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FiBarChart2 className="mr-2 h-5 w-5" />
            Microsite Statistics
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div
                  key={index}
                  className={`relative p-6 rounded-2xl border-2 ${stat.borderColor} ${stat.bgGradient} transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">{stat.label}</div>
                  <div className={`flex items-center text-xs font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <FiTrendingUp className={`mr-1 h-3 w-3 ${
                      stat.changeType === 'decrease' ? 'transform rotate-180' : ''
                    }`} />
                    {stat.change} from last week
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MicrositeStats