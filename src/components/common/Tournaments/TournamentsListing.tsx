import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Tournament } from '../../../types/tournaments'

interface TournamentsListingProps {
  tournaments: Tournament[]
  isLoading: boolean
  totalCount: number
}

const TournamentsListing: React.FC<TournamentsListingProps> = ({
  tournaments,
  isLoading,
  totalCount
}) => {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-lg"></div>
            <div className="bg-white border border-gray-200 rounded-b-lg p-6">
              <div className="flex justify-between mb-2">
                <div className="bg-gray-200 h-4 w-20 rounded"></div>
                <div className="bg-gray-200 h-4 w-16 rounded"></div>
              </div>
              <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 w-full rounded mb-4"></div>
              <div className="space-y-2 mb-4">
                <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
                <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
              </div>
              <div className="bg-gray-200 h-10 w-full rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tournaments found</h3>
        <p className="text-gray-500">Try adjusting your filters or check back later for new tournaments.</p>
      </div>
    )
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'ongoing':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getOrganizerTypeDisplay = (organizerType: string) => {
    switch (organizerType) {
      case 'federation':
        return 'Federation'
      case 'state':
        return 'State Committee'
      case 'club':
        return 'Club'
      case 'partner':
        return 'Partner'
      default:
        return organizerType
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {totalCount === 1 ? '1 tournament' : `${totalCount} tournaments`} found
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer"
            onClick={() => navigate(`/tournaments/${tournament.id}`)}
          >
            {tournament.banner_url && (
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                <img
                  src={tournament.banner_url}
                  alt={tournament.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(tournament.status)}`}>
                  {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500">
                  {tournament.state?.name}
                </span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                  {tournament.tournament_type}
                </span>
                <span className="text-xs text-gray-500">
                  {getOrganizerTypeDisplay(tournament.organizer_type)}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {tournament.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {tournament.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {tournament.venue_name}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  {tournament.totalRegistrations || 0} / {tournament.max_participants} registered
                </div>
                
                {tournament.entry_fee && tournament.entry_fee > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    ${tournament.entry_fee}
                  </div>
                )}

                {tournament.categories && tournament.categories.length > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {tournament.categories.length} {tournament.categories.length === 1 ? 'category' : 'categories'}
                  </div>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/tournaments/${tournament.id}`)
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TournamentsListing