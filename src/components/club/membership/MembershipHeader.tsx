import React from 'react'

interface MembershipStats {
  total_spent: number
  membership_since: string | null
  days_remaining: number
  status: string
  has_premium: boolean
  premium_expires_at: string | null
  affiliation_expires_at: string | null
  has_courts: boolean
}

interface ClubInfo {
  id: number
  name: string
  has_courts: boolean
  premium_expires_at: string | null
  affiliation_expires_at: string | null
}

interface MembershipHeaderProps {
  clubInfo: ClubInfo | null
  stats: MembershipStats | null
  onUpgradeClick: () => void
  onRenewClick: () => void
}

const MembershipHeader: React.FC<MembershipHeaderProps> = ({
  clubInfo,
  stats,
  onUpgradeClick,
  onRenewClick
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'expired': return 'text-red-600 bg-red-50'
      case 'canceled': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Club Membership</h1>
          <p className="text-gray-600 mt-1">
            {clubInfo?.name ? `Manage ${clubInfo.name}'s membership and unlock premium features` : 'Manage your club membership and unlock premium features'}
          </p>
        </div>
        <div className="flex space-x-3">
          {stats?.status === 'active' ? (
            <button
              onClick={onUpgradeClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Upgrade Plan
            </button>
          ) : (
            <button
              onClick={onRenewClick}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Renew Membership
            </button>
          )}
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.days_remaining}</div>
            <div className="text-sm text-gray-600">Days Remaining</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className={`text-2xl font-bold capitalize px-2 py-1 rounded-lg ${getStatusColor(stats.status)}`}>
              {stats.status}
            </div>
            <div className="text-sm text-gray-600 mt-1">Membership Status</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{formatPrice(stats.total_spent)}</div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className={`text-2xl font-bold ${stats.has_premium ? 'text-yellow-600' : 'text-gray-600'}`}>
              {stats.has_premium ? 'Premium' : 'Basic'}
            </div>
            <div className="text-sm text-gray-600">Plan Type</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MembershipHeader