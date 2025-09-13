import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../store'
import { fetchPartnerStatistics } from '../../../../store/slices/partnerStatisticsSlice'

export const PartnerStatisticsTab: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const {
    bookingMetrics,
    tournamentMetrics,
    customerMetrics,
    performanceMetrics,
    revenueData,
    error
  } = useSelector((state: RootState) => state.partnerStatistics)
  const { isLoading } = useSelector((state: RootState) => state.loading)

  useEffect(() => {
    dispatch(fetchPartnerStatistics())
  }, [dispatch])

  const getCurrentMonthRevenue = () => {
    if (!revenueData.length) return 0
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
    const monthData = revenueData.find(data => data.month.includes(currentMonth))
    return monthData?.total_revenue || 0
  }

  if (isLoading && !bookingMetrics) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Statistics & Analytics</h3>
        <button
          onClick={() => navigate('/partner/statistics')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          View Full Statistics
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-900">Total Bookings</h5>
              <p className="text-2xl font-bold text-green-600">
                {bookingMetrics?.total_reservations || 0}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">All time reservations</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-900">Monthly Revenue</h5>
              <p className="text-2xl font-bold text-green-600">
                ${getCurrentMonthRevenue().toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Current month earnings</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-900">Court Utilization</h5>
              <p className="text-2xl font-bold text-green-600">
                {performanceMetrics ? `${performanceMetrics.court_utilization_rate.toFixed(1)}%` : '0%'}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Facility usage rate</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-900">Total Customers</h5>
              <p className="text-2xl font-bold text-green-600">
                {customerMetrics?.total_customers || 0}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Unique customers served</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-900">Tournaments</h5>
              <p className="text-2xl font-bold text-green-600">
                {tournamentMetrics?.total_tournaments || 0}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Events hosted</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-900">Avg. Booking Value</h5>
              <p className="text-2xl font-bold text-green-600">
                ${bookingMetrics?.average_booking_value?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Per reservation value</p>
        </div>
      </div>

      {/* Performance Summary */}
      {performanceMetrics && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h4 className="font-medium text-gray-900 mb-4">Performance Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-700">Monthly Growth</p>
              <p className="text-xl font-bold text-green-600">
                {performanceMetrics.monthly_growth_rate > 0 ? '+' : ''}
                {performanceMetrics.monthly_growth_rate.toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-700">Retention Rate</p>
              <p className="text-xl font-bold text-blue-600">
                {customerMetrics?.customer_retention_rate?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-700">Revenue/Court</p>
              <p className="text-xl font-bold text-purple-600">
                ${performanceMetrics.revenue_per_court.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-sm font-medium text-orange-700">Cancellation Rate</p>
              <p className="text-xl font-bold text-orange-600">
                {performanceMetrics.cancellation_rate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Popular Courts */}
      {bookingMetrics?.popular_courts && bookingMetrics.popular_courts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h4 className="font-medium text-gray-900 mb-4">Most Popular Courts</h4>
          <div className="space-y-3">
            {bookingMetrics.popular_courts.slice(0, 3).map((court, index) => (
              <div key={court.court_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{court.court_name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{court.reservation_count}</p>
                  <p className="text-xs text-gray-500">bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-green-100 rounded-lg p-4 mb-4">
        <h5 className="font-medium text-green-900 mb-2">📊 Available Analytics</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
          <p>• Court utilization rates</p>
          <p>• Revenue by time period</p>
          <p>• Customer demographics</p>
          <p>• Booking patterns</p>
          <p>• Popular time slots</p>
          <p>• Tournament participation</p>
          <p>• Conversion metrics</p>
          <p>• Growth trends</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/partner/statistics')}
        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        View Detailed Analytics
      </button>
    </div>
  )
}