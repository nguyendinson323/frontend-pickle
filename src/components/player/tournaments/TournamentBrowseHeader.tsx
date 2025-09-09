import React from 'react'
import { useNavigate } from 'react-router-dom'

const TournamentBrowseHeader: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      {/* Navigation Breadcrumb */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <button
                onClick={() => navigate('/player/dashboard')}
                className="text-gray-400 hover:text-gray-500"
              >
                Dashboard
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <span className="ml-4 text-sm font-medium text-gray-500" aria-current="page">
                  Tournaments
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tournaments</h1>
        <p className="mt-1 text-sm text-gray-600">
          Browse and register for upcoming tournaments
        </p>
      </div>
    </>
  )
}

export default TournamentBrowseHeader