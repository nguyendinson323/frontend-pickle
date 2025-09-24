import React from 'react'
import {
  FiBarChart2,
  FiClock,
  FiAward,
  FiTrendingUp
} from 'react-icons/fi'

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
    <div className="bg-gradient-to-r from-white to-indigo-50 border-b-2 border-indigo-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-8 space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-6 shadow-lg">
              <FiAward className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              <p className="text-lg text-indigo-700 font-medium flex items-center">
                <FiTrendingUp className="w-5 h-5 mr-2" />
                {description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-600 mr-4">
              <FiClock className="w-5 h-5 mr-2" />
              <span className="font-medium">Time Period:</span>
            </div>
            <select
              value={selectedTimeframe}
              onChange={(e) => onTimeframeChange(e.target.value as any)}
              className="px-4 py-3 border-2 border-indigo-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium bg-white shadow-lg hover:shadow-xl transition-all duration-300"
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