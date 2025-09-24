import React from 'react'
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiUserCheck,
  FiSettings
} from 'react-icons/fi'

interface MembershipHeaderProps {
  membershipStatus: string
  daysRemaining: number
  totalSpent: number
  membershipSince: string | null
}

const MembershipHeader: React.FC<MembershipHeaderProps> = ({
  membershipStatus,
  daysRemaining,
  totalSpent,
  membershipSince
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          gradient: 'from-green-500 to-emerald-600',
          bgGradient: 'from-green-50 to-emerald-50',
          border: 'border-green-200',
          icon: FiCheckCircle,
          textColor: 'text-green-800'
        }
      case 'expired':
        return {
          gradient: 'from-red-500 to-pink-600',
          bgGradient: 'from-red-50 to-pink-50',
          border: 'border-red-200',
          icon: FiXCircle,
          textColor: 'text-red-800'
        }
      case 'canceled':
        return {
          gradient: 'from-yellow-500 to-orange-600',
          bgGradient: 'from-yellow-50 to-orange-50',
          border: 'border-yellow-200',
          icon: FiAlertCircle,
          textColor: 'text-yellow-800'
        }
      default:
        return {
          gradient: 'from-gray-500 to-gray-600',
          bgGradient: 'from-gray-50 to-slate-50',
          border: 'border-gray-200',
          icon: FiAlertCircle,
          textColor: 'text-gray-800'
        }
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const statusConfig = getStatusConfig(membershipStatus)
  const StatusIcon = statusConfig.icon

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-3xl border-2 border-gray-100 p-8 mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
            <FiUserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Membership</h1>
            <p className="text-gray-600 font-medium">Manage your federation membership and subscription</p>
          </div>
        </div>
        <div className="flex items-center">
          <FiSettings className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-500 font-medium">Dashboard</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`bg-gradient-to-br ${statusConfig.bgGradient} border-2 ${statusConfig.border} rounded-3xl p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${statusConfig.gradient} rounded-2xl flex items-center justify-center`}>
              <StatusIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className={`text-2xl font-bold capitalize ${statusConfig.textColor} mb-1`}>
            {membershipStatus}
          </div>
          <div className="text-sm text-gray-600 font-medium">Membership Status</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <FiClock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-800 mb-1">
            {membershipStatus === 'active' ? daysRemaining : '0'}
          </div>
          <div className="text-sm text-gray-600 font-medium">Days Remaining</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-800 mb-1">${totalSpent.toFixed(2)}</div>
          <div className="text-sm text-gray-600 font-medium">Total Spent</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-orange-800 mb-1">
            {membershipSince ? formatDate(membershipSince) : 'N/A'}
          </div>
          <div className="text-sm text-gray-600 font-medium">Member Since</div>
        </div>
      </div>
    </div>
  )
}

export default MembershipHeader