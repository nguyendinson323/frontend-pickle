import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FeaturedContent as FeaturedContentType } from '../../../types/common'

interface FeaturedContentProps {
  content: FeaturedContentType[]
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({ content }) => {
  const navigate = useNavigate()

  if (!content || content.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get Started Today
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover everything the Mexican Pickleball Federation has to offer
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate(item.link_url)}
            >
              <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">
                    {item.type === 'promotion' ? '🎯' : item.type === 'feature' ? '⭐' : '📋'}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.type === 'promotion' 
                      ? 'bg-green-100 text-green-800' 
                      : item.type === 'feature'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Learn More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedContent