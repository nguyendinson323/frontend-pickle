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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Statistics</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchPartnerStatistics())}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const hasData = revenueData.length > 0 || bookingMetrics || tournamentMetrics || customerMetrics || performanceMetrics

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/partner/dashboard')}
                  className="text-gray-400 hover:text-gray-500"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500" aria-current="page">
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
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last updated: {lastRefresh.toLocaleString()}
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="autoRefresh" className="ml-2 text-sm text-gray-600">
                  Auto-refresh (30s)
                </label>
              </div>
            </div>
            <div className="mt-3 sm:mt-0">
              <button
                onClick={handleRefreshData}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <svg 
                  className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-800">Loading statistics...</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">Error Loading Statistics</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      onClick={handleRefreshData}
                      className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => navigate('/partner/dashboard')}
                      className="ml-3 bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasData ? (
          <>
            <RevenueChart revenueData={revenueData} />

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <MetricsGrid
                bookingMetrics={bookingMetrics}
                tournamentMetrics={tournamentMetrics}
                customerMetrics={customerMetrics}
                performanceMetrics={performanceMetrics}
              />
            </div>
          </>
        ) : !loading && !error && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              No statistics data available for the selected date range. 
              Data will appear once you start receiving bookings and hosting tournaments.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/partner/management')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Manage Courts & Tournaments
              </button>
              <button
                onClick={handleRefreshData}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
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