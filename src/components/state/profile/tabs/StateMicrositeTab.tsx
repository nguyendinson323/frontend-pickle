import React, { useEffect } from 'react'
import { FiGlobe, FiEye, FiEdit, FiPlus, FiSettings, FiImage, FiShare2, FiUsers, FiActivity, FiLoader, FiFolder, FiStar, FiCheckCircle, FiExternalLink, FiSmartphone, FiMonitor, FiTrendingUp, FiHeart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../store'
import { fetchStateMicrositeData } from '../../../../store/slices/stateMicrositeSlice'

export const StateMicrositeTab: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const {
    micrositeInfo,
    news,
    loading,
    error
  } = useSelector((state: RootState) => state.stateMicrosite)

  useEffect(() => {
    dispatch(fetchStateMicrositeData())
  }, [dispatch])

  if (loading && !micrositeInfo) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section with Modern Design */}
      <div className="bg-gradient-to-br from-white to-pink-50 rounded-3xl shadow-2xl border-2 border-gray-200/50 p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-rose-600 rounded-3xl flex items-center justify-center shadow-xl">
              <FiGlobe className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-900 via-rose-900 to-red-900 bg-clip-text text-transparent mb-2">State Microsite Studio</h3>
              <p className="text-lg text-gray-600 font-medium">Create and manage your state's professional public microsite with advanced content tools</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/state/microsite')}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pink-600 to-pink-700 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <FiSettings className="w-5 h-5 mr-3" />
            Manage Microsite
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Microsite Overview */}
      <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 rounded-3xl shadow-2xl border-2 border-pink-200/50 p-8 text-white backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/20 rounded-full translate-y-24 -translate-x-24 blur-2xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h4 className="text-3xl font-bold mb-4">Your Professional State Microsite</h4>
            <p className="text-pink-100 mb-6 text-lg leading-relaxed">
              Create a stunning professional online presence for your state committee with a fully customizable, responsive microsite platform.
            </p>
            <div className="flex items-center space-x-6 text-base">
              <div className="flex items-center space-x-2 bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm">
                <FiGlobe className="w-5 h-5" />
                <span className="font-bold">Custom Domain</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm">
                <FiSmartphone className="w-5 h-5" />
                <span className="font-bold">Mobile Responsive</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm">
                <FiImage className="w-5 h-5" />
                <span className="font-bold">News Management</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm">
                <FiTrendingUp className="w-5 h-5" />
                <span className="font-bold">Analytics</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate('/state/microsite')}
              className="bg-white text-pink-600 px-8 py-4 rounded-3xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-white/50 transform hover:scale-105 transition-all duration-300 mb-3"
            >
              <FiEdit className="w-5 h-5 inline mr-3" />
              Customize Site
            </button>
            {micrositeInfo?.is_public && (
              <div className="flex items-center justify-center space-x-2 bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm">
                <FiCheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-pink-100 font-bold">Site is Live</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Microsite Status */}
      {micrositeInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Site Information</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                <p className="text-gray-900">{micrositeInfo.title || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                <p className="text-gray-900 text-sm">{micrositeInfo.description || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Contact Email</label>
                <p className="text-gray-900">{micrositeInfo.contact_email || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  micrositeInfo.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {micrositeInfo.is_public ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Social Media</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Website</label>
                <p className="text-gray-900">{micrositeInfo.website_url || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Facebook</label>
                <p className="text-gray-900">{micrositeInfo.facebook_url || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Instagram</label>
                <p className="text-gray-900">{micrositeInfo.instagram_url || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Twitter</label>
                <p className="text-gray-900">{micrositeInfo.twitter_url || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent News Articles */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h4 className="font-medium text-gray-900">Recent News Articles</h4>
          <button
            onClick={() => navigate('/state/microsite?section=news')}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Manage News
          </button>
        </div>

        {news.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No News Articles</h4>
            <p className="text-gray-600 mb-4">Start creating content for your microsite.</p>
            <button
              onClick={() => navigate('/state/microsite?action=create-news')}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Create First Article
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {news.slice(0, 3).map((article) => (
              <div key={article.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-gray-900 truncate">{article.title}</h5>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        article.is_featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {article.is_featured ? 'Featured' : 'Regular'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {article.content.length > 100
                        ? article.content.substring(0, 100) + '...'
                        : article.content
                      }
                    </p>
                    <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                      <span>By: {article.author_name}</span>
                      <span>
                        {new Date(article.published_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {news.length > 3 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <button
              onClick={() => navigate('/state/microsite?section=news')}
              className="inline-flex items-center px-4 py-2 text-red-600 hover:text-red-700 font-medium"
            >
              View All {news.length} Articles
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/state/microsite?action=edit-info')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Site Info
        </button>
        <button
          onClick={() => navigate('/state/microsite?action=create-news')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create News Article
        </button>
        <button
          onClick={() => window.open(`/microsite/state/${micrositeInfo?.state_committee_id}`, '_blank')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview Site
        </button>
      </div>
    </div>
  )
}