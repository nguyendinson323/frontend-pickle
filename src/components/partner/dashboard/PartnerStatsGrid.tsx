import React from 'react'
import {
  FiActivity,
  FiCalendar,
  FiAward,
  FiDollarSign
} from 'react-icons/fi'

interface PartnerData {
  stats: {
    total_courts: number
    active_tournaments: number
    monthly_bookings: number
    monthly_revenue: number
    court_utilization?: number
    customer_rating?: number
    repeat_customers?: number
    revenue_growth?: number
    booking_trend?: number
  }
}

interface PartnerStatsGridProps {
  partnerData: PartnerData
}

const PartnerStatsGrid: React.FC<PartnerStatsGridProps> = ({ partnerData }) => {
  const stats = [
    {
      label: 'Active Courts',
      value: partnerData.stats.total_courts || 0,
      icon: <FiActivity className="w-8 h-8" />,
      color: 'from-green-600 to-emerald-700',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Monthly Bookings',
      value: partnerData.stats.monthly_bookings || 0,
      icon: <FiCalendar className="w-8 h-8" />,
      color: 'from-blue-600 to-indigo-700',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Active Tournaments',
      value: partnerData.stats.active_tournaments || 0,
      icon: <FiAward className="w-8 h-8" />,
      color: 'from-purple-600 to-indigo-700',
      bgColor: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200'
    },
    {
      label: 'Monthly Revenue',
      value: `$${(partnerData.stats.monthly_revenue || 0).toLocaleString()}`,
      icon: <FiDollarSign className="w-8 h-8" />,
      color: 'from-orange-600 to-orange-700',
      bgColor: 'from-orange-50 to-orange-50',
      borderColor: 'border-orange-200'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 shadow-md`}
        >
          <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
            {stat.icon}
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
          <div className="text-sm font-bold text-gray-700">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

export default PartnerStatsGrid