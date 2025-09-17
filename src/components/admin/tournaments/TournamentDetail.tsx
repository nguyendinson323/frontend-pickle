import React from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { TournamentAdmin } from '../../../types/admin'
import { fetchTournamentParticipants } from '../../../store/slices/adminTournamentsSlice'
import {
  FiX,
  FiEye,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiUsers,
  FiDollarSign,
  FiAward,
  FiClock,
  FiCheckCircle,
  FiInfo,
  FiHome
} from 'react-icons/fi'

interface TournamentDetailProps {
  tournament: TournamentAdmin
  onClose: () => void
}

const TournamentDetail: React.FC<TournamentDetailProps> = ({ tournament, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()

  React.useEffect(() => {
    dispatch(fetchTournamentParticipants(tournament.id))
  }, [dispatch, tournament.id])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { gradient: 'from-yellow-500 to-yellow-600', bg: 'from-yellow-50 to-yellow-100', border: 'border-yellow-200', label: 'Pending' },
      approved: { gradient: 'from-green-500 to-green-600', bg: 'from-green-50 to-green-100', border: 'border-green-200', label: 'Approved' },
      rejected: { gradient: 'from-red-500 to-red-600', bg: 'from-red-50 to-red-100', border: 'border-red-200', label: 'Rejected' },
      active: { gradient: 'from-blue-500 to-blue-600', bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', label: 'Active' },
      completed: { gradient: 'from-gray-500 to-gray-600', bg: 'from-gray-50 to-gray-100', border: 'border-gray-200', label: 'Completed' },
      cancelled: { gradient: 'from-red-500 to-red-600', bg: 'from-red-50 to-red-100', border: 'border-red-200', label: 'Cancelled' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl bg-gradient-to-r ${config.bg} border ${config.border} text-gray-900 shadow-lg`}>
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient} mr-2`}></div>
        {config.label}
      </span>
    )
  }

  const getOrganizerTypeBadge = (type: string) => {
    const typeConfig = {
      club: { gradient: 'from-purple-500 to-purple-600', bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', label: 'Club' },
      partner: { gradient: 'from-indigo-500 to-indigo-600', bg: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200', label: 'Partner' },
      state: { gradient: 'from-orange-500 to-orange-600', bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', label: 'State Committee' }
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.club
    return (
      <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl bg-gradient-to-r ${config.bg} border ${config.border} text-gray-900 shadow-lg`}>
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient} mr-2`}></div>
        {config.label}
      </span>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-0 w-full max-w-6xl min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden w-full m-4 animate-modal-scale">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-white mr-4">
                  <FiInfo className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Tournament Details</h3>
                  <p className="text-indigo-100 font-medium">Complete tournament information and statistics</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-3">
                      <FiInfo className="h-4 w-4" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Basic Information</h4>
                  </div>
              
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                        <FiInfo className="h-4 w-4 mr-2" />
                        Tournament Name
                      </label>
                      <p className="text-xl font-bold text-gray-900 bg-white rounded-xl p-3 border border-gray-200">{tournament.name}</p>
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                        <FiCheckCircle className="h-4 w-4 mr-2" />
                        Status
                      </label>
                      <div className="mt-1">
                        {getStatusBadge(tournament.status)}
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                        <FiInfo className="h-4 w-4 mr-2" />
                        Description
                      </label>
                      <p className="text-gray-900 bg-white rounded-xl p-3 border border-gray-200">{tournament.description || 'No description provided'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                          <FiCalendar className="h-4 w-4 mr-2" />
                          Start Date
                        </label>
                        <p className="text-gray-900 bg-white rounded-xl p-3 border border-gray-200 font-medium">{new Date(tournament.start_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                          <FiCalendar className="h-4 w-4 mr-2" />
                          End Date
                        </label>
                        <p className="text-gray-900 bg-white rounded-xl p-3 border border-gray-200 font-medium">{new Date(tournament.end_date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                        <FiMapPin className="h-4 w-4 mr-2" />
                        Location
                      </label>
                      <p className="text-gray-900 bg-white rounded-xl p-3 border border-gray-200 font-medium">{tournament.location}</p>
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                        <FiHome className="h-4 w-4 mr-2" />
                        Venue
                      </label>
                      <p className="text-gray-900 bg-white rounded-xl p-3 border border-gray-200 font-medium">{tournament.venue_name || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Organizer Info */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-100 rounded-2xl p-6 border border-purple-200 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white mr-3">
                      <FiUser className="h-4 w-4" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Organizer Information</h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                        <FiUser className="h-4 w-4 mr-2" />
                        Organizer
                      </label>
                      <p className="text-gray-900 bg-white rounded-xl p-3 border border-gray-200 font-bold text-lg">{tournament.organizer_name}</p>
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                        <FiAward className="h-4 w-4 mr-2" />
                        Type
                      </label>
                      <div className="mt-1">
                        {getOrganizerTypeBadge(tournament.organizer_type)}
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                        <FiUser className="h-4 w-4 mr-2" />
                        Organizer ID
                      </label>
                      <p className="text-gray-900 bg-white rounded-xl p-3 border border-gray-200 font-medium">{tournament.organizer_id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Tournament Stats */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-100 rounded-2xl p-6 border border-green-200 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white mr-3">
                      <FiUsers className="h-4 w-4" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Tournament Statistics</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-6 text-center border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                      <div className="flex items-center justify-center mb-2">
                        <FiUsers className="h-5 w-5 text-blue-500 mr-2" />
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{tournament.total_participants}</div>
                      </div>
                      <div className="text-sm font-bold text-gray-600">Current Participants</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 text-center border border-green-200 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                      <div className="flex items-center justify-center mb-2">
                        <FiUser className="h-5 w-5 text-green-500 mr-2" />
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{tournament.max_participants}</div>
                      </div>
                      <div className="text-sm font-bold text-gray-600">Max Participants</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 text-center border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                      <div className="flex items-center justify-center mb-2">
                        <FiDollarSign className="h-5 w-5 text-purple-500 mr-2" />
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">${tournament.entry_fee}</div>
                      </div>
                      <div className="text-sm font-bold text-gray-600">Entry Fee</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 text-center border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                      <div className="flex items-center justify-center mb-2">
                        <FiAward className="h-5 w-5 text-orange-500 mr-2" />
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">${tournament.prize_pool || 0}</div>
                      </div>
                      <div className="text-sm font-bold text-gray-600">Prize Pool</div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-2xl p-6 border border-yellow-200 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center text-white mr-3">
                      <FiClock className="h-4 w-4" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Additional Details</h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                        <FiCalendar className="h-4 w-4 mr-2" />
                        Registration Deadline
                      </label>
                      <p className="text-gray-900 bg-white rounded-xl p-3 border border-gray-200 font-medium">
                        {tournament.registration_end ?
                          new Date(tournament.registration_end).toLocaleDateString() :
                          'Not specified'
                        }
                      </p>
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                        <FiAward className="h-4 w-4 mr-2" />
                        Ranking Tournament
                      </label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl shadow-lg ${tournament.is_ranking
                          ? 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-gray-900'
                          : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-900'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${tournament.is_ranking
                            ? 'bg-gradient-to-r from-green-500 to-green-600'
                            : 'bg-gradient-to-r from-gray-500 to-gray-600'
                          }`}></div>
                          {tournament.is_ranking ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                        <FiAward className="h-4 w-4 mr-2" />
                        Ranking Multiplier
                      </label>
                      <p className="text-gray-900 bg-white rounded-xl p-3 border border-gray-200 font-medium">{tournament.ranking_multiplier || 'N/A'}</p>
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                        <FiClock className="h-4 w-4 mr-2" />
                        Created Date
                      </label>
                      <p className="text-gray-900 bg-white rounded-xl p-3 border border-gray-200 font-medium">{new Date(tournament.created_at).toLocaleDateString()}</p>
                    </div>

                    {tournament.status === 'canceled' && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <label className="flex items-center text-sm font-bold text-red-700 mb-2">
                          <FiX className="h-4 w-4 mr-2" />
                          Status Alert
                        </label>
                        <p className="text-red-700 font-bold">Tournament has been canceled</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiX className="mr-2 h-5 w-5" />
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentDetail