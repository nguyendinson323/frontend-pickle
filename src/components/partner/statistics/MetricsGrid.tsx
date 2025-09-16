import React from 'react'
import {
  BookingMetrics,
  TournamentMetrics,
  CustomerMetrics,
  PerformanceMetrics
} from '../../../store/slices/partnerStatisticsSlice'

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
    color: string
  }> = ({ title, value, subtitle, icon, color }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {subtitle && (
              <p className="ml-2 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {bookingMetrics && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Reservations"
              value={bookingMetrics.total_reservations}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <MetricCard
              title="Completed"
              value={bookingMetrics.completed_reservations}
              subtitle={`${bookingMetrics.total_reservations > 0 ? Math.round((bookingMetrics.completed_reservations / bookingMetrics.total_reservations) * 100) : 0}%`}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Canceled"
              value={bookingMetrics.canceled_reservations}
              subtitle={`${bookingMetrics.total_reservations > 0 ? Math.round((bookingMetrics.canceled_reservations / bookingMetrics.total_reservations) * 100) : 0}%`}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Avg Booking Value"
              value={`$${bookingMetrics.average_booking_value.toFixed(2)}`}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              }
            />
          </div>

          {bookingMetrics.peak_booking_hours.length > 0 && (
            <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Peak Booking Hours</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {bookingMetrics.peak_booking_hours.map((hour) => (
                  <div key={hour.hour} className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {hour.hour}:00
                    </div>
                    <div className="text-sm text-gray-500">
                      {hour.count} bookings
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {bookingMetrics.popular_courts.length > 0 && (
            <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Most Popular Courts</h4>
              <div className="space-y-3">
                {bookingMetrics.popular_courts.map((court) => (
                  <div key={court.court_id} className="flex justify-between items-center">
                    <span className="text-gray-900">{court.court_name}</span>
                    <span className="font-medium text-blue-600">{court.reservation_count} bookings</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tournamentMetrics && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tournament Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Total Tournaments"
              value={tournamentMetrics.total_tournaments}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              }
            />
            <MetricCard
              title="Active Tournaments"
              value={tournamentMetrics.active_tournaments}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
            <MetricCard
              title="Total Participants"
              value={tournamentMetrics.total_participants}
              subtitle={`${tournamentMetrics.average_participants_per_tournament.toFixed(1)} avg`}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
          </div>
        </div>
      )}

      {customerMetrics && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Customers"
              value={customerMetrics.total_customers}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Returning Customers"
              value={customerMetrics.returning_customers}
              subtitle={`${customerMetrics.customer_retention_rate}% retention`}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
            />
            <MetricCard
              title="New This Month"
              value={customerMetrics.new_customers_this_month}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              }
            />
            <MetricCard
              title="Retention Rate"
              value={`${customerMetrics.customer_retention_rate}%`}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          </div>

          {customerMetrics.top_customers.length > 0 && (
            <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Top Customers</h4>
              <div className="space-y-3">
                {customerMetrics.top_customers.map((customer) => (
                  <div key={customer.user_id} className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-900">{customer.customer_name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        {customer.total_reservations} reservations
                      </span>
                    </div>
                    <span className="font-medium text-green-600">
                      ${customer.total_spent.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {performanceMetrics && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <MetricCard
              title="Court Utilization"
              value={`${performanceMetrics.court_utilization_rate}%`}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            <MetricCard
              title="Avg Session"
              value={`${performanceMetrics.average_session_duration.toFixed(1)}h`}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Cancellation Rate"
              value={`${performanceMetrics.cancellation_rate}%`}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Revenue/Court"
              value={`$${performanceMetrics.revenue_per_court.toFixed(0)}`}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              }
            />
            <MetricCard
              title="Monthly Growth"
              value={`${performanceMetrics.monthly_growth_rate > 0 ? '+' : ''}${performanceMetrics.monthly_growth_rate.toFixed(1)}%`}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {performanceMetrics.monthly_growth_rate >= 0 ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  )}
                </svg>
              }
              color={performanceMetrics.monthly_growth_rate >= 0 ? "bg-emerald-600" : "bg-red-600"}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MetricsGrid