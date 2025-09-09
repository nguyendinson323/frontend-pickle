import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const UserStats: React.FC = () => {
  const { userStats } = useSelector((state: RootState) => state.adminUserManagement)

  const statsConfig = [
    { 
      label: 'Total Users', 
      value: userStats.totalUsers, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      label: 'Active Users', 
      value: userStats.activeUsers, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    { 
      label: 'Inactive Users', 
      value: userStats.inactiveUsers, 
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    { 
      label: 'Suspended Users', 
      value: userStats.suspendedUsers, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    { 
      label: 'Verified Users', 
      value: userStats.verifiedUsers, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    { 
      label: 'Premium Users', 
      value: userStats.premiumUsers, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
  ]

  const roleStatsConfig = [
    { 
      label: 'Players', 
      value: userStats.playerCount, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      label: 'Coaches', 
      value: userStats.coachCount, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    { 
      label: 'Clubs', 
      value: userStats.clubCount, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    { 
      label: 'Partners', 
      value: userStats.partnerCount, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    { 
      label: 'States', 
      value: userStats.stateCount, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
  ]

  return (
    <div className="mb-6">
      {/* General User Statistics */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">User Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statsConfig.map((stat) => (
            <div
              key={stat.label}
              className={`p-4 rounded-lg border ${stat.bgColor} ${stat.borderColor}`}
            >
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Role-based Statistics */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Users by Role</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {roleStatsConfig.map((stat) => (
            <div
              key={stat.label}
              className={`p-4 rounded-lg border ${stat.bgColor} ${stat.borderColor}`}
            >
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserStats