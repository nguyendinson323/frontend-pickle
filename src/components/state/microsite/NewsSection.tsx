import React from 'react'
import { StateMicrositeNews } from '../../../store/slices/stateMicrositeSlice'

interface NewsSectionProps {
  news: StateMicrositeNews[]
  isOwner?: boolean
  onCreateNews?: () => void
  onEditNews?: (news: StateMicrositeNews) => void
  onDeleteNews?: (newsId: number) => void
}

const NewsSection: React.FC<NewsSectionProps> = ({ 
  news, 
  isOwner, 
  onCreateNews, 
  onEditNews, 
  onDeleteNews 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
          <p className="text-gray-600 mt-1">Stay updated with our latest announcements and events</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            {news.length} article{news.length !== 1 ? 's' : ''}
          </div>
          {isOwner && onCreateNews && (
            <button
              onClick={onCreateNews}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add News
            </button>
          )}
        </div>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No news articles</h3>
          <p className="mt-1 text-sm text-gray-500">
            {isOwner ? 'Start by creating your first news article!' : 'Check back later for updates!'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Featured News */}
          {news.filter(article => article.is_featured).slice(0, 1).map((article) => (
            <div key={article.id} className="border-2 border-yellow-200 rounded-lg p-6 bg-yellow-50">
              <div className="flex items-center mb-3">
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-800">
                  Featured
                </span>
                {isOwner && onEditNews && onDeleteNews && (
                  <div className="ml-auto flex items-center space-x-2">
                    <button
                      onClick={() => onEditNews(article)}
                      className="text-gray-600 hover:text-gray-800 p-1"
                      title="Edit article"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this article?')) {
                          onDeleteNews(article.id)
                        }
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete article"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              
              {article.image_url && (
                <div className="mb-4">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
              
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <span>By {article.author_name}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(article.published_date)}</span>
              </div>
              
              <div className="text-gray-700 leading-relaxed">
                {article.content.length > 300 
                  ? `${article.content.substring(0, 300)}...`
                  : article.content
                }
              </div>
              
              {article.content.length > 300 && (
                <button className="mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm">
                  Read More →
                </button>
              )}
            </div>
          ))}

          {/* Regular News */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.filter(article => !article.is_featured).map((article) => (
              <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {article.image_url && (
                  <div className="mb-3">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{article.title}</h3>
                  {isOwner && onEditNews && onDeleteNews && (
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => onEditNews(article)}
                        className="text-gray-600 hover:text-gray-800 p-1"
                        title="Edit article"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this article?')) {
                            onDeleteNews(article.id)
                          }
                        }}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete article"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span>By {article.author_name}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(article.published_date)}</span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-3">
                  {article.content.length > 150 
                    ? `${article.content.substring(0, 150)}...`
                    : article.content
                  }
                </p>
                
                {article.content.length > 150 && (
                  <button className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Read More →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {news.length > 0 && (
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            View All News →
          </button>
        </div>
      )}
    </div>
  )
}

export default NewsSection