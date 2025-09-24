import React from 'react'
import {
  FiCheckCircle,
  FiX,
  FiAlertTriangle,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiTarget
} from 'react-icons/fi'

interface CoachMembershipHeaderProps {
  membershipStatus: string
  daysRemaining: number
  totalSpent: number
  membershipSince: string | null
  totalEarnings: number
  studentsCount: number
  sessionsCompleted: number
}

const CoachMembershipHeader: React.FC<CoachMembershipHeaderProps> = ({
  membershipStatus,
  daysRemaining,
  totalSpent,
  membershipSince,
  totalEarnings,
  studentsCount,
  sessionsCompleted
}) => {
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return {
          icon: <FiCheckCircle className="w-6 h-6" />,
          gradient: 'from-green-600 to-emerald-700',
          bgColor: 'from-green-50 to-emerald-50',
          borderColor: 'border-green-200'
        }
      case 'expired':
        return {
          icon: <FiX className="w-6 h-6" />,
          gradient: 'from-red-600 to-pink-700',
          bgColor: 'from-red-50 to-pink-50',
          borderColor: 'border-red-200'
        }
      case 'canceled':
        return {
          icon: <FiAlertTriangle className="w-6 h-6" />,
          gradient: 'from-yellow-600 to-amber-700',
          bgColor: 'from-yellow-50 to-amber-50',
          borderColor: 'border-yellow-200'
        }
      default:
        return {
          icon: <FiAward className="w-6 h-6" />,
          gradient: 'from-gray-600 to-gray-700',
          bgColor: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-200'
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

  const statusDisplay = getStatusDisplay(membershipStatus)

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8 mb-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coach Membership</h1>
          <p className="text-gray-600 font-medium">
            Manage your coaching membership and track your performance
          </p>
        </div>
        <div className={`bg-gradient-to-r ${statusDisplay.bgColor} border ${statusDisplay.borderColor} rounded-2xl px-6 py-3 flex items-center shadow-lg`}>
          <div className={`bg-gradient-to-r ${statusDisplay.gradient} rounded-xl p-2 text-white mr-3`}>
            {statusDisplay.icon}
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900 capitalize">{membershipStatus}</div>
            <div className="text-sm font-medium text-gray-600">Membership Status</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {membershipStatus === 'active' ? daysRemaining : '0'}
              </div>
              <div className="text-sm font-bold text-blue-700">Days Remaining</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-50 border border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</div>
              <div className="text-sm font-bold text-purple-700">Membership Spent</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center">
              <FiAward className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {membershipSince ? formatDate(membershipSince) : 'N/A'}
              </div>
              <div className="text-sm font-bold text-indigo-700">Coach Since</div>
            </div>
          </div>
        </div>
      </div>

      {/* Coaching Performance Stats */}
      <div className="border-t-2 border-gray-200 pt-8">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-4">
            <FiTrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Coaching Performance</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiDollarSign className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">${totalEarnings.toFixed(2)}</div>
            <div className="text-sm font-bold text-green-700">Total Earnings</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiUsers className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{studentsCount}</div>
            <div className="text-sm font-bold text-orange-700">Students Taught</div>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiTarget className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{sessionsCompleted}</div>
            <div className="text-sm font-bold text-teal-700">Sessions Completed</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachMembershipHeader