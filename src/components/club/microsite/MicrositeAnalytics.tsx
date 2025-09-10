import React from 'react'
import { MicrositeAnalytics as AnalyticsData } from '../../../store/slices/clubMicrositeSlice'

interface MicrositeAnalyticsProps {
  analytics: AnalyticsData | null
  onRefreshAnalytics: () => void
  loading: boolean
}

const MicrositeAnalytics: React.FC<MicrositeAnalyticsProps> = ({
  analytics,
  onRefreshAnalytics,
  loading
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Not Available</h3>
        <p className="text-gray-600 mb-4">Publish your microsite first to start collecting analytics data.</p>
        <button
          onClick={onRefreshAnalytics}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh Analytics
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Microsite Analytics</h2>
            <p className="text-sm text-gray-600">Track your microsite performance and visitor engagement</p>
          </div>
          <button
            onClick={onRefreshAnalytics}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{analytics.pageViews.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Page Views</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{analytics.monthlyVisitors.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Monthly Visitors</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{analytics.socialShares}</div>
            <div className="text-sm text-gray-600">Social Shares</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{analytics.averageSessionDuration}</div>
            <div className="text-sm text-gray-600">Avg. Session</div>
          </div>
        </div>

        {/* Performance Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${getScoreBg(analytics.contentScore)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Content Score</span>
              <span className={`text-lg font-bold ${getScoreColor(analytics.contentScore)}`}>
                {Math.round(analytics.contentScore)}%
              </span>
            </div>
            <div className="bg-white rounded-full h-2">
              <div
                className={`h-2 rounded-full ${analytics.contentScore >= 80 ? 'bg-green-500' : analytics.contentScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${analytics.contentScore}%` }}
              ></div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${getScoreBg(analytics.seoScore)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">SEO Score</span>
              <span className={`text-lg font-bold ${getScoreColor(analytics.seoScore)}`}>
                {Math.round(analytics.seoScore)}%
              </span>
            </div>
            <div className="bg-white rounded-full h-2">
              <div
                className={`h-2 rounded-full ${analytics.seoScore >= 80 ? 'bg-green-500' : analytics.seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${analytics.seoScore}%` }}
              ></div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${getScoreBg(analytics.performanceScore)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Performance</span>
              <span className={`text-lg font-bold ${getScoreColor(analytics.performanceScore)}`}>
                {Math.round(analytics.performanceScore)}%
              </span>
            </div>
            <div className="bg-white rounded-full h-2">
              <div
                className={`h-2 rounded-full ${analytics.performanceScore >= 80 ? 'bg-green-500' : analytics.performanceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${analytics.performanceScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Pages */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Pages</h3>
            <div className="space-y-2">
              {analytics.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${
                      index === 0 ? 'bg-yellow-500 text-white' : 
                      index === 1 ? 'bg-gray-400 text-white' : 
                      index === 2 ? 'bg-orange-600 text-white' : 
                      'bg-gray-300 text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{page.page}</span>
                  </div>
                  <span className="text-gray-600">{page.views.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          </div>

          {/* Site Status & Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Site Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Visibility Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  analytics.visibilityStatus === 'public' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {analytics.visibilityStatus}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Approval Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  analytics.approvalStatus === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : analytics.approvalStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {analytics.approvalStatus}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Bounce Rate</span>
                <span className="font-medium">{analytics.bounceRate}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Last Audit</span>
                <span className="font-medium">{formatDate(analytics.lastAudit)}</span>
              </div>
            </div>

            {analytics.publicUrl && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-1">Public URL</div>
                <a
                  href={analytics.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 break-all"
                >
                  {analytics.publicUrl}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.contentScore < 80 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex">
                  <svg className="flex-shrink-0 h-5 w-5 text-yellow-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">Improve Content</h4>
                    <p className="text-sm text-yellow-700 mt-1">Add more detailed descriptions, images, and club information to improve your content score.</p>
                  </div>
                </div>
              </div>
            )}
            
            {analytics.seoScore < 80 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex">
                  <svg className="flex-shrink-0 h-5 w-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">SEO Optimization</h4>
                    <p className="text-sm text-blue-700 mt-1">Add more keywords, meta descriptions, and structured data to improve search visibility.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MicrositeAnalytics