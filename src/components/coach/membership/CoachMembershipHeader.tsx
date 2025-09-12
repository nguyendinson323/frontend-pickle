import React from 'react'

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-600'
      case 'expired':
        return 'bg-red-50 text-red-600'
      case 'canceled':
        return 'bg-yellow-50 text-yellow-600'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Coach Membership</h1>
        <div className="text-sm text-gray-500">
          Manage your coaching membership and track your performance
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${getStatusColor(membershipStatus)}`}>
          <div className="text-2xl font-bold capitalize">{membershipStatus}</div>
          <div className="text-sm">Membership Status</div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {membershipStatus === 'active' ? daysRemaining : '0'}
          </div>
          <div className="text-sm text-gray-600">Days Remaining</div>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600">${totalSpent.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Membership Spent</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {membershipSince ? formatDate(membershipSince) : 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Coach Since</div>
        </div>
      </div>

      {/* Coaching Performance Stats */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Coaching Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Earnings</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{studentsCount}</div>
            <div className="text-sm text-gray-600">Students Taught</div>
          </div>
          
          <div className="bg-teal-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-teal-600">{sessionsCompleted}</div>
            <div className="text-sm text-gray-600">Sessions Completed</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachMembershipHeader