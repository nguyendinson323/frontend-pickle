import React from 'react'
import {
  FiUser,
  FiMapPin,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiStar,
  FiEye,
  FiCheckCircle,
  FiX,
  FiUsers,
  FiFileText
} from 'react-icons/fi'

interface CoachingSession {
  id: number
  coach_id: number
  player_id: number
  session_date: string
  start_time: string
  end_time: string
  court_id: number | null
  status: 'scheduled' | 'completed' | 'canceled'
  price: number
  payment_status: 'pending' | 'paid' | 'refunded'
  stripe_payment_id: string | null
  rating: number | null
  created_at: string
  updated_at: string
  player: {
    id: number
    full_name: string
    profile_photo_url: string | null
    nrtp_level: number
  }
  court: {
    id: number
    name: string
    address: string
  } | null
}

interface CoachSessionsListProps {
  sessions: CoachingSession[]
  filters: {
    status: string
    date_from: string
    date_to: string
    player_search: string
  }
  onStatusChange: (sessionId: number, status: string) => void
  onViewDetails: (session: CoachingSession) => void
}

const CoachSessionsList: React.FC<CoachSessionsListProps> = ({
  sessions,
  filters,
  onStatusChange,
  onViewDetails
}) => {
  // Filter sessions based on current filters
  const filteredSessions = sessions.filter(session => {
    // Status filter
    if (filters.status !== 'all' && session.status !== filters.status) {
      return false
    }

    // Date range filter
    if (filters.date_from && session.session_date < filters.date_from) {
      return false
    }
    if (filters.date_to && session.session_date > filters.date_to) {
      return false
    }

    // Player search filter
    if (filters.player_search && 
        !session.player.full_name.toLowerCase().includes(filters.player_search.toLowerCase())) {
      return false
    }

    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200 text-blue-800'
      case 'completed':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-200 text-green-800'
      case 'canceled':
        return 'bg-gradient-to-r from-red-100 to-pink-100 border-red-200 text-red-800'
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-200 text-gray-800'
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-200 text-green-800'
      case 'pending':
        return 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-200 text-yellow-800'
      case 'refunded':
        return 'bg-gradient-to-r from-red-100 to-pink-100 border-red-200 text-red-800'
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-200 text-gray-800'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (filteredSessions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <FiUsers className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Sessions Found</h3>
        <p className="text-gray-600 font-medium text-lg">
          {filters.status !== 'all' || filters.date_from || filters.date_to || filters.player_search
            ? 'Try adjusting your filters to see more sessions.'
            : 'You don\'t have any coaching sessions yet.'}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b-2 border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
            <FiFileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Sessions ({filteredSessions.length})
          </h3>
        </div>
      </div>

      <div className="divide-y-2 divide-gray-200">
        {filteredSessions.map((session) => (
          <div key={session.id} className="p-8 hover:bg-gray-50 transition-all duration-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-6">
                {/* Player Photo */}
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center overflow-hidden shadow-lg">
                  {session.player.profile_photo_url ? (
                    <img
                      src={session.player.profile_photo_url}
                      alt={session.player.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-2xl text-gray-600" />
                  )}
                </div>

                {/* Session Details */}
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {session.player.full_name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center text-sm font-medium text-gray-700">
                      <FiUser className="w-4 h-4 mr-2 text-purple-600" />
                      NRTP Level {session.player.nrtp_level}
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-700">
                      <FiCalendar className="w-4 h-4 mr-2 text-green-600" />
                      {formatDate(session.session_date)}
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-700">
                      <FiClock className="w-4 h-4 mr-2 text-blue-600" />
                      {formatTime(session.start_time)} - {formatTime(session.end_time)}
                    </div>
                    {session.court && (
                      <div className="flex items-center text-sm font-medium text-gray-700">
                        <FiMapPin className="w-4 h-4 mr-2 text-orange-600" />
                        {session.court.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Price and Status */}
                <div className="text-center lg:text-right">
                  <div className="flex items-center justify-center lg:justify-end mb-3">
                    <FiDollarSign className="w-5 h-5 text-green-600 mr-1" />
                    <span className="text-2xl font-bold text-green-600">${session.price}</span>
                  </div>
                  <div className="flex flex-wrap justify-center lg:justify-end gap-2 mb-2">
                    <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-2xl border shadow-md ${getStatusBadge(session.status)}`}>
                      {session.status}
                    </span>
                    <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-2xl border shadow-md ${getPaymentStatusBadge(session.payment_status)}`}>
                      {session.payment_status}
                    </span>
                  </div>
                  {session.rating && (
                    <div className="flex items-center justify-center lg:justify-end">
                      <FiStar className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-bold text-yellow-600">
                        {session.rating}/5
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => onViewDetails(session)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
                  >
                    <FiEye className="w-4 h-4 mr-2" />
                    Details
                  </button>

                  {session.status === 'scheduled' && new Date(session.session_date) >= new Date() && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onStatusChange(session.id, 'completed')}
                        className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-2 px-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
                      >
                        <FiCheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </button>
                      <button
                        onClick={() => onStatusChange(session.id, 'canceled')}
                        className="bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-2 px-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
                      >
                        <FiX className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CoachSessionsList