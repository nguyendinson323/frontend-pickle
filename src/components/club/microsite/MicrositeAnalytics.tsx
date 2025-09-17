import React from 'react'
import { MicrositeAnalytics as AnalyticsData } from '../../../store/slices/clubMicrositeSlice'
import {
  FiBarChart2,
  FiRefreshCw,
  FiEye,
  FiUsers,
  FiShare2,
  FiClock,
  FiTrendingUp,
  FiSearch,
  FiZap,
  FiAward,
  FiGlobe,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiExternalLink,
  FiTarget
} from 'react-icons/fi'

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
      <div className="bg-gradient-to-br from-white to-green-50 border border-green-200 rounded-3xl shadow-2xl p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gradient-to-r from-green-200 to-emerald-300 rounded-2xl mb-6"></div>
          <div className="space-y-6">
            <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
            <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
            <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="bg-gradient-to-br from-white to-green-50 border border-green-200 rounded-3xl shadow-2xl p-8 text-center">
        <FiBarChart2 className="mx-auto h-16 w-16 text-green-400 mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center">
          <FiInfo className="h-6 w-6 mr-2" />
          Analytics Not Available
        </h3>
        <p className="text-gray-600 mb-6 font-medium text-lg">Publish your microsite first to start collecting analytics data.</p>
        <button
          onClick={onRefreshAnalytics}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl hover:from-green-700 hover:to-emerald-800 font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105 flex items-center mx-auto"
        >
          <FiRefreshCw className="w-5 h-5 mr-2" />
          Refresh Analytics
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-green-50 border border-green-200 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-8 py-6 border-b-4 border-green-800">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <FiBarChart2 className="h-7 w-7 mr-3" />
              Microsite Analytics
            </h2>
            <p className="text-green-100 text-sm font-medium mt-1">Track your microsite performance and visitor engagement</p>
          </div>
          <button
            onClick={onRefreshAnalytics}
            className="px-4 py-3 bg-white bg-opacity-20 text-white rounded-2xl hover:bg-opacity-30 flex items-center font-bold transition-all duration-200 hover:shadow-lg"
          >
            <FiRefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <FiEye className="h-6 w-6 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{analytics.pageViews.toLocaleString()}</div>
            </div>
            <div className="text-sm font-bold text-gray-800">Total Page Views</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <FiUsers className="h-6 w-6 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{analytics.monthlyVisitors.toLocaleString()}</div>
            </div>
            <div className="text-sm font-bold text-gray-800">Monthly Visitors</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <FiShare2 className="h-6 w-6 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{analytics.socialShares}</div>
            </div>
            <div className="text-sm font-bold text-gray-800">Social Shares</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-100 border border-orange-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <FiClock className="h-6 w-6 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{analytics.averageSessionDuration}</div>
            </div>
            <div className="text-sm font-bold text-gray-800">Avg. Session</div>
          </div>
        </div>

        {/* Performance Scores */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FiTarget className="h-6 w-6 mr-3 text-indigo-600" />
            Performance Scores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-200 ${getScoreBg(analytics.contentScore)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FiTrendingUp className="h-5 w-5 mr-2 text-gray-700" />
                  <span className="text-sm font-bold text-gray-800">Content Score</span>
                </div>
                <span className={`text-xl font-bold ${getScoreColor(analytics.contentScore)}`}>
                  {Math.round(analytics.contentScore)}%
                </span>
              </div>
              <div className="bg-white rounded-full h-3 shadow-inner">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${analytics.contentScore >= 80 ? 'bg-green-500' : analytics.contentScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${analytics.contentScore}%` }}
                ></div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-200 ${getScoreBg(analytics.seoScore)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FiSearch className="h-5 w-5 mr-2 text-gray-700" />
                  <span className="text-sm font-bold text-gray-800">SEO Score</span>
                </div>
                <span className={`text-xl font-bold ${getScoreColor(analytics.seoScore)}`}>
                  {Math.round(analytics.seoScore)}%
                </span>
              </div>
              <div className="bg-white rounded-full h-3 shadow-inner">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${analytics.seoScore >= 80 ? 'bg-green-500' : analytics.seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${analytics.seoScore}%` }}
                ></div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-200 ${getScoreBg(analytics.performanceScore)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FiZap className="h-5 w-5 mr-2 text-gray-700" />
                  <span className="text-sm font-bold text-gray-800">Performance</span>
                </div>
                <span className={`text-xl font-bold ${getScoreColor(analytics.performanceScore)}`}>
                  {Math.round(analytics.performanceScore)}%
                </span>
              </div>
              <div className="bg-white rounded-full h-3 shadow-inner">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${analytics.performanceScore >= 80 ? 'bg-green-500' : analytics.performanceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${analytics.performanceScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Pages */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiAward className="h-6 w-6 mr-3 text-yellow-600" />
              Top Pages
            </h3>
            <div className="space-y-4">
              {analytics.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-4 bg-white border border-yellow-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg' :
                      index === 2 ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' :
                      'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 shadow-lg'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-bold text-gray-800">{page.page}</span>
                  </div>
                  <span className="text-gray-600 font-bold">{page.views.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          </div>

          {/* Site Status & Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiGlobe className="h-6 w-6 mr-3 text-blue-600" />
              Site Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white border border-blue-200 rounded-2xl shadow-sm">
                <div className="flex items-center">
                  <FiEye className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-gray-800 font-bold">Visibility Status</span>
                </div>
                <span className={`px-3 py-2 rounded-2xl text-xs font-bold shadow-sm ${
                  analytics.visibilityStatus === 'public'
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
                }`}>
                  {analytics.visibilityStatus}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-blue-200 rounded-2xl shadow-sm">
                <div className="flex items-center">
                  <FiCheckCircle className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-gray-800 font-bold">Approval Status</span>
                </div>
                <span className={`px-3 py-2 rounded-2xl text-xs font-bold shadow-sm ${
                  analytics.approvalStatus === 'approved'
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                    : analytics.approvalStatus === 'pending'
                    ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200'
                    : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
                }`}>
                  {analytics.approvalStatus}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-blue-200 rounded-2xl shadow-sm">
                <div className="flex items-center">
                  <FiTrendingUp className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-gray-800 font-bold">Bounce Rate</span>
                </div>
                <span className="font-bold text-blue-600">{analytics.bounceRate}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-blue-200 rounded-2xl shadow-sm">
                <div className="flex items-center">
                  <FiClock className="h-4 w-4 mr-2 text-gray-600" />
                  <span className="text-gray-800 font-bold">Last Audit</span>
                </div>
                <span className="font-bold text-blue-600">{formatDate(analytics.lastAudit)}</span>
              </div>
            </div>

            {analytics.publicUrl && (
              <div className="mt-6 p-4 bg-gradient-to-r from-indigo-100 to-blue-100 border border-indigo-300 rounded-2xl">
                <div className="text-sm font-bold text-indigo-900 mb-2 flex items-center">
                  <FiExternalLink className="h-4 w-4 mr-2" />
                  Public URL
                </div>
                <a
                  href={analytics.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-800 break-all font-medium hover:underline transition-colors duration-200"
                >
                  {analytics.publicUrl}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="border-t-2 border-gray-200 pt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FiInfo className="h-6 w-6 mr-3 text-gray-600" />
            Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analytics.contentScore < 80 && (
              <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl shadow-lg">
                <div className="flex items-start">
                  <FiAlertTriangle className="flex-shrink-0 h-6 w-6 text-yellow-600 mr-4 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-yellow-800 mb-2">Improve Content</h4>
                    <p className="text-sm text-yellow-700 font-medium">Add more detailed descriptions, images, and club information to improve your content score.</p>
                  </div>
                </div>
              </div>
            )}

            {analytics.seoScore < 80 && (
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl shadow-lg">
                <div className="flex items-start">
                  <FiInfo className="flex-shrink-0 h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-blue-800 mb-2">SEO Optimization</h4>
                    <p className="text-sm text-blue-700 font-medium">Add more keywords, meta descriptions, and structured data to improve search visibility.</p>
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