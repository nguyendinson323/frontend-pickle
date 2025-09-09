import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { MicrositeAdmin } from '../../../types/admin'
import { getMicrositeAnalytics } from '../../../store/slices/adminMicrositesSlice'

interface MicrositeAnalyticsModalProps {
  microsite: MicrositeAdmin
  onClose: () => void
}

const MicrositeAnalyticsModal: React.FC<MicrositeAnalyticsModalProps> = ({ microsite, onClose }) => {
  const dispatch = useDispatch()
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const result = await dispatch(getMicrositeAnalytics(microsite.id, period) as any)
        setAnalytics(result.payload || result)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [dispatch, microsite.id, period])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading analytics...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Microsite Analytics</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900">{microsite.title}</h4>
          <p className="text-sm text-blue-700">Domain: {microsite.domain_name}</p>
        </div>

        {/* Period Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Period
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-48 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>

        {analytics && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatNumber(analytics.summary?.total_visitors || 0)}
                  </div>
                  <div className="text-sm text-blue-700">Total Visitors</div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {formatNumber(analytics.summary?.total_page_views || 0)}
                  </div>
                  <div className="text-sm text-green-700">Total Page Views</div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {Math.round(analytics.summary?.avg_daily_visitors || 0)}
                  </div>
                  <div className="text-sm text-purple-700">Avg Daily Visitors</div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {analytics.summary?.peak_day ? formatNumber(analytics.summary.peak_day.visitors) : '0'}
                  </div>
                  <div className="text-sm text-orange-700">Peak Day Visitors</div>
                  {analytics.summary?.peak_day && (
                    <div className="text-xs text-orange-600 mt-1">
                      {formatDate(analytics.summary.peak_day.date)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Daily Analytics Chart (Simple Table) */}
            {analytics.analytics && analytics.analytics.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Daily Analytics</h4>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Visitors
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Page Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bounce Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg Session Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.analytics.slice(0, 15).map((day: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(day.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(day.visitors || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(day.page_views || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {day.bounce_rate ? `${day.bounce_rate}%` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {day.avg_session_duration ? `${Math.round(day.avg_session_duration / 60)}m` : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {analytics.analytics.length > 15 && (
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Showing latest 15 days. Total {analytics.analytics.length} days of data available.
                  </p>
                )}
              </div>
            )}

            {/* Performance Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Traffic Trends</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Period:</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.period}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Data Points:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {analytics.analytics ? analytics.analytics.length : 0} days
                    </span>
                  </div>

                  {analytics.summary?.peak_day && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Best Day:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(analytics.summary.peak_day.date)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Overall Performance</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Content Score:</span>
                    <span className={`text-sm font-medium ${
                      microsite.content_score >= 80 ? 'text-green-600' :
                      microsite.content_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {microsite.content_score}/100
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SEO Score:</span>
                    <span className={`text-sm font-medium ${
                      microsite.seo_score >= 80 ? 'text-green-600' :
                      microsite.seo_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {microsite.seo_score}/100
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Performance:</span>
                    <span className={`text-sm font-medium ${
                      microsite.performance_score >= 80 ? 'text-green-600' :
                      microsite.performance_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {microsite.performance_score}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* No Data Message */}
            {(!analytics.analytics || analytics.analytics.length === 0) && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No analytics data</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No analytics data available for the selected period.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default MicrositeAnalyticsModal