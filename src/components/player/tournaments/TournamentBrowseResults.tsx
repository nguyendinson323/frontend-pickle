import React from 'react'
import { Tournament, TournamentCategory } from '../../../store/slices/tournamentBrowseSlice'
import { FiAward, FiEye, FiEyeOff, FiMapPin, FiCalendar, FiDollarSign, FiUsers, FiTarget, FiInbox, FiUserPlus } from 'react-icons/fi'

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
      case 'upcoming': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
      case 'ongoing': return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
      case 'completed': return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg'
      case 'canceled': return 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg'
    }
  }

  const getRegistrationStatus = (tournament: Tournament) => {
    if (!tournament.isRegistered) return null

    const registration = tournament.userRegistrations?.[0]
    if (!registration) return null

    switch (registration.status) {
      case 'registered': return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
      case 'confirmed': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
      case 'waitlisted': return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
      case 'withdrawn': return 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg'
    }
  }

  if (!searchPerformed) {
    return null
  }

  return (
    <div className="bg-white shadow-2xl rounded-3xl border-2 border-gray-100">
      <div className="px-8 py-6 border-b-2 border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-4 shadow-xl">
            <FiAward className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Tournament Results ({tournaments.length} found)
          </h3>
        </div>
      </div>
      <div className="divide-y-2 divide-gray-100">
        {tournaments.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <FiInbox className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Tournaments Found</h3>
            <p className="text-lg text-gray-600 font-medium">
              Try adjusting your search filters to discover exciting tournaments!
            </p>
          </div>
        ) : (
          tournaments.map((tournament) => (
            <div key={tournament.id} className="p-8 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{tournament.name}</h3>
                    <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold capitalize ${getStatusBadgeColor(tournament.status)}`}>
                      {tournament.status}
                    </span>
                    {tournament.is_ranking && (
                      <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
                        <FiAward className="w-4 h-4 mr-2" />
                        Ranking Tournament
                      </span>
                    )}
                    {tournament.isRegistered && (
                      <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold ${getRegistrationStatus(tournament)}`}>
                        <FiUsers className="w-4 h-4 mr-2" />
                        Registered
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-4">
                    <div className="bg-blue-50 p-3 rounded-2xl border-2 border-blue-100 flex items-center">
                      <FiCalendar className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-xs font-bold text-blue-700">{formatDate(tournament.start_date)}</span>
                    </div>
                    {tournament.venue_name && (
                      <div className="bg-purple-50 p-3 rounded-2xl border-2 border-purple-100 flex items-center">
                        <FiMapPin className="w-4 h-4 text-purple-600 mr-2" />
                        <span className="text-xs font-bold text-purple-700 truncate">{tournament.venue_name}</span>
                      </div>
                    )}
                    {tournament.state && (
                      <div className="bg-green-50 p-3 rounded-2xl border-2 border-green-100 flex items-center">
                        <FiMapPin className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-xs font-bold text-green-700">{tournament.state.name}</span>
                      </div>
                    )}
                    {tournament.entry_fee && (
                      <div className="bg-yellow-50 p-3 rounded-2xl border-2 border-yellow-100 flex items-center">
                        <FiDollarSign className="w-4 h-4 text-yellow-600 mr-2" />
                        <span className="text-xs font-bold text-yellow-700">${tournament.entry_fee}</span>
                      </div>
                    )}
                    {tournament.totalParticipants !== undefined && (
                      <div className="bg-indigo-50 p-3 rounded-2xl border-2 border-indigo-100 flex items-center">
                        <FiUsers className="w-4 h-4 text-indigo-600 mr-2" />
                        <span className="text-xs font-bold text-indigo-700">{tournament.totalParticipants} players</span>
                      </div>
                    )}
                    {tournament.availableSpots !== null && tournament.max_participants && (
                      <div className="bg-orange-50 p-3 rounded-2xl border-2 border-orange-100 flex items-center">
                        <FiTarget className="w-4 h-4 text-orange-600 mr-2" />
                        <span className="text-xs font-bold text-orange-700">{tournament.availableSpots} spots</span>
                      </div>
                    )}
                  </div>

                  {tournament.description && (
                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200 mb-4">
                      <p className="text-sm text-gray-700 font-medium line-clamp-3">{tournament.description}</p>
                    </div>
                  )}

                  {/* Categories */}
                  {tournament.categories && tournament.categories.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-3">
                        {tournament.categories.map((category) => (
                          <span
                            key={category.id}
                            className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-2 border-gray-300 shadow-lg"
                          >
                            <FiTarget className="w-4 h-4 mr-2" />
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
                
                <div className="ml-4 flex space-x-3">
                  <button
                    onClick={() => onTournamentClick(tournament.id)}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    {selectedTournamentId === tournament.id ? (
                      <><FiEyeOff className="w-5 h-5 mr-2" />Hide Details</>
                    ) : (
                      <><FiEye className="w-5 h-5 mr-2" />View Details</>
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedTournamentId === tournament.id && selectedTournament && (
                <div className="mt-8 border-t-2 border-gray-200 pt-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 rounded-3xl border-2 border-blue-100">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Tournament Info */}
                    <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-gray-100">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                          <FiAward className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">Tournament Information</h4>
                      </div>
                      <div className="space-y-4">
                        {selectedTournament.organizer && (
                          <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100">
                            <span className="text-sm font-bold text-blue-700">Organizer:</span>
                            <p className="font-bold text-gray-900">{selectedTournament.organizer.name}</p>
                          </div>
                        )}
                        <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-100">
                          <span className="text-sm font-bold text-green-700">Registration Period:</span>
                          <p className="font-bold text-gray-900">
                            {formatDate(selectedTournament.registration_start)} - {formatDate(selectedTournament.registration_end)}
                          </p>
                        </div>
                        {selectedTournament.venue_address && (
                          <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-100">
                            <span className="text-sm font-bold text-purple-700">Address:</span>
                            <p className="font-bold text-gray-900">{selectedTournament.venue_address}</p>
                          </div>
                        )}
                        {selectedTournament.ranking_multiplier !== 1 && (
                          <div className="bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-100">
                            <span className="text-sm font-bold text-yellow-700">Ranking Multiplier:</span>
                            <p className="font-bold text-gray-900">{selectedTournament.ranking_multiplier}x</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Categories and Registration */}
                    <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-gray-100">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                          <FiTarget className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">Categories & Registration</h4>
                      </div>
                      <div className="space-y-4">
                        {selectedTournament.categories.map((category) => (
                          <div key={category.id} className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="text-lg font-bold text-gray-900">{category.name}</h5>
                              {canRegisterForTournament(selectedTournament) && (
                                <button
                                  onClick={() => onRegisterClick(selectedTournament, category)}
                                  disabled={category.availableSpots === 0}
                                  className={`flex items-center px-4 py-2 rounded-2xl text-sm font-bold shadow-lg transition-all duration-300 ${
                                    category.availableSpots === 0
                                      ? 'bg-gray-400 text-white cursor-not-allowed'
                                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-xl transform hover:scale-105'
                                  }`}
                                >
                                  <FiUserPlus className="w-4 h-4 mr-2" />
                                  {category.availableSpots === 0 ? 'Full' : 'Register'}
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {category.gender && (
                                <div className="bg-pink-50 p-3 rounded-2xl border-2 border-pink-100">
                                  <span className="text-xs font-bold text-pink-700">Gender:</span>
                                  <p className="font-bold text-gray-900">{category.gender}</p>
                                </div>
                              )}
                              {(category.min_age || category.max_age) && (
                                <div className="bg-orange-50 p-3 rounded-2xl border-2 border-orange-100">
                                  <span className="text-xs font-bold text-orange-700">Age:</span>
                                  <p className="font-bold text-gray-900">
                                    {category.min_age && `${category.min_age}+`}
                                    {category.min_age && category.max_age && ' - '}
                                    {category.max_age && `${category.max_age}`}
                                  </p>
                                </div>
                              )}
                              {(category.min_skill_level || category.max_skill_level) && (
                                <div className="bg-blue-50 p-3 rounded-2xl border-2 border-blue-100">
                                  <span className="text-xs font-bold text-blue-700">Skill Level:</span>
                                  <p className="font-bold text-gray-900">{category.min_skill_level}-{category.max_skill_level}</p>
                                </div>
                              )}
                              {category.format && (
                                <div className="bg-purple-50 p-3 rounded-2xl border-2 border-purple-100">
                                  <span className="text-xs font-bold text-purple-700">Format:</span>
                                  <p className="font-bold text-gray-900">{category.format}</p>
                                </div>
                              )}
                              {category.participantsCount !== undefined && (
                                <div className="bg-green-50 p-3 rounded-2xl border-2 border-green-100">
                                  <span className="text-xs font-bold text-green-700">Participants:</span>
                                  <p className="font-bold text-gray-900">
                                    {category.participantsCount}
                                    {category.max_participants && `/${category.max_participants}`}
                                  </p>
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