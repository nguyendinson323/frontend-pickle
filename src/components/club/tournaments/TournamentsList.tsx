import React from 'react'
import { ClubTournament } from '../../../store/slices/clubTournamentsSlice'
import {
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiMapPin,
  FiEye,
  FiEdit3,
  FiTrash2,
  FiAward,
  FiClock,
  FiRefreshCw,
  FiInfo
} from 'react-icons/fi'

interface TournamentsListProps {
  tournaments: ClubTournament[]
  onViewDetails: (tournament: ClubTournament) => void
  onEditTournament: (tournament: ClubTournament) => void
  onDeleteTournament: (tournamentId: number) => void
  onUpdateStatus: (tournamentId: number, status: string) => void
}

const TournamentsList: React.FC<TournamentsListProps> = ({
  tournaments,
  onViewDetails,
  onEditTournament,
  onDeleteTournament,
  onUpdateStatus
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ongoing':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusOptions = (currentStatus: string) => {
    const statuses = ['upcoming', 'ongoing', 'completed', 'canceled']
    return statuses.filter(status => status !== currentStatus)
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-3xl shadow-2xl overflow-hidden">
      <div className="grid gap-6 p-8">
        {tournaments.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiAward className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No tournaments</h3>
            <p className="text-gray-600 font-medium">Get started by creating your first tournament.</p>
          </div>
        ) : (
          tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-200 hover:transform hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                    <FiAward className="h-6 w-6 mr-3 text-purple-600" />
                    {tournament.name}
                  </h3>
                  <p className="text-gray-600 font-medium flex items-center">
                    <FiInfo className="h-4 w-4 mr-2 text-blue-500" />
                    {tournament.tournament_type}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl shadow-sm border-2 ${getStatusColor(tournament.status)}`}>
                    <FiClock className="h-4 w-4 mr-2" />
                    {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                  </span>
                  <div className="relative">
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          onUpdateStatus(tournament.id, e.target.value)
                          e.target.value = ""
                        }
                      }}
                      className="text-sm border-2 border-gray-300 rounded-2xl text-gray-700 bg-white cursor-pointer px-4 py-2 font-medium hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    >
                      <option value="">
                        <FiRefreshCw className="inline h-4 w-4 mr-2" />
                        Change Status
                      </option>
                      {getStatusOptions(tournament.status).map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {tournament.description && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-6">
                  <p className="text-gray-700 font-medium">{tournament.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-bold text-gray-500 mb-2 flex items-center">
                    <FiCalendar className="h-4 w-4 mr-2 text-blue-500" />
                    Tournament Dates
                  </div>
                  <div className="font-bold text-gray-900">{formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}</div>
                </div>
                <div className="bg-white border border-green-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-bold text-gray-500 mb-2 flex items-center">
                    <FiClock className="h-4 w-4 mr-2 text-green-500" />
                    Registration
                  </div>
                  <div className="font-bold text-gray-900">{formatDate(tournament.registration_start)} - {formatDate(tournament.registration_end)}</div>
                </div>
                <div className="bg-white border border-purple-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-bold text-gray-500 mb-2 flex items-center">
                    <FiUsers className="h-4 w-4 mr-2 text-purple-500" />
                    Participants
                  </div>
                  <div className="font-bold text-gray-900">{tournament.registration_count || 0}</div>
                </div>
                <div className="bg-white border border-yellow-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-sm font-bold text-gray-500 mb-2 flex items-center">
                    <FiDollarSign className="h-4 w-4 mr-2 text-yellow-600" />
                    Revenue
                  </div>
                  <div className="font-bold text-gray-900">${tournament.revenue || 0}</div>
                </div>
              </div>

              {tournament.venue_name && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-4 mb-6">
                  <div className="text-sm font-bold text-gray-500 mb-2 flex items-center">
                    <FiMapPin className="h-4 w-4 mr-2 text-orange-500" />
                    Venue
                  </div>
                  <div className="font-bold text-gray-900">{tournament.venue_name}</div>
                  {tournament.venue_address && (
                    <div className="text-sm text-gray-600 font-medium mt-1">{tournament.venue_address}</div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t-2 border-gray-100">
                <div className="flex items-center space-x-6">
                  {tournament.entry_fee && (
                    <div className="flex items-center bg-green-50 border border-green-200 rounded-2xl px-4 py-2">
                      <FiDollarSign className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm font-bold text-gray-700">Entry Fee: </span>
                      <span className="font-bold text-green-600">${tournament.entry_fee}</span>
                    </div>
                  )}
                  {tournament.categories && tournament.categories.length > 0 && (
                    <div className="flex items-center bg-purple-50 border border-purple-200 rounded-2xl px-4 py-2">
                      <FiAward className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="text-sm font-bold text-gray-700">Categories: </span>
                      <span className="font-bold text-purple-600">{tournament.categories.length}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => onViewDetails(tournament)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-2xl text-sm font-bold flex items-center shadow-md hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105"
                  >
                    <FiEye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                  <button
                    onClick={() => onEditTournament(tournament)}
                    className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white p-2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105"
                    title="Edit Tournament"
                  >
                    <FiEdit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTournament(tournament.id)}
                    className="bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white p-2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105"
                    title="Delete Tournament"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TournamentsList