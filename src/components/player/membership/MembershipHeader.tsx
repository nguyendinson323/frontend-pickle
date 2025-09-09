import React from 'react'

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
        <h1 className="text-2xl font-bold text-gray-900">My Membership</h1>
        <div className="text-sm text-gray-500">
          Manage your federation membership and subscription
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {membershipSince ? formatDate(membershipSince) : 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Member Since</div>
        </div>
      </div>
    </div>
  )
}

export default MembershipHeader