import React, { useState } from 'react'

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
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Track your performance and gain insights into your business
          </p>
        </div>

        <div className="mt-4 lg:mt-0 flex flex-col gap-4">
          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'today', label: 'Today' },
              { key: 'week', label: 'Last 7 Days' },
              { key: 'month', label: 'Last Month' },
              { key: 'quarter', label: 'Last Quarter' },
              { key: 'year', label: 'Last Year' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleQuickFilter(filter.key)}
                className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                  activeQuickFilter === filter.key
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Custom Range:
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onExportReport('csv')}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Export CSV
              </button>
              <button
                onClick={() => onExportReport('pdf')}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
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