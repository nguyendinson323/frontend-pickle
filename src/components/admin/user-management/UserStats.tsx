import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiCheckCircle,
  FiStar,
  FiTarget,
  FiAward,
  FiHome,
  FiLink,
  FiMap,
  FiBarChart,
  FiTrendingUp
} from 'react-icons/fi'

const UserStats: React.FC = () => {
  const { userStats } = useSelector((state: RootState) => state.adminUserManagement)

  const statsConfig = [
    {
      label: 'Total Users',
      value: userStats.totalUsers,
      icon: FiUsers,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Active Users',
      value: userStats.activeUsers,
      icon: FiUserCheck,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-emerald-100',
      borderColor: 'border-green-200'
    },
    {
      label: 'Inactive Users',
      value: userStats.inactiveUsers,
      icon: FiUserX,
      gradient: 'from-gray-500 to-gray-600',
      bgGradient: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-200'
    },
    {
      label: 'Suspended Users',
      value: userStats.suspendedUsers,
      icon: FiShield,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      borderColor: 'border-red-200'
    },
    {
      label: 'Verified Users',
      value: userStats.verifiedUsers,
      icon: FiCheckCircle,
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200'
    },
    {
      label: 'Premium Users',
      value: userStats.premiumUsers,
      icon: FiStar,
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-100',
      borderColor: 'border-yellow-200'
    },
  ]

  const roleStatsConfig = [
    {
      label: 'Players',
      value: userStats.playerCount,
      icon: FiTarget,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Coaches',
      value: userStats.coachCount,
      icon: FiAward,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      label: 'Clubs',
      value: userStats.clubCount,
      icon: FiHome,
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200'
    },
    {
      label: 'Partners',
      value: userStats.partnerCount,
      icon: FiLink,
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-100',
      borderColor: 'border-yellow-200'
    },
    {
      label: 'States',
      value: userStats.stateCount,
      icon: FiMap,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-emerald-100',
      borderColor: 'border-green-200'
    },
  ]

  return (
    <div className="mb-8">
      {/* General User Statistics */}
      <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 p-8 mb-6">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4">
            <FiBarChart className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">User Statistics</h3>
            <p className="text-gray-600 font-medium">Overview of all user accounts and activity</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {statsConfig.map((stat) => {
            const IconComponent = stat.icon
            return (
              <div
                key={stat.label}
                className={`bg-gradient-to-r ${stat.bgGradient} border-2 ${stat.borderColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="text-right">
                    <FiTrendingUp className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm font-bold text-gray-600">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Role-based Statistics */}
      <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 p-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4">
            <FiUsers className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Users by Role</h3>
            <p className="text-gray-600 font-medium">Distribution of users across different role types</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {roleStatsConfig.map((stat) => {
            const IconComponent = stat.icon
            return (
              <div
                key={stat.label}
                className={`bg-gradient-to-r ${stat.bgGradient} border-2 ${stat.borderColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="text-right">
                    <FiTrendingUp className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm font-bold text-gray-600">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default UserStats