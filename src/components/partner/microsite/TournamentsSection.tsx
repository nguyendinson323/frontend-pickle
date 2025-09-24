import React from 'react'
import { PartnerTournament } from '../../../store/slices/partnerMicrositeSlice'
import { useNavigate } from 'react-router-dom'
import {
  FiAward,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiUserCheck,
  FiXCircle,
  FiClock,
  FiCheckCircle,
  FiTag
} from 'react-icons/fi'

interface TournamentsSectionProps {
  tournaments: PartnerTournament[]
  isOwner: boolean
}

const TournamentsSection: React.FC<TournamentsSectionProps> = ({ tournaments, isOwner }) => {
  const navigate = useNavigate()

  if (tournaments.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-12 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl flex items-center justify-center mr-4">
            <FiAward className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Tournaments</h2>
        </div>
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiAward className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No Tournaments Scheduled</h3>
          <p className="text-gray-600 font-medium">This partner hasn't scheduled any tournaments yet.</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-gradient-to-r from-blue-100 to-indigo-200 text-blue-800 border-blue-300',
      ongoing: 'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border-green-300',
      completed: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300',
      canceled: 'bg-gradient-to-r from-red-100 to-pink-200 text-red-800 border-red-300'
    }
    return colors[status as keyof typeof colors] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300'
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      upcoming: <FiClock className="w-4 h-4" />,
      ongoing: <FiCheckCircle className="w-4 h-4" />,
      completed: <FiAward className="w-4 h-4" />,
      canceled: <FiXCircle className="w-4 h-4" />
    }
    return icons[status as keyof typeof icons] || <FiCalendar className="w-4 h-4" />
  }

  const handleRegister = (tournamentId: number) => {
    navigate(`/tournament-browse?register=${tournamentId}`)
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8 mb-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl flex items-center justify-center mr-4">
          <FiAward className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Tournaments & Events</h2>
      </div>

      <div className="space-y-6">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {tournament.name}
                  </h3>
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(tournament.status)}`}>
                    {getStatusIcon(tournament.status)}
                    <span className="ml-1 capitalize">{tournament.status}</span>
                  </span>
                  {tournament.tournament_type && (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-purple-100 to-indigo-200 text-purple-800 border border-purple-300">
                      <FiTag className="w-3 h-3 mr-1" />
                      {tournament.tournament_type}
                    </span>
                  )}
                </div>

                {tournament.description && (
                  <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                    <p className="text-sm text-blue-800 font-medium">
                      {tournament.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
                    <div className="flex items-center mb-2">
                      <FiCalendar className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-bold text-gray-600 text-sm">Tournament Dates</span>
                    </div>
                    <p className="text-blue-900 font-bold">
                      {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4">
                    <div className="flex items-center mb-2">
                      <FiUserCheck className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-bold text-gray-600 text-sm">Registration</span>
                    </div>
                    <p className="text-green-900 font-bold">
                      Until {formatDate(tournament.registration_end)}
                    </p>
                  </div>

                  {tournament.venue_name && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
                      <div className="flex items-center mb-2">
                        <FiMapPin className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="font-bold text-gray-600 text-sm">Venue</span>
                      </div>
                      <p className="text-purple-900 font-bold">{tournament.venue_name}</p>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4">
                    <div className="flex items-center mb-2">
                      <FiUsers className="w-5 h-5 text-orange-600 mr-2" />
                      <span className="font-bold text-gray-600 text-sm">Participants</span>
                    </div>
                    <p className="text-orange-900 font-bold">
                      {tournament.current_participants}
                      {tournament.max_participants && ` / ${tournament.max_participants}`}
                    </p>
                  </div>
                </div>

                {tournament.entry_fee !== null && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mb-4">
                    <div className="flex items-center">
                      <FiDollarSign className="w-6 h-6 text-green-600 mr-2" />
                      <span className="font-bold text-gray-700">Entry Fee:</span>
                      <span className="ml-2 text-xl font-bold text-green-600">
                        ${tournament.entry_fee.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 lg:mt-0 lg:ml-6 flex-shrink-0">
                {tournament.status === 'upcoming' &&
                 new Date(tournament.registration_end) > new Date() &&
                 (!tournament.max_participants || tournament.current_participants < tournament.max_participants) &&
                 !isOwner && (
                  <button
                    onClick={() => handleRegister(tournament.id)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-2xl hover:from-purple-700 hover:to-pink-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold"
                  >
                    <FiUserCheck className="w-5 h-5 mr-2" />
                    Register Now
                  </button>
                )}

                {tournament.status === 'upcoming' &&
                 (new Date(tournament.registration_end) <= new Date() ||
                  (tournament.max_participants && tournament.current_participants >= tournament.max_participants)) && (
                  <div className="inline-flex items-center px-6 py-3 text-sm font-bold text-gray-500 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-2xl">
                    <FiXCircle className="w-5 h-5 mr-2" />
                    Registration Closed
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TournamentsSection