import React from 'react'
import { RevenueData } from '../../../store/slices/partnerStatisticsSlice'
import {
  FiBarChart2,
  FiDollarSign,
  FiHome,
  FiAward,
  FiTrendingUp,
  FiCalendar,
  FiActivity
} from 'react-icons/fi'

interface RevenueChartProps {
  revenueData: RevenueData[]
}

const RevenueChart: React.FC<RevenueChartProps> = ({ revenueData }) => {
  if (revenueData.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-4">
            <FiBarChart2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Revenue Overview</h2>
        </div>
        <div className="text-center text-gray-500 py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiDollarSign className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Revenue Data</h3>
          <p className="text-lg text-gray-600">No revenue data available for the selected period</p>
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
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-8 mb-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-4">
          <FiTrendingUp className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Revenue Overview</h2>
      </div>
      
      <div className="space-y-6">
        {revenueData.map((item, index) => (
          <div key={item.month} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <FiCalendar className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900 text-lg">{formatMonth(item.month)}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-2xl text-green-600">{formatCurrency(item.total_revenue)}</span>
                <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden mb-4 shadow-inner">
              <div
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-6 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${maxRevenue > 0 ? (item.total_revenue / maxRevenue) * 100 : 0}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white drop-shadow-lg">
                  {maxRevenue > 0 ? Math.round((item.total_revenue / maxRevenue) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiHome className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-blue-800">Court Revenue</span>
                  </div>
                  <span className="font-bold text-blue-600">{formatCurrency(item.court_revenue)}</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiAward className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-semibold text-purple-800">Tournament Revenue</span>
                  </div>
                  <span className="font-bold text-purple-600">{formatCurrency(item.tournament_revenue)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t-2 border-gray-200">
        <div className="flex items-center mb-6">
          <FiActivity className="w-6 h-6 text-gray-600 mr-2" />
          <h3 className="text-xl font-bold text-gray-900">Revenue Summary</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiDollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(revenueData.reduce((sum, item) => sum + item.total_revenue, 0))}
            </div>
            <div className="text-sm font-bold text-green-700">Total Revenue</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiHome className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatCurrency(revenueData.reduce((sum, item) => sum + item.court_revenue, 0))}
            </div>
            <div className="text-sm font-bold text-blue-700">Court Revenue</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiAward className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatCurrency(revenueData.reduce((sum, item) => sum + item.tournament_revenue, 0))}
            </div>
            <div className="text-sm font-bold text-purple-700">Tournament Revenue</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueChart