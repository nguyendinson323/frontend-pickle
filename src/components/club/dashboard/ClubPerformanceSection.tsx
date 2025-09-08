import React from 'react'
import { useNavigate } from 'react-router-dom'

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Club Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Growth Metrics */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl mb-2">📈</div>
          <h4 className="font-semibold text-gray-900 mb-1">Member Growth</h4>
          <p className="text-2xl font-bold text-green-600">+{memberGrowth}%</p>
          <p className="text-sm text-gray-600">This quarter</p>
        </div>

        {/* Revenue */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl mb-2">💰</div>
          <h4 className="font-semibold text-gray-900 mb-1">Revenue</h4>
          <p className="text-2xl font-bold text-blue-600">${monthlyRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-600">This month</p>
        </div>

        {/* Satisfaction */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl mb-2">⭐</div>
          <h4 className="font-semibold text-gray-900 mb-1">Member Satisfaction</h4>
          <p className="text-2xl font-bold text-purple-600">{memberSatisfaction}/5</p>
          <p className="text-sm text-gray-600">Average rating</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/club/analytics')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          View Detailed Analytics
        </button>
        <button
          onClick={() => navigate('/club/microsite')}
          className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Manage Club Website
        </button>
      </div>
    </div>
  )
}

export default ClubPerformanceSection