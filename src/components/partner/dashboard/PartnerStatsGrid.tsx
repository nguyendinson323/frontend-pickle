import React from 'react'

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
    { label: 'Active Courts', value: partnerData.stats.total_courts || 0, icon: '🎾', color: 'bg-green-600' },
    { label: 'Monthly Bookings', value: partnerData.stats.monthly_bookings || 0, icon: '📅', color: 'bg-blue-600' },
    { label: 'Active Tournaments', value: partnerData.stats.active_tournaments || 0, icon: '🏆', color: 'bg-purple-600' },
    { label: 'Monthly Revenue', value: `$${(partnerData.stats.monthly_revenue || 0).toLocaleString()}`, icon: '💰', color: 'bg-orange-600' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3 text-white text-2xl`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PartnerStatsGrid