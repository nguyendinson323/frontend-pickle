import React from 'react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiTag } from 'react-icons/fi'
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-lg overflow-hidden opacity-0 animate-fade-in-up"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-48 animate-pulse" />
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <div className="bg-gray-200 h-4 w-20 rounded-full animate-pulse" />
                <div className="bg-gray-200 h-4 w-16 rounded-full animate-pulse" />
              </div>
              <div className="bg-gray-200 h-6 w-3/4 rounded-full animate-pulse" />
              <div className="bg-gray-200 h-4 w-full rounded-full animate-pulse" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 h-4 w-2/3 rounded-full animate-pulse"
                  />
                ))}
              </div>
              <div className="bg-gray-200 h-10 w-full rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl shadow-lg opacity-0 animate-fade-in-up">
        <div className="w-24 h-24 text-gray-400 mx-auto mb-6 text-6xl animate-bounce">
          🏆
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">No tournaments found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Try adjusting your filters or check back later for new tournaments.
        </p>
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
      <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-in-left">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
          <p className="text-lg font-semibold text-gray-700">
            {totalCount === 1 ? '1 tournament' : `${totalCount} tournaments`} found
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tournaments.map((tournament, index) => {
          const gradients = [
            'from-indigo-500 to-purple-600',
            'from-purple-500 to-pink-600',
            'from-blue-500 to-indigo-600',
            'from-pink-500 to-red-600',
            'from-teal-500 to-blue-600',
            'from-orange-500 to-pink-600'
          ]

          return (
            <div
              key={tournament.id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100 hover:-translate-y-2 hover:scale-105 opacity-0 animate-fade-in-up"
              style={{animationDelay: `${index * 0.1}s`}}
              onClick={() => navigate(`/tournaments/${tournament.id}`)}
            >
              <div className={clsx(
                'h-48 bg-gradient-to-br relative',
                tournament.banner_url ? '' : gradients[index % gradients.length]
              )}>
                {tournament.banner_url ? (
                  <img
                    src={tournament.banner_url}
                    alt={tournament.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl text-white hover:scale-125 hover:rotate-12 transition-all duration-300">
                      🏆
                    </div>
                  </div>
                )}

                <div className="absolute top-4 left-4">
                  <span className={clsx(
                    'px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm',
                    getStatusBadgeColor(tournament.status)
                  )}>
                    {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                    {tournament.state?.name}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">
                    {tournament.tournament_type}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {getOrganizerTypeDisplay(tournament.organizer_type)}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {tournament.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {tournament.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FiCalendar className="w-4 h-4 text-indigo-500" />
                    <span>{new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FiMapPin className="w-4 h-4 text-green-500" />
                    <span className="line-clamp-1">{tournament.venue_name}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FiUsers className="w-4 h-4 text-blue-500" />
                    <span>{tournament.totalRegistrations || 0} / {tournament.max_participants} registered</span>
                  </div>

                  {tournament.entry_fee && tournament.entry_fee > 0 && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FiDollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-semibold">${tournament.entry_fee}</span>
                    </div>
                  )}

                  {tournament.categories && tournament.categories.length > 0 && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FiTag className="w-4 h-4 text-purple-500" />
                      <span>{tournament.categories.length} {tournament.categories.length === 1 ? 'category' : 'categories'}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/tournaments/${tournament.id}`)
                  }}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  View Details
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TournamentsListing