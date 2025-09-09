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

interface SessionDetailsModalProps {
  session: CoachingSession | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (sessionId: number, status: string) => void
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  session,
  isOpen,
  onClose,
  onStatusChange
}) => {
  if (!isOpen || !session) return null

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Session Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Student Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Student Information</h3>
            <div className="flex items-center space-x-4 p-4  rounded-lg">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {session.player.profile_photo_url ? (
                  <img 
                    src={session.player.profile_photo_url} 
                    alt={session.player.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-semibold text-gray-600">
                    {session.player.full_name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">{session.player.full_name}</h4>
                <p className="text-sm text-gray-600">NRTP Level: {session.player.nrtp_level}</p>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4  rounded-lg">
                <div className="text-sm text-gray-600">Date</div>
                <div className="font-medium text-gray-900">{formatDate(session.session_date)}</div>
              </div>
              <div className="p-4  rounded-lg">
                <div className="text-sm text-gray-600">Time</div>
                <div className="font-medium text-gray-900">
                  {formatTime(session.start_time)} - {formatTime(session.end_time)}
                </div>
              </div>
              <div className="p-4  rounded-lg">
                <div className="text-sm text-gray-600">Status</div>
                <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getStatusBadge(session.status)}`}>
                  {session.status}
                </span>
              </div>
              <div className="p-4  rounded-lg">
                <div className="text-sm text-gray-600">Payment Status</div>
                <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getPaymentStatusBadge(session.payment_status)}`}>
                  {session.payment_status}
                </span>
              </div>
            </div>
          </div>

          {/* Court Information */}
          {session.court && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Court Information</h3>
              <div className="p-4  rounded-lg">
                <div className="font-medium text-gray-900">{session.court.name}</div>
                <div className="text-sm text-gray-600">{session.court.address}</div>
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4  rounded-lg">
                <div className="text-sm text-gray-600">Session Price</div>
                <div className="text-xl font-bold text-green-600">${session.price}</div>
              </div>
              {session.stripe_payment_id && (
                <div className="p-4  rounded-lg">
                  <div className="text-sm text-gray-600">Payment ID</div>
                  <div className="text-sm font-mono text-gray-900">{session.stripe_payment_id}</div>
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          {session.rating && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Student Rating</h3>
              <div className="p-4  rounded-lg">
                <div className="text-2xl text-yellow-500">
                  {'★'.repeat(session.rating)}{'☆'.repeat(5 - session.rating)}
                </div>
                <div className="text-sm text-gray-600">{session.rating} out of 5 stars</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {session.status === 'scheduled' && new Date(session.session_date) >= new Date() && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Actions</h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    onStatusChange(session.id, 'completed')
                    onClose()
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => {
                    onStatusChange(session.id, 'canceled')
                    onClose()
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Cancel Session
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 ">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionDetailsModal