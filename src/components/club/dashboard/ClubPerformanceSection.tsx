import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiTrendingUp,
  FiDollarSign,
  FiHeart,
  FiBarChart,
  FiArrowRight,
  FiSettings,
  FiActivity,
  FiStar
} from 'react-icons/fi'

interface ClubPerformanceSectionProps {
  memberGrowth?: number
  monthlyRevenue?: number
  memberSatisfaction?: number
}

const ClubPerformanceSection: React.FC<ClubPerformanceSectionProps> = ({ 
  memberGrowth = 0, 
  monthlyRevenue = 0, 
  memberSatisfaction = 0 
}) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-100 p-8 border-b-2 border-indigo-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiActivity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Club Performance</h3>
              <p className="text-indigo-700 font-medium">Key metrics and insights</p>
            </div>
          </div>
          <FiBarChart className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Growth Metrics */}
          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-table-row" style={{ animationDelay: '0ms' }}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <FiTrendingUp className="h-7 w-7" />
              </div>
            </div>
            <h4 className="text-lg font-bold text-green-900 mb-2">Member Growth</h4>
            <p className="text-3xl font-bold text-green-900 mb-1">+{memberGrowth}%</p>
            <p className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-xl border border-green-200">This quarter</p>
          </div>

          {/* Revenue */}
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-table-row" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <FiDollarSign className="h-7 w-7" />
              </div>
            </div>
            <h4 className="text-lg font-bold text-blue-900 mb-2">Revenue</h4>
            <p className="text-3xl font-bold text-blue-900 mb-1">${monthlyRevenue.toLocaleString()}</p>
            <p className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-xl border border-blue-200">This month</p>
          </div>

          {/* Satisfaction */}
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-100 border-2 border-purple-200 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-table-row" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <FiStar className="h-7 w-7" />
              </div>
            </div>
            <h4 className="text-lg font-bold text-purple-900 mb-2">Member Satisfaction</h4>
            <p className="text-3xl font-bold text-purple-900 mb-1">{memberSatisfaction}%</p>
            <p className="text-sm font-medium text-purple-700 bg-purple-100 px-3 py-1 rounded-xl border border-purple-200">Satisfaction score</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/club/dashboard')}
            className="inline-flex items-center flex-1 justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiBarChart className="h-5 w-5 mr-2" />
            View Detailed Analytics
            <FiArrowRight className="h-5 w-5 ml-2" />
          </button>
          <button
            onClick={() => navigate('/club/microsite')}
            className="inline-flex items-center flex-1 justify-center px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiSettings className="h-5 w-5 mr-2" />
            Manage Club Website
            <FiArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClubPerformanceSection