import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import {
  fetchPartnerStatistics,
  exportStatisticsReport,
  setDateRange
} from '../../store/slices/partnerStatisticsSlice'

import StatisticsHeader from '../../components/partner/statistics/StatisticsHeader'
import RevenueChart from '../../components/partner/statistics/RevenueChart'
import MetricsGrid from '../../components/partner/statistics/MetricsGrid'

const PartnerStatistics: React.FC = () => {
  const dispatch = useDispatch()
  const {
    revenueData,
    bookingMetrics,
    tournamentMetrics,
    customerMetrics,
    performanceMetrics,
    loading,
    error,
    dateRange
  } = useSelector((state: RootState) => state.partnerStatistics)

  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    dispatch(fetchPartnerStatistics() as any)
  }, [dispatch])

  const handleDateRangeChange = (newDateRange: { startDate: string; endDate: string }) => {
    dispatch(setDateRange(newDateRange))
    dispatch(fetchPartnerStatistics(newDateRange) as any)
  }

  const handleExportReport = async (format: 'csv' | 'pdf') => {
    try {
      setExporting(true)
      await dispatch(exportStatisticsReport(dateRange, format) as any)
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
              onClick={() => dispatch(fetchPartnerStatistics() as any)}
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatisticsHeader
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onExportReport={handleExportReport}
          loading={loading || exporting}
        />

        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-800">Loading statistics...</span>
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
        ) : (
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
                onClick={() => window.location.href = '/partner/management'}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Manage Courts & Tournaments
              </button>
              <button
                onClick={() => dispatch(fetchPartnerStatistics() as any)}
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