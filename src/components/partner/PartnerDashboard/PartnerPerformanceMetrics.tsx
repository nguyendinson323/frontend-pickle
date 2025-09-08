import React from 'react'
import { useNavigate } from 'react-router-dom'

interface PartnerData {
  courtUtilization?: number
  customerRating?: number
  repeatCustomers?: number
}

interface PartnerPerformanceMetricsProps {
  partnerData: PartnerData
}

const PartnerPerformanceMetrics: React.FC<PartnerPerformanceMetricsProps> = ({ partnerData }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h3>
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-800">Court Utilization</p>
              <p className="text-2xl font-bold text-green-900">{partnerData.courtUtilization || 0}%</p>
            </div>
            <div className="text-3xl text-green-600">📊</div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">Customer Rating</p>
              <p className="text-2xl font-bold text-blue-900">{partnerData.customerRating || 0}/5</p>
            </div>
            <div className="text-3xl text-blue-600">⭐</div>
          </div>
        </div>

        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-purple-800">Repeat Customers</p>
              <p className="text-2xl font-bold text-purple-900">{partnerData.repeatCustomers || 0}%</p>
            </div>
            <div className="text-3xl text-purple-600">🔄</div>
          </div>
        </div>

        <button
          onClick={() => navigate('/partner/analytics')}
          className="text-orange-600 hover:text-orange-500 text-sm font-medium"
        >
          View detailed analytics →
        </button>
      </div>
    </div>
  )
}

export default PartnerPerformanceMetrics