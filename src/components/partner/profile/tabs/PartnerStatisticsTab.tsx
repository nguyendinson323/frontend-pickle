import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../store'
import { fetchPartnerStatistics } from '../../../../store/slices/partnerStatisticsSlice'
import {
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiTarget,
  FiHome,
  FiActivity,
  FiExternalLink,
  FiAlertCircle,
  FiStar,
  FiPieChart,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi'

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
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg border border-gray-200">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl"></div>
            <div className="flex-1">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/3 mb-2"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 h-32 shadow-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 text-white">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
              <FiBarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold">Statistics & Analytics</h3>
          </div>
          <button
            onClick={() => navigate('/partner/statistics')}
            className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 text-white rounded-2xl hover:bg-opacity-30 transition-all duration-300 font-bold hover:transform hover:scale-105"
          >
            <FiExternalLink className="w-5 h-5 mr-2" />
            View Full Statistics
          </button>
        </div>
      </div>
      <div className="p-8">

      {/* Error Display */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
              <FiAlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900 mb-1">Error</h3>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-gray-700 mb-2">Total Bookings</h5>
              <p className="text-3xl font-bold text-blue-600">
                {bookingMetrics?.total_reservations || 0}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FiCalendar className="w-7 h-7 text-white" />
            </div>
          </div>
          <p className="text-sm font-medium text-blue-700 mt-3 flex items-center">
            <FiActivity className="w-4 h-4 mr-1" />
            All time reservations
          </p>
        </div>

        <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-gray-700 mb-2">Monthly Revenue</h5>
              <p className="text-3xl font-bold text-green-600">
                ${getCurrentMonthRevenue().toLocaleString()}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FiDollarSign className="w-7 h-7 text-white" />
            </div>
          </div>
          <p className="text-sm font-medium text-green-700 mt-3 flex items-center">
            <FiTrendingUp className="w-4 h-4 mr-1" />
            Current month earnings
          </p>
        </div>

        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-gray-700 mb-2">Court Utilization</h5>
              <p className="text-3xl font-bold text-purple-600">
                {performanceMetrics ? `${performanceMetrics.court_utilization_rate.toFixed(1)}%` : '0%'}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FiPieChart className="w-7 h-7 text-white" />
            </div>
          </div>
          <p className="text-sm font-medium text-purple-700 mt-3 flex items-center">
            <FiTarget className="w-4 h-4 mr-1" />
            Facility usage rate
          </p>
        </div>

        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-6 border-2 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-gray-700 mb-2">Total Customers</h5>
              <p className="text-3xl font-bold text-indigo-600">
                {customerMetrics?.total_customers || 0}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FiUsers className="w-7 h-7 text-white" />
            </div>
          </div>
          <p className="text-sm font-medium text-indigo-700 mt-3 flex items-center">
            <FiStar className="w-4 h-4 mr-1" />
            Unique customers served
          </p>
        </div>

        <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-6 border-2 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-gray-700 mb-2">Tournaments</h5>
              <p className="text-3xl font-bold text-yellow-600">
                {tournamentMetrics?.total_tournaments || 0}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FiAward className="w-7 h-7 text-white" />
            </div>
          </div>
          <p className="text-sm font-medium text-yellow-700 mt-3 flex items-center">
            <FiCalendar className="w-4 h-4 mr-1" />
            Events hosted
          </p>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-gray-700 mb-2">Avg. Booking Value</h5>
              <p className="text-3xl font-bold text-emerald-600">
                ${bookingMetrics?.average_booking_value?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FiDollarSign className="w-7 h-7 text-white" />
            </div>
          </div>
          <p className="text-sm font-medium text-emerald-700 mt-3 flex items-center">
            <FiTrendingUp className="w-4 h-4 mr-1" />
            Per reservation value
          </p>
        </div>
      </div>

      {/* Performance Summary */}
      {performanceMetrics && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 p-8 mb-8 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
              <FiActivity className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900">Performance Summary</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {performanceMetrics.monthly_growth_rate >= 0 ? (
                  <FiArrowUp className="w-6 h-6 text-white" />
                ) : (
                  <FiArrowDown className="w-6 h-6 text-white" />
                )}
              </div>
              <p className="text-sm font-bold text-gray-600 mb-2">Monthly Growth</p>
              <p className="text-2xl font-bold text-green-600">
                {performanceMetrics.monthly_growth_rate > 0 ? '+' : ''}
                {performanceMetrics.monthly_growth_rate.toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600 mb-2">Retention Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {customerMetrics?.customer_retention_rate?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiHome className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600 mb-2">Revenue/Court</p>
              <p className="text-2xl font-bold text-purple-600">
                ${performanceMetrics.revenue_per_court.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-600 mb-2">Cancellation Rate</p>
              <p className="text-2xl font-bold text-orange-600">
                {performanceMetrics.cancellation_rate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Popular Courts */}
      {bookingMetrics?.popular_courts && bookingMetrics.popular_courts.length > 0 && (
        <div className="bg-gradient-to-r from-white to-green-50 rounded-2xl border border-green-200 p-8 mb-8 shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-4">
              <FiStar className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900">Most Popular Courts</h4>
          </div>
          <div className="space-y-4">
            {bookingMetrics.popular_courts.slice(0, 3).map((court, index) => (
              <div key={court.court_id} className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold mr-4 shadow-lg ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                    index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white' :
                    'bg-gradient-to-br from-orange-400 to-red-500 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 text-lg">{court.court_name}</span>
                    <p className="text-sm text-gray-600 font-medium">Court #{court.court_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl text-green-600">{court.reservation_count}</p>
                  <p className="text-sm text-green-700 font-medium">bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-8 border border-purple-200 shadow-lg">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl flex items-center justify-center mr-4">
            <FiBarChart2 className="w-5 h-5 text-white" />
          </div>
          <h5 className="text-2xl font-bold text-purple-900">Available Analytics</h5>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-purple-100">
            <FiPieChart className="w-5 h-5 text-purple-600 mr-3" />
            <p className="font-semibold text-purple-800">Court utilization rates</p>
          </div>
          <div className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-purple-100">
            <FiDollarSign className="w-5 h-5 text-purple-600 mr-3" />
            <p className="font-semibold text-purple-800">Revenue by time period</p>
          </div>
          <div className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-purple-100">
            <FiUsers className="w-5 h-5 text-purple-600 mr-3" />
            <p className="font-semibold text-purple-800">Customer demographics</p>
          </div>
          <div className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-purple-100">
            <FiCalendar className="w-5 h-5 text-purple-600 mr-3" />
            <p className="font-semibold text-purple-800">Booking patterns</p>
          </div>
          <div className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-purple-100">
            <FiActivity className="w-5 h-5 text-purple-600 mr-3" />
            <p className="font-semibold text-purple-800">Popular time slots</p>
          </div>
          <div className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-purple-100">
            <FiAward className="w-5 h-5 text-purple-600 mr-3" />
            <p className="font-semibold text-purple-800">Tournament participation</p>
          </div>
          <div className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-purple-100">
            <FiTarget className="w-5 h-5 text-purple-600 mr-3" />
            <p className="font-semibold text-purple-800">Conversion metrics</p>
          </div>
          <div className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-purple-100">
            <FiTrendingUp className="w-5 h-5 text-purple-600 mr-3" />
            <p className="font-semibold text-purple-800">Growth trends</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/partner/statistics')}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold text-lg"
        >
          <FiBarChart2 className="w-6 h-6 mr-3" />
          View Detailed Analytics
          <FiExternalLink className="w-5 h-5 ml-3" />
        </button>
      </div>
      </div>
    </div>
  )
}