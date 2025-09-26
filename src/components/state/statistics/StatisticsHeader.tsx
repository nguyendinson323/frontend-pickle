import React from 'react'
import { FiCalendar, FiDownload, FiUsers, FiAward, FiDollarSign, FiHome, FiAlertTriangle } from 'react-icons/fi'

interface StatisticsHeaderProps {
  dateRange: {
    start_date: string
    end_date: string
  }
  onDateRangeChange: (dateRange: { start_date: string, end_date: string }) => void
  onExport: (format: 'pdf' | 'excel') => void
  loading: boolean
  keyMetrics?: {
    totalPlayers: number
    totalTournaments: number
    totalRevenue: number
    totalClubs: number
  }
}

const StatisticsHeader: React.FC<StatisticsHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  onExport,
  loading,
  keyMetrics
}) => {
  const handleDateChange = (field: 'start_date' | 'end_date', value: string) => {
    onDateRangeChange({
      ...dateRange,
      [field]: value
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-xl border border-gray-200/50 p-8 mb-8 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-8 space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
              <FiAward className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">State Analytics</h1>
          </div>
          <p className="text-gray-600 mt-2 text-lg">Comprehensive insights into your state's pickleball performance</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Date Range Selector */}
          <div className="bg-white/60 rounded-2xl p-4 backdrop-blur-sm shadow-lg border border-gray-200/50">
            <div className="flex items-center space-x-2 mb-2">
              <FiCalendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-gray-700">Date Range</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-600 min-w-max">From:</label>
                <input
                  type="date"
                  value={dateRange.start_date}
                  onChange={(e) => handleDateChange('start_date', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-600 min-w-max">To:</label>
                <input
                  type="date"
                  value={dateRange.end_date}
                  onChange={(e) => handleDateChange('end_date', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onExport('pdf')}
              disabled={loading}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <FiDownload className="w-4 h-4" />
              <span>PDF</span>
            </button>

            <button
              onClick={() => onExport('excel')}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <FiDownload className="w-4 h-4" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      {keyMetrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-3xl shadow-xl border border-blue-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg">
                <FiUsers className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {keyMetrics.totalPlayers.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-blue-600">Total Players</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-3xl shadow-xl border border-green-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-2xl shadow-lg">
                <FiAward className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-green-700 mb-1">
                  {keyMetrics.totalTournaments.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-green-600">Tournaments</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-3xl shadow-xl border border-purple-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                <FiDollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-purple-700 mb-1">
                  {formatCurrency(keyMetrics.totalRevenue)}
                </div>
                <div className="text-sm font-medium text-purple-600">Total Revenue</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-3xl shadow-xl border border-orange-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-2xl shadow-lg">
                <FiHome className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-700 mb-1">
                  {keyMetrics.totalClubs.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-orange-600">Active Clubs</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-3xl shadow-lg backdrop-blur-sm">
        <div className="flex items-start space-x-4">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-2xl shadow-lg flex-shrink-0">
            <FiAlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-yellow-800 mb-2">
              Analytics Overview
            </h3>
            <div className="text-sm text-yellow-700 leading-relaxed">
              <p>
                These analytics provide comprehensive insights into tournament performance, player growth,
                financial metrics, and comparative benchmarks for your state's pickleball ecosystem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsHeader