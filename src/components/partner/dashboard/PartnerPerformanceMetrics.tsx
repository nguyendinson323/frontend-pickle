import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiBarChart2,
  FiStar,
  FiRefreshCw,
  FiTrendingUp,
  FiArrowRight
} from 'react-icons/fi'

interface PartnerData {
  stats: {
    court_utilization?: number
    customer_rating?: number
    repeat_customers?: number
  }
}

interface PartnerPerformanceMetricsProps {
  partnerData: PartnerData
}

const PartnerPerformanceMetrics: React.FC<PartnerPerformanceMetricsProps> = ({ partnerData }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-3">
          <FiTrendingUp className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Performance Metrics</h3>
      </div>
      <div className="space-y-4">
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-green-800 mb-2">Court Utilization</p>
              <p className="text-3xl font-bold text-green-900">{partnerData.stats.court_utilization || 0}%</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center">
              <FiBarChart2 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-blue-800 mb-2">Customer Rating</p>
              <p className="text-3xl font-bold text-blue-900">{partnerData.stats.customer_rating || 0}/5</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center">
              <FiStar className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-purple-800 mb-2">Repeat Customers</p>
              <p className="text-3xl font-bold text-purple-900">{partnerData.stats.repeat_customers || 0}%</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center">
              <FiRefreshCw className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/partner/statistics')}
          className="text-orange-600 hover:text-orange-700 text-sm font-bold flex items-center transition-colors duration-200"
        >
          View detailed analytics
          <FiArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  )
}

export default PartnerPerformanceMetrics