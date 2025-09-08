import React from 'react'
import { useNavigate } from 'react-router-dom'

const CourtsListing: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Available Courts
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reserve courts at top-rated facilities across Mexico
          </p>
        </div>

        {/* Placeholder for courts - would be loaded from API */}
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Court listings coming soon</h3>
          <p className="text-gray-500 mb-6">
            We're working with clubs and partners to bring you the best court booking experience.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Join Federation to Access Courts
          </button>
        </div>
      </div>
    </section>
  )
}

export default CourtsListing