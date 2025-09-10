import React from 'react'
import { useNavigate } from 'react-router-dom'

export const PartnerStatisticsTab: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Statistics & Analytics</h3>
        <button
          onClick={() => navigate('/partner/statistics')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          View Full Statistics
        </button>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-medium text-green-900 mb-2">Track Your Performance</h4>
            <p className="text-green-700 mb-4">
              Monitor your partner performance with detailed analytics including interactions, 
              clicks, views, and revenue metrics. Get insights to optimize your business.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">Profile Views</h5>
                    <p className="text-2xl font-bold text-green-600">--</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">Bookings</h5>
                    <p className="text-2xl font-bold text-green-600">--</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Total reservations</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">Revenue</h5>
                    <p className="text-2xl font-bold text-green-600">$--</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">This month</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">Click-through Rate</h5>
                    <p className="text-2xl font-bold text-green-600">--%</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Engagement rate</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">Active Courts</h5>
                    <p className="text-2xl font-bold text-green-600">--</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Available facilities</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">Tournaments</h5>
                    <p className="text-2xl font-bold text-green-600">--</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Events hosted</p>
              </div>
            </div>

            <div className="bg-green-100 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-green-900 mb-2">📊 Available Analytics</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
                <p>• Court utilization rates</p>
                <p>• Revenue by time period</p>
                <p>• Customer demographics</p>
                <p>• Booking patterns</p>
                <p>• Popular time slots</p>
                <p>• Tournament participation</p>
                <p>• Conversion metrics</p>
                <p>• Growth trends</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/partner/statistics')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
              View Detailed Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}