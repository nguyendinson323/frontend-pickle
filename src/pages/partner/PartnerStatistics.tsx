import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import {
  fetchPartnerStatistics,
  exportStatisticsReport,
  setDateRange
} from '../../store/slices/partnerStatisticsSlice'

import StatisticsHeader from '../../components/partner/statistics/StatisticsHeader'
import RevenueChart from '../../components/partner/statistics/RevenueChart'
import MetricsGrid from '../../components/partner/statistics/MetricsGrid'
import {
  FiHome,
  FiChevronRight,
  FiBarChart2,
  FiAlertCircle,
  FiRefreshCw,
  FiClock,
  FiSettings,
  FiActivity,
  FiTrendingUp
} from 'react-icons/fi'

const PartnerStatistics: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const {
    revenueData,
    bookingMetrics,
    tournamentMetrics,
    customerMetrics,
    performanceMetrics,
    error
  } = useSelector((state: RootState) => state.partnerStatistics)
  const { isLoading: loading } = useSelector((state: RootState) => state.loading)

  const [exporting, setExporting] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Get dateRange from state
  const { dateRange } = useSelector((state: RootState) => state.partnerStatistics)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (user?.role !== 'partner') {
      navigate('/dashboard')
      return
    }

    dispatch(fetchPartnerStatistics())
    setLastRefresh(new Date())
  }, [dispatch, isAuthenticated, user, navigate])

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        dispatch(fetchPartnerStatistics())
        setLastRefresh(new Date())
      }, 30000) // Refresh every 30 seconds
    } else {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [autoRefresh, dispatch])

  const handleDateRangeChange = (newDateRange: { startDate: string; endDate: string }) => {
    dispatch(setDateRange(newDateRange))
    dispatch(fetchPartnerStatistics(newDateRange))
    setLastRefresh(new Date())
  }

  const handleRefreshData = () => {
    dispatch(fetchPartnerStatistics())
    setLastRefresh(new Date())
  }

  const handleExportReport = async (format: 'csv' | 'pdf') => {
    try {
      setExporting(true)
      await dispatch(exportStatisticsReport(dateRange, format))
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  if (loading && !revenueData.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            {/* Loading header */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/3 mb-3"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3"></div>
                </div>
              </div>
            </div>
            {/* Loading chart */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 h-80"></div>
            {/* Loading metrics grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 h-32"></div>
              ))}
            </div>
            <div className="text-center">
              <div className="inline-flex items-center bg-white rounded-2xl px-6 py-4 shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent mr-4"></div>
                <span className="text-lg font-semibold text-gray-700">Loading your analytics...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl p-12 text-center shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiAlertCircle className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-red-900 mb-4">Error Loading Statistics</h3>
            <p className="text-lg text-red-700 mb-8 max-w-md mx-auto">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => dispatch(fetchPartnerStatistics())}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-2xl hover:from-red-700 hover:to-pink-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold"
              >
                <FiRefreshCw className="w-5 h-5 mr-3" />
                Retry Loading
              </button>
              <button
                onClick={() => navigate('/partner/dashboard')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold"
              >
                <FiHome className="w-5 h-5 mr-3" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const hasData = revenueData.length > 0 || bookingMetrics || tournamentMetrics || customerMetrics || performanceMetrics

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/partner/dashboard')}
                  className="flex items-center text-gray-500 hover:text-purple-600 font-medium transition-all duration-200 hover:transform hover:scale-105"
                >
                  <FiHome className="w-4 h-4 mr-1" />
                  Dashboard
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" />
                  <span className="text-sm font-semibold text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-purple-200" aria-current="page">
                    <FiBarChart2 className="w-4 h-4 inline mr-2" />
                    Statistics
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <StatisticsHeader
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onExportReport={handleExportReport}
          loading={loading || exporting}
        />

        {/* Data Status Bar */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-2xl border border-blue-200">
                <FiClock className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Last updated: {lastRefresh.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center bg-purple-50 px-4 py-2 rounded-2xl border border-purple-200">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300 rounded"
                />
                <label htmlFor="autoRefresh" className="ml-2 text-sm font-medium text-purple-800">
                  <FiActivity className="w-4 h-4 inline mr-1" />
                  Auto-refresh (30s)
                </label>
              </div>
            </div>
            <div>
              <button
                onClick={handleRefreshData}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <FiRefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mr-4"></div>
              <div className="text-center">
                <span className="text-lg font-semibold text-blue-800">Loading statistics...</span>
                <p className="text-sm text-blue-600 mt-1">Please wait while we fetch your latest data</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8 mb-8 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <FiAlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-6 flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">Error Loading Statistics</h3>
                <div className="text-red-700 mb-6">
                  <p className="font-medium">{error}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleRefreshData}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-2xl hover:from-red-700 hover:to-pink-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold"
                  >
                    <FiRefreshCw className="w-5 h-5 mr-2" />
                    Try Again
                  </button>
                  <button
                    onClick={() => navigate('/partner/dashboard')}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold"
                  >
                    <FiHome className="w-5 h-5 mr-2" />
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasData ? (
          <>
            <RevenueChart revenueData={revenueData} />

            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-8">
              <MetricsGrid
                bookingMetrics={bookingMetrics}
                tournamentMetrics={tournamentMetrics}
                customerMetrics={customerMetrics}
                performanceMetrics={performanceMetrics}
              />
            </div>
          </>
        ) : !loading && !error && (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <FiBarChart2 className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              No statistics data available for the selected date range.
              Data will appear once you start receiving bookings and hosting tournaments.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigate('/partner/management')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-2xl hover:from-purple-700 hover:to-pink-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold text-lg"
              >
                <FiSettings className="w-6 h-6 mr-3" />
                Manage Courts & Tournaments
              </button>
              <button
                onClick={handleRefreshData}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold text-lg"
              >
                <FiRefreshCw className="w-6 h-6 mr-3" />
                Refresh Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PartnerStatistics