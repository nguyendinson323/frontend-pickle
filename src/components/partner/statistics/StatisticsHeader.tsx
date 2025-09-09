import React from 'react'

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
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onDateRangeChange({
      ...dateRange,
      [field]: value
    })
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

        <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Date Range:
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
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={() => onExportReport('pdf')}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsHeader