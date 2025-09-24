import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiUsers,
  FiSearch,
  FiChevronRight,
  FiStar,
  FiHome
} from 'react-icons/fi'

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
          <ol className="flex items-center space-x-4 bg-white rounded-2xl px-6 py-4 shadow-lg border border-gray-100">
            <li>
              <button
                onClick={() => navigate('/player/dashboard')}
                className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
              >
                <FiHome className="w-4 h-4 mr-2" />
                Dashboard
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <FiChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" />
                <span className="text-sm font-bold text-gray-700" aria-current="page">
                  Player Finder
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center mr-6">
              <FiUsers className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Player Finder</h1>
              <p className="text-lg text-indigo-100 font-medium">
                Connect with players for matches and practice sessions
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiSearch className="w-5 h-5 mr-2 text-indigo-200" />
              <span className="text-indigo-100 font-medium">Discover new playing partners</span>
            </div>
            {!isPremium && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full flex items-center shadow-lg">
                <FiStar className="w-4 h-4 mr-2 text-white" />
                <span className="text-sm font-bold text-white">
                  Premium Feature
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default PlayerFinderHeader