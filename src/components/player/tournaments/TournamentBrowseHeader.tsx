import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiHome, FiAward, FiChevronRight } from 'react-icons/fi'

const TournamentBrowseHeader: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      {/* Navigation Breadcrumb */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-3">
            <li>
              <button
                onClick={() => navigate('/player/dashboard')}
                className="flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-2xl font-medium transition-all duration-300 border-2 border-transparent hover:border-indigo-200 shadow-lg hover:shadow-xl group"
              >
                <FiHome className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Dashboard
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <FiChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" />
                <div className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100 shadow-lg">
                  <FiAward className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-bold text-purple-700" aria-current="page">
                    Tournaments
                  </span>
                </div>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8 bg-gradient-to-r from-indigo-50 via-white to-purple-50">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-6 shadow-xl">
              <FiAward className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-2">Tournament Center</h1>
              <p className="text-lg text-gray-600 font-medium">
                Discover and register for exciting pickleball tournaments in your area
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TournamentBrowseHeader