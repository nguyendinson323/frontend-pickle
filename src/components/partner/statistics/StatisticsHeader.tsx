import React, { useState } from 'react'
import {
  FiBarChart2,
  FiCalendar,
  FiDownload,
  FiFileText,
  FiFilter,
  FiClock,
  FiTrendingUp,
  FiSettings
} from 'react-icons/fi'

interface StatisticsHeaderProps {
  dateRange: {
    startDate: string
    endDate: string
  }
  onDateRangeChange: (dateRange: { startDate: string; endDate: string }) => void
  onExportReport: (format: 'csv' | 'pdf') => void
  loading: boolean
}

const StatisticsHeader: React.FC<StatisticsHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  onExportReport,
  loading
}) => {
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>('')

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setActiveQuickFilter('')
    onDateRangeChange({
      ...dateRange,
      [field]: value
    })
  }

  const handleQuickFilter = (period: string) => {
    setActiveQuickFilter(period)
    const endDate = new Date().toISOString().split('T')[0]
    let startDate = ''

    switch (period) {
      case 'today':
        startDate = endDate
        break
      case 'week':
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        startDate = weekAgo.toISOString().split('T')[0]
        break
      case 'month':
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        startDate = monthAgo.toISOString().split('T')[0]
        break
      case 'quarter':
        const quarterAgo = new Date()
        quarterAgo.setMonth(quarterAgo.getMonth() - 3)
        startDate = quarterAgo.toISOString().split('T')[0]
        break
      case 'year':
        const yearAgo = new Date()
        yearAgo.setFullYear(yearAgo.getFullYear() - 1)
        startDate = yearAgo.toISOString().split('T')[0]
        break
      default:
        return
    }

    onDateRangeChange({ startDate, endDate })
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-8 mb-8 overflow-hidden">
      {/* Header Gradient Background */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 mb-8 -m-2">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-white">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
              <FiBarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-indigo-100 text-lg">
                Track your performance and gain insights into your business
              </p>
            </div>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="flex items-center bg-white bg-opacity-20 rounded-2xl px-4 py-2">
              <FiTrendingUp className="w-5 h-5 mr-2" />
              <span className="font-semibold">Real-time Analytics</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick Filter Buttons */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <FiFilter className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-800">Quick Time Filters</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'today', label: 'Today', icon: FiClock },
              { key: 'week', label: 'Last 7 Days', icon: FiCalendar },
              { key: 'month', label: 'Last Month', icon: FiCalendar },
              { key: 'quarter', label: 'Last Quarter', icon: FiCalendar },
              { key: 'year', label: 'Last Year', icon: FiCalendar }
            ].map((filter) => {
              const IconComponent = filter.icon
              return (
                <button
                  key={filter.key}
                  onClick={() => handleQuickFilter(filter.key)}
                  className={`inline-flex items-center px-4 py-3 text-sm font-semibold rounded-2xl border-2 transition-all duration-300 hover:transform hover:scale-105 ${
                    activeQuickFilter === filter.key
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 text-purple-700 shadow-lg'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <FiCalendar className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-bold text-blue-800">Custom Date Range</h3>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900 bg-white"
                />
              </div>
              <div className="flex items-center justify-center py-2">
                <span className="text-blue-600 font-bold text-lg">to</span>
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center mb-4">
              <FiDownload className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-bold text-green-800">Export Reports</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onExportReport('csv')}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
              >
                <FiFileText className="w-5 h-5 mr-2" />
                Export CSV
              </button>
              <button
                onClick={() => onExportReport('pdf')}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white font-bold rounded-2xl hover:from-red-700 hover:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
              >
                <FiDownload className="w-5 h-5 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsHeader