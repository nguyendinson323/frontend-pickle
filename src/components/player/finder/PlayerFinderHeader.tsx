import React from 'react'
import { useNavigate } from 'react-router-dom'

interface PlayerFinderHeaderProps {
  isPremium: boolean
}

const PlayerFinderHeader: React.FC<PlayerFinderHeaderProps> = ({ isPremium }) => {
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
                  Player Finder
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Player Finder</h1>
        <p className="mt-1 text-sm text-gray-600">
          Find nearby players for matches and practice sessions
          {!isPremium && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Premium Feature
            </span>
          )}
        </p>
      </div>
    </>
  )
}

export default PlayerFinderHeader