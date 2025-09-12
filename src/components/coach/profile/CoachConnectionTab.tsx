import React, { useState } from 'react'
import { User } from '../../../types/auth'
import api from '../../../services/api'

interface SearchUser {
  id: number
  full_name: string
  role: string
  nrtp_level?: number
  state_name?: string
  profile_photo_url?: string
  hourly_rate?: number
  club_name?: string
  business_name?: string
  last_active?: string
}

interface CoachConnectionTabProps {
  user: User
}

const CoachConnectionTab: React.FC<CoachConnectionTabProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [searchFilters, setSearchFilters] = useState({
    userType: 'all',
    location: 'all',
    level: 'all'
  })

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setSearchError(null)

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type: searchFilters.userType,
        location: searchFilters.location,
        level: searchFilters.level
      })

      const response = await api.get<{ users: SearchUser[] }>(`/api/users/search?${params}`)
      setSearchResults(response.data.users || [])
    } catch (error: any) {
      console.error('Search failed:', error)
      setSearchError('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const getUserIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'player': return '👨'
      case 'coach': return '👨‍🏫'  
      case 'club': return '🏛️'
      case 'partner': return '🤝'
      case 'state': return '🏛️'
      default: return '👤'
    }
  }

  const getUserDescription = (user: SearchUser) => {
    const parts = []
    
    parts.push(user.role.charAt(0).toUpperCase() + user.role.slice(1))
    
    if (user.nrtp_level) {
      parts.push(`Level ${user.nrtp_level}`)
    }
    
    if (user.state_name) {
      parts.push(user.state_name)
    }
    
    if (user.hourly_rate && user.role === 'coach') {
      parts.push(`$${user.hourly_rate}/hr`)
    }

    return parts.join(' • ')
  }

  const formatLastActive = (lastActive?: string) => {
    if (!lastActive) return 'Never'
    
    const date = new Date(lastActive)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours} hours ago`
    
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString()
  }

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

          <button 
            onClick={performSearch}
            disabled={isSearching}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search Users'}
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Search Results</h4>
        
        {searchError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-red-600 text-sm">{searchError}</p>
          </div>
        )}

        {searchResults.length === 0 && !searchError && searchQuery && !isSearching && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-600">No users found matching your search criteria.</p>
          </div>
        )}

        {searchResults.length === 0 && !searchQuery && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-600">Enter a search query above to find other users.</p>
          </div>
        )}

        <div className="space-y-4">
          {searchResults.map((searchUser) => (
            <div key={searchUser.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {searchUser.profile_photo_url ? (
                    <img 
                      src={searchUser.profile_photo_url} 
                      alt={searchUser.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg">{getUserIcon(searchUser.role)}</span>
                  )}
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">
                    {searchUser.full_name || searchUser.business_name || searchUser.club_name || 'Unknown'}
                  </h5>
                  <p className="text-sm text-gray-600">{getUserDescription(searchUser)}</p>
                  <p className="text-xs text-gray-500">Last active: {formatLastActive(searchUser.last_active)}</p>
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
          ))}
        </div>

        {searchResults.length > 0 && (
          <div className="text-center mt-6">
            <button 
              onClick={performSearch}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Refresh Results
            </button>
          </div>
        )}
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