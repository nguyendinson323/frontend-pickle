import React from 'react'
import { RevenueData } from '../../../store/slices/partnerStatisticsSlice'

interface RevenueChartProps {
  revenueData: RevenueData[]
}

const RevenueChart: React.FC<RevenueChartProps> = ({ revenueData }) => {
  if (revenueData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Overview</h2>
        <div className="text-center text-gray-500 py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p>No revenue data available for the selected period</p>
        </div>
      </div>
    )
  }

  const maxRevenue = Math.max(...revenueData.map(item => item.total_revenue))
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`
  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Overview</h2>
      
      <div className="space-y-4">
        {revenueData.map((item) => (
          <div key={item.month} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">{formatMonth(item.month)}</span>
              <span className="font-semibold text-green-600">{formatCurrency(item.total_revenue)}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${maxRevenue > 0 ? (item.total_revenue / maxRevenue) * 100 : 0}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Court Revenue:</span>
                <span className="font-medium">{formatCurrency(item.court_revenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tournament Revenue:</span>
                <span className="font-medium">{formatCurrency(item.tournament_revenue)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(revenueData.reduce((sum, item) => sum + item.total_revenue, 0))}
            </div>
            <div className="text-sm text-gray-500">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(revenueData.reduce((sum, item) => sum + item.court_revenue, 0))}
            </div>
            <div className="text-sm text-gray-500">Court Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(revenueData.reduce((sum, item) => sum + item.tournament_revenue, 0))}
            </div>
            <div className="text-sm text-gray-500">Tournament Revenue</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueChart