import React from 'react'
import { NewsArticle } from '../../../types/common'

interface NewsSectionProps {
  articles: NewsArticle[]
}

const NewsSection: React.FC<NewsSectionProps> = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tournaments':
        return 'bg-blue-100 text-blue-800'
      case 'facilities':
        return 'bg-green-100 text-green-800'
      case 'education':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest News & Updates
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed about the latest developments in Mexican pickleball
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">📰</div>
                  <div className="text-sm font-medium">{article.category}</div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </span>
                  {article.is_featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.content}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>By {article.author}</span>
                  <time dateTime={article.published_at}>
                    {formatDate(article.published_at)}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewsSection