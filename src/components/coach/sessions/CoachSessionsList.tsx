import React from 'react'

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
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'refunded':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Sessions Found</h3>
          <p className="text-gray-600">
            {filters.status !== 'all' || filters.date_from || filters.date_to || filters.player_search
              ? 'Try adjusting your filters to see more sessions.'
              : 'You don\'t have any coaching sessions yet.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Sessions ({filteredSessions.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredSessions.map((session) => (
          <div key={session.id} className="p-6 hover: transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Player Photo */}
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {session.player.profile_photo_url ? (
                    <img 
                      src={session.player.profile_photo_url} 
                      alt={session.player.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-gray-600">
                      {session.player.full_name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Session Details */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {session.player.full_name}
                  </h4>
                  <div className="text-sm text-gray-600">
                    NRTP Level: {session.player.nrtp_level} • 
                    {formatDate(session.session_date)} at {formatTime(session.start_time)} - {formatTime(session.end_time)}
                  </div>
                  {session.court && (
                    <div className="text-sm text-gray-500">
                      📍 {session.court.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    ${session.price}
                  </div>
                  <div className="flex space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(session.status)}`}>
                      {session.status}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusBadge(session.payment_status)}`}>
                      {session.payment_status}
                    </span>
                  </div>
                  {session.rating && (
                    <div className="text-sm text-yellow-500 mt-1">
                      {'★'.repeat(session.rating)}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => onViewDetails(session)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                  >
                    Details
                  </button>

                  {session.status === 'scheduled' && new Date(session.session_date) >= new Date() && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => onStatusChange(session.id, 'completed')}
                        className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => onStatusChange(session.id, 'canceled')}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                      >
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