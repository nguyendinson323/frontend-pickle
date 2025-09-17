import React from 'react'
import {
  FiTrendingUp,
  FiRefreshCw,
  FiClock,
  FiCheck,
  FiDollarSign,
  FiStar,
  FiShield,
  FiActivity
} from 'react-icons/fi'

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
    <div className="bg-gradient-to-r from-white to-blue-50 border border-blue-200 rounded-3xl shadow-2xl p-8 mb-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center">
            <FiShield className="h-10 w-10 mr-4 text-blue-600" />
            Club Membership
          </h1>
          <p className="text-gray-600 mt-3 font-medium text-lg">
            {clubInfo?.name ? `Manage ${clubInfo.name}'s membership and unlock premium features` : 'Manage your club membership and unlock premium features'}
          </p>
        </div>
        <div className="flex space-x-4">
          {stats?.status === 'active' ? (
            <button
              onClick={onUpgradeClick}
              className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white px-6 py-3 rounded-2xl flex items-center font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105"
            >
              <FiTrendingUp className="w-5 h-5 mr-2" />
              Upgrade Plan
            </button>
          ) : (
            <button
              onClick={onRenewClick}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 py-3 rounded-2xl flex items-center font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105"
            >
              <FiRefreshCw className="w-5 h-5 mr-2" />
              Renew Membership
            </button>
          )}
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center mb-3">
              <FiClock className="h-6 w-6 text-blue-600 mr-2" />
              <div className="text-sm font-bold text-blue-800">Days Remaining</div>
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.days_remaining}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-indigo-100 border-2 border-purple-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center mb-3">
              <FiActivity className="h-6 w-6 text-purple-600 mr-2" />
              <div className="text-sm font-bold text-purple-800">Membership Status</div>
            </div>
            <div className={`text-xl font-bold capitalize px-3 py-2 rounded-xl border-2 ${getStatusColor(stats.status)} ${
              stats.status === 'active' ? 'border-green-300' :
              stats.status === 'expired' ? 'border-red-300' :
              stats.status === 'canceled' ? 'border-yellow-300' : 'border-gray-300'
            }`}>
              {stats.status === 'active' && <FiCheck className="inline h-4 w-4 mr-1" />}
              {stats.status}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center mb-3">
              <FiDollarSign className="h-6 w-6 text-green-600 mr-2" />
              <div className="text-sm font-bold text-green-800">Total Spent</div>
            </div>
            <div className="text-3xl font-bold text-green-600">{formatPrice(stats.total_spent)}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 border-2 border-yellow-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center mb-3">
              <FiStar className="h-6 w-6 text-yellow-600 mr-2" />
              <div className="text-sm font-bold text-yellow-800">Plan Type</div>
            </div>
            <div className={`text-2xl font-bold flex items-center ${stats.has_premium ? 'text-yellow-600' : 'text-gray-600'}`}>
              {stats.has_premium && <FiStar className="h-6 w-6 mr-2" />}
              {stats.has_premium ? 'Premium' : 'Basic'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MembershipHeader