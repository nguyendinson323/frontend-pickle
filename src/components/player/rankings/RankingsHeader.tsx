import React from 'react'

interface RankingsHeaderProps {
  selectedTimeframe: '30d' | '3m' | '6m' | '1y' | 'all'
  onTimeframeChange: (timeframe: '30d' | '3m' | '6m' | '1y' | 'all') => void
  title?: string
  description?: string
}

const RankingsHeader: React.FC<RankingsHeaderProps> = ({
  selectedTimeframe,
  onTimeframeChange,
  title = "Player Rankings & Stats",
  description = "Track your performance and compare with other players"
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => onTimeframeChange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            >
              <option value="30d">Last 30 Days</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RankingsHeader