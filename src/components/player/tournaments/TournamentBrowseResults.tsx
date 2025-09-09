import React from 'react'
import { Tournament, TournamentCategory } from '../../../store/slices/tournamentBrowseSlice'

interface TournamentBrowseResultsProps {
  searchPerformed: boolean
  tournaments: Tournament[]
  selectedTournamentId: number | null
  selectedTournament: Tournament | null
  onTournamentClick: (tournamentId: number) => void
  onRegisterClick: (tournament: Tournament, category: TournamentCategory) => void
  canRegisterForTournament: (tournament: Tournament) => boolean
}

const TournamentBrowseResults: React.FC<TournamentBrowseResultsProps> = ({
  searchPerformed,
  tournaments,
  selectedTournamentId,
  selectedTournament,
  onTournamentClick,
  onRegisterClick,
  canRegisterForTournament
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-green-100 text-green-800'
      case 'ongoing': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'canceled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRegistrationStatus = (tournament: Tournament) => {
    if (!tournament.isRegistered) return null
    
    const registration = tournament.userRegistrations?.[0]
    if (!registration) return null

    switch (registration.status) {
      case 'registered': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'waitlisted': return 'bg-yellow-100 text-yellow-800'
      case 'withdrawn': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!searchPerformed) {
    return null
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Tournament Results ({tournaments.length} found)
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {tournaments.length === 0 ? (
          <div className="p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M20 12a8 8 0 018 8v8l4-4H8l4 4v-8a8 8 0 018-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tournaments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search filters to find tournaments.
            </p>
          </div>
        ) : (
          tournaments.map((tournament) => (
            <div key={tournament.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{tournament.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(tournament.status)}`}>
                      {tournament.status}
                    </span>
                    {tournament.is_ranking && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Ranking Tournament
                      </span>
                    )}
                    {tournament.isRegistered && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRegistrationStatus(tournament)}`}>
                        Registered
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>📅 {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}</span>
                    {tournament.venue_name && <span>📍 {tournament.venue_name}</span>}
                    {tournament.state && <span>🏛️ {tournament.state.name}</span>}
                    {tournament.entry_fee && <span>💰 ${tournament.entry_fee}</span>}
                    {tournament.totalParticipants !== undefined && (
                      <span>👥 {tournament.totalParticipants} participants</span>
                    )}
                    {tournament.availableSpots !== null && tournament.max_participants && (
                      <span>🎯 {tournament.availableSpots} spots left</span>
                    )}
                  </div>

                  {tournament.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{tournament.description}</p>
                  )}

                  {/* Categories */}
                  {tournament.categories && tournament.categories.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {tournament.categories.map((category) => (
                          <span
                            key={category.id}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {category.name}
                            {category.gender && ` (${category.gender})`}
                            {category.min_skill_level && category.max_skill_level && 
                              ` - ${category.min_skill_level}-${category.max_skill_level}`
                            }
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex space-x-2">
                  <button
                    onClick={() => onTournamentClick(tournament.id)}
                    className="bg-gray-100 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    {selectedTournamentId === tournament.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedTournamentId === tournament.id && selectedTournament && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Tournament Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Tournament Information</h4>
                      <div className="space-y-2 text-sm">
                        {selectedTournament.organizer && (
                          <div>
                            <span className="font-medium">Organizer:</span> {selectedTournament.organizer.name}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Registration Period:</span>{' '}
                          {formatDate(selectedTournament.registration_start)} - {formatDate(selectedTournament.registration_end)}
                        </div>
                        {selectedTournament.venue_address && (
                          <div>
                            <span className="font-medium">Address:</span> {selectedTournament.venue_address}
                          </div>
                        )}
                        {selectedTournament.ranking_multiplier !== 1 && (
                          <div>
                            <span className="font-medium">Ranking Multiplier:</span> {selectedTournament.ranking_multiplier}x
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Categories and Registration */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                      <div className="space-y-3">
                        {selectedTournament.categories.map((category) => (
                          <div key={category.id} className="border border-gray-200 rounded-md p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-sm">{category.name}</h5>
                              {canRegisterForTournament(selectedTournament) && (
                                <button
                                  onClick={() => onRegisterClick(selectedTournament, category)}
                                  disabled={category.availableSpots === 0}
                                  className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-1 px-3 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                                >
                                  {category.availableSpots === 0 ? 'Full' : 'Register'}
                                </button>
                              )}
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              {category.gender && (
                                <div><span className="font-medium">Gender:</span> {category.gender}</div>
                              )}
                              {(category.min_age || category.max_age) && (
                                <div>
                                  <span className="font-medium">Age:</span>{' '}
                                  {category.min_age && `${category.min_age}+`}
                                  {category.min_age && category.max_age && ' - '}
                                  {category.max_age && `${category.max_age}`}
                                </div>
                              )}
                              {(category.min_skill_level || category.max_skill_level) && (
                                <div>
                                  <span className="font-medium">Skill Level:</span>{' '}
                                  {category.min_skill_level}-{category.max_skill_level}
                                </div>
                              )}
                              {category.format && (
                                <div><span className="font-medium">Format:</span> {category.format}</div>
                              )}
                              {category.participantsCount !== undefined && (
                                <div>
                                  <span className="font-medium">Participants:</span> {category.participantsCount}
                                  {category.max_participants && `/${category.max_participants}`}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TournamentBrowseResults