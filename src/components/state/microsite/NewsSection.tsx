import React from 'react'
import { StateMicrositeNews } from '../../../store/slices/stateMicrositeSlice'
import { FiFileText, FiPlus, FiEdit, FiTrash2, FiUser, FiCalendar, FiEye, FiStar, FiArrowRight } from 'react-icons/fi'

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
    <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-3xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-orange-500 p-3 rounded-2xl shadow-lg">
              <FiFileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest News</h2>
          </div>
          <p className="text-gray-600 text-lg">Stay updated with our latest announcements and events</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-xl font-bold text-sm">
            {news.length} article{news.length !== 1 ? 's' : ''}
          </div>
          {isOwner && onCreateNews && (
            <button
              onClick={onCreateNews}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add News</span>
            </button>
          )}
        </div>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-100 to-orange-200 p-8 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg mb-6">
            <FiFileText className="w-12 h-12 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No news articles</h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            {isOwner ? 'Start by creating your first news article!' : 'Check back later for updates!'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Featured News */}
          {news.filter(article => article.is_featured).slice(0, 1).map((article) => (
            <div key={article.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-xl border-2 border-yellow-300/50 p-8 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -translate-y-16 translate-x-16 blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400/10 rounded-full translate-y-12 -translate-x-12 blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl shadow-sm bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                    <FiStar className="w-4 h-4 mr-2" />
                    Featured
                  </div>
                  {isOwner && onEditNews && onDeleteNews && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditNews(article)}
                        className="bg-white/60 text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-3 rounded-xl backdrop-blur-sm shadow-lg transition-all duration-200 hover:scale-105"
                        title="Edit article"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this article?')) {
                            onDeleteNews(article.id)
                          }
                        }}
                        className="bg-white/60 text-gray-600 hover:text-red-600 hover:bg-red-50 p-3 rounded-xl backdrop-blur-sm shadow-lg transition-all duration-200 hover:scale-105"
                        title="Delete article"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {article.image_url && (
                <div className="relative mb-6">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{article.title}</h3>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2 bg-white/60 rounded-xl px-3 py-2 backdrop-blur-sm">
                  <FiUser className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">By {article.author_name}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/60 rounded-xl px-3 py-2 backdrop-blur-sm">
                  <FiCalendar className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">{formatDate(article.published_date)}</span>
                </div>
              </div>

              <div className="text-gray-700 leading-relaxed text-lg bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                {article.content.length > 300
                  ? `${article.content.substring(0, 300)}...`
                  : article.content
                }
              </div>

              {article.content.length > 300 && (
                <button className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2">
                  <FiEye className="w-4 h-4" />
                  <span>Read More</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {/* Regular News */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.filter(article => !article.is_featured).map((article) => (
              <div key={article.id} className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                {article.image_url && (
                  <div className="relative mb-4 overflow-hidden rounded-2xl">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">{article.title}</h3>
                  {isOwner && onEditNews && onDeleteNews && (
                    <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                      <button
                        onClick={() => onEditNews(article)}
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-lg transition-all duration-200 hover:scale-110"
                        title="Edit article"
                      >
                        <FiEdit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this article?')) {
                            onDeleteNews(article.id)
                          }
                        }}
                        className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-lg transition-all duration-200 hover:scale-110"
                        title="Delete article"
                      >
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 p-1 rounded-lg">
                      <FiUser className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">By {article.author_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 p-1 rounded-lg">
                      <FiCalendar className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{formatDate(article.published_date)}</span>
                  </div>
                </div>

                <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm mb-4">
                  <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                    {article.content.length > 150
                      ? `${article.content.substring(0, 150)}...`
                      : article.content
                    }
                  </p>
                </div>

                {article.content.length > 150 && (
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2">
                    <FiEye className="w-4 h-4" />
                    <span>Read More</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {news.length > 0 && (
        <div className="mt-8 text-center">
          <button className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2 mx-auto">
            <span>View All News</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      )}
    </div>
  )
}

export default NewsSection