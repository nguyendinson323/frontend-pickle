import React from 'react'
import {
  BookingMetrics,
  TournamentMetrics,
  CustomerMetrics,
  PerformanceMetrics
} from '../../../store/slices/partnerStatisticsSlice'
import {
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiAward,
  FiZap,
  FiUsers,
  FiHeart,
  FiUserPlus,
  FiTrendingUp,
  FiBarChart2,
  FiClock,
  FiHome,
  FiActivity,
  FiTarget,
  FiStar,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi'

interface MetricsGridProps {
  bookingMetrics: BookingMetrics | null
  tournamentMetrics: TournamentMetrics | null
  customerMetrics: CustomerMetrics | null
  performanceMetrics: PerformanceMetrics | null
}

const MetricsGrid: React.FC<MetricsGridProps> = ({
  bookingMetrics,
  tournamentMetrics,
  customerMetrics,
  performanceMetrics
}) => {
  const MetricCard: React.FC<{
    title: string
    value: string | number
    subtitle?: string
    icon: React.ReactNode
    color?: string
    gradientFrom?: string
    gradientTo?: string
  }> = ({ title, value, subtitle, icon, color, gradientFrom = 'blue-500', gradientTo = 'indigo-600' }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 bg-gradient-to-br from-${gradientFrom} to-${gradientTo} rounded-2xl flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
        <div className="text-right flex-1 ml-4">
          <p className="text-sm font-bold text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline justify-end">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          {subtitle && (
            <p className="text-sm font-medium text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {bookingMetrics && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
              <FiCalendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Booking Metrics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Reservations"
              value={bookingMetrics.total_reservations}
              gradientFrom="blue-500"
              gradientTo="indigo-600"
              icon={<FiCalendar className="w-7 h-7 text-white" />}
            />
            <MetricCard
              title="Completed"
              value={bookingMetrics.completed_reservations}
              subtitle={`${bookingMetrics.total_reservations > 0 ? Math.round((bookingMetrics.completed_reservations / bookingMetrics.total_reservations) * 100) : 0}% success rate`}
              gradientFrom="green-500"
              gradientTo="emerald-600"
              icon={<FiCheckCircle className="w-7 h-7 text-white" />}
            />
            <MetricCard
              title="Canceled"
              value={bookingMetrics.canceled_reservations}
              subtitle={`${bookingMetrics.total_reservations > 0 ? Math.round((bookingMetrics.canceled_reservations / bookingMetrics.total_reservations) * 100) : 0}% cancellation rate`}
              gradientFrom="red-500"
              gradientTo="pink-600"
              icon={<FiXCircle className="w-7 h-7 text-white" />}
            />
            <MetricCard
              title="Avg Booking Value"
              value={`$${bookingMetrics.average_booking_value.toFixed(2)}`}
              gradientFrom="yellow-500"
              gradientTo="orange-600"
              icon={<FiDollarSign className="w-7 h-7 text-white" />}
            />
          </div>

          {bookingMetrics.peak_booking_hours.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl flex items-center justify-center mr-4">
                  <FiClock className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Peak Booking Hours</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {bookingMetrics.peak_booking_hours.map((hour, index) => (
                  <div key={hour.hour} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center border border-purple-200 hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <FiClock className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-xl font-bold text-purple-900 mb-1">
                      {hour.hour}:00
                    </div>
                    <div className="text-sm font-medium text-purple-700">
                      {hour.count} bookings
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {bookingMetrics.popular_courts.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-4">
                  <FiStar className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Most Popular Courts</h4>
              </div>
              <div className="space-y-4">
                {bookingMetrics.popular_courts.map((court, index) => (
                  <div key={court.court_id} className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold mr-4 ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white' :
                        'bg-gradient-to-br from-orange-400 to-red-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-bold text-gray-900 text-lg">{court.court_name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-2xl text-green-600">{court.reservation_count}</span>
                      <p className="text-sm font-medium text-green-700">bookings</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tournamentMetrics && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl flex items-center justify-center mr-4">
              <FiAward className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Tournament Metrics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Total Tournaments"
              value={tournamentMetrics.total_tournaments}
              gradientFrom="purple-500"
              gradientTo="pink-600"
              icon={<FiAward className="w-7 h-7 text-white" />}
            />
            <MetricCard
              title="Active Tournaments"
              value={tournamentMetrics.active_tournaments}
              gradientFrom="orange-500"
              gradientTo="red-600"
              icon={<FiZap className="w-7 h-7 text-white" />}
            />
            <MetricCard
              title="Total Participants"
              value={tournamentMetrics.total_participants}
              subtitle={`${tournamentMetrics.average_participants_per_tournament.toFixed(1)} avg per tournament`}
              gradientFrom="indigo-500"
              gradientTo="purple-600"
              icon={<FiUsers className="w-7 h-7 text-white" />}
            />
          </div>
        </div>
      )}

      {customerMetrics && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-200">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center mr-4">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Customer Metrics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Customers"
              value={customerMetrics.total_customers}
              gradientFrom="emerald-500"
              gradientTo="teal-600"
              icon={<FiUsers className="w-7 h-7 text-white" />}
            />
            <MetricCard
              title="Returning Customers"
              value={customerMetrics.returning_customers}
              subtitle={`${customerMetrics.customer_retention_rate}% retention rate`}
              gradientFrom="pink-500"
              gradientTo="rose-600"
              icon={<FiHeart className="w-7 h-7 text-white" />}
            />
            <MetricCard
              title="New This Month"
              value={customerMetrics.new_customers_this_month}
              gradientFrom="cyan-500"
              gradientTo="blue-600"
              icon={<FiUserPlus className="w-7 h-7 text-white" />}
            />
            <MetricCard
              title="Retention Rate"
              value={`${customerMetrics.customer_retention_rate}%`}
              gradientFrom="violet-500"
              gradientTo="purple-600"
              icon={<FiTrendingUp className="w-7 h-7 text-white" />}
            />
          </div>

          {customerMetrics.top_customers.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4">
                  <FiStar className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Top Customers</h4>
              </div>
              <div className="space-y-4">
                {customerMetrics.top_customers.map((customer, index) => (
                  <div key={customer.user_id} className="flex justify-between items-center p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold mr-4 ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white' :
                        'bg-gradient-to-br from-orange-400 to-red-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 text-lg">{customer.customer_name}</span>
                        <p className="text-sm font-medium text-yellow-700">
                          {customer.total_reservations} reservations
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-2xl text-green-600">
                        ${customer.total_spent.toFixed(2)}
                      </span>
                      <p className="text-sm font-medium text-green-700">total spent</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {performanceMetrics && (
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-3xl p-8 border border-slate-200">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-2xl flex items-center justify-center mr-4">
              <FiActivity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Performance Metrics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <MetricCard
              title="Court Utilization"
              value={`${performanceMetrics.court_utilization_rate}%`}
              gradientFrom="slate-500"
              gradientTo="gray-600"
              icon={<FiBarChart2 className="w-7 h-7 text-white" />}
            />
            <MetricCard
              title="Avg Session"
              value={`${performanceMetrics.average_session_duration.toFixed(1)}h`}
              gradientFrom="amber-500"
              gradientTo="orange-600"
              icon={<FiClock className="w-7 h-7 text-white" />}
            />
            <MetricCard
              title="Cancellation Rate"
              value={`${performanceMetrics.cancellation_rate}%`}
              gradientFrom="red-500"
              gradientTo="pink-600"
              icon={<FiXCircle className="w-7 h-7 text-white" />}
            />
            <MetricCard
              title="Revenue/Court"
              value={`$${performanceMetrics.revenue_per_court.toFixed(0)}`}
              gradientFrom="green-500"
              gradientTo="emerald-600"
              icon={<FiDollarSign className="w-7 h-7 text-white" />}
            />
            <MetricCard
              title="Monthly Growth"
              value={`${performanceMetrics.monthly_growth_rate > 0 ? '+' : ''}${performanceMetrics.monthly_growth_rate.toFixed(1)}%`}
              gradientFrom={performanceMetrics.monthly_growth_rate >= 0 ? "emerald-500" : "red-500"}
              gradientTo={performanceMetrics.monthly_growth_rate >= 0 ? "teal-600" : "pink-600"}
              icon={performanceMetrics.monthly_growth_rate >= 0 ?
                <FiArrowUp className="w-7 h-7 text-white" /> :
                <FiArrowDown className="w-7 h-7 text-white" />
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MetricsGrid