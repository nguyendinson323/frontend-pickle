import React, { useState } from 'react'
import { User } from '../../../types/auth'

interface CoachConnectionTabProps {
  user: User
}

const CoachConnectionTab: React.FC<CoachConnectionTabProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilters, setSearchFilters] = useState({
    userType: 'all',
    location: 'all',
    level: 'all'
  })

  if (!user.is_premium) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🔒</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Premium Feature</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          The Connection tab allows you to search and connect with other players and coaches in the federation network. 
          This feature is available with a Premium membership.
        </p>
        <div className="space-y-4">
          <button className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 font-medium">
            Upgrade to Premium
          </button>
          <div className="text-sm text-gray-500">
            <p>Premium features include:</p>
            <ul className="mt-2 space-y-1">
              <li>• Search and connect with players and coaches</li>
              <li>• Advanced filtering options</li>
              <li>• Direct messaging capabilities</li>
              <li>• Priority support</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Find Other Users</h3>
        <p className="text-gray-600 mt-1">
          Connect with players and coaches in the federation network
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by name or location
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter name, city, or state..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Type
              </label>
              <select
                value={searchFilters.userType}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, userType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Users</option>
                <option value="player">Players</option>
                <option value="coach">Coaches</option>
                <option value="club">Clubs</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={searchFilters.location}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Locations</option>
                <option value="same-state">Same State</option>
                <option value="nearby">Nearby States</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NRTP Level
              </label>
              <select
                value={searchFilters.level}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, level: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Levels</option>
                <option value="1.0-2.0">1.0 - 2.0</option>
                <option value="2.5-3.0">2.5 - 3.0</option>
                <option value="3.5-4.0">3.5 - 4.0</option>
                <option value="4.5-5.0">4.5 - 5.0</option>
              </select>
            </div>
          </div>

          <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
            Search Users
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Search Results</h4>
        
        {/* Sample Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">👨</span>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Carlos Martinez</h5>
                <p className="text-sm text-gray-600">Player • Level 3.0 • Mexico City</p>
                <p className="text-xs text-gray-500">Last active: 2 hours ago</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                Connect
              </button>
              <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50">
                View Profile
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">👩‍🏫</span>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Ana Rodriguez</h5>
                <p className="text-sm text-gray-600">Coach • Level 4.5 • Guadalajara</p>
                <p className="text-xs text-gray-500">Last active: 1 day ago</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                Connect
              </button>
              <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50">
                View Profile
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">🏛️</span>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Club Deportivo Pickleball</h5>
                <p className="text-sm text-gray-600">Club • 45 members • Monterrey</p>
                <p className="text-xs text-gray-500">Has 3 courts available</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                Connect
              </button>
              <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50">
                View Profile
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button className="text-green-600 hover:text-green-700 font-medium">
            Load More Results
          </button>
        </div>
      </div>

      {/* My Connections */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">My Connections</h4>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <p className="text-gray-600">You haven't connected with anyone yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Use the search above to find and connect with other users.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CoachConnectionTab