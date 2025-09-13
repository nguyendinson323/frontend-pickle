import React, { useEffect } from 'react'
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">State Microsite</h3>
          <p className="text-sm text-gray-600">Manage your state's public microsite and content</p>
        </div>
        <button
          onClick={() => navigate('/state/microsite')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Manage Microsite
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Microsite Overview */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-semibold mb-2">Your State Microsite</h4>
            <p className="text-red-100 mb-4">
              Create a professional online presence for your state committee with a customizable microsite.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <span>🌐 Custom Domain</span>
              <span>📱 Mobile Responsive</span>
              <span>📰 News Management</span>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate('/state/microsite')}
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Customize Site
            </button>
            {micrositeInfo?.is_public && (
              <p className="text-red-100 text-sm mt-2">✓ Site is Live</p>
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