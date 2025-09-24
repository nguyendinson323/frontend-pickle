import React from 'react'
import {
  FiX,
  FiUser,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiCreditCard,
  FiStar,
  FiCheckCircle,
  FiXCircle,
  FiInfo
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                <FiInfo className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Session Details</h2>
                <p className="text-blue-200 font-medium">Complete session information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-2xl flex items-center justify-center text-white transition-all duration-200 hover:transform hover:scale-105"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Student Information */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
                <FiUser className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Student Information</h3>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center overflow-hidden shadow-lg">
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
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">{session.player.full_name}</h4>
                  <p className="text-lg font-medium text-purple-800">NRTP Level: {session.player.nrtp_level}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-3">
                <FiCalendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Session Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center mb-3">
                  <FiCalendar className="w-5 h-5 text-green-600 mr-2" />
                  <div className="text-sm font-bold text-green-700">Date</div>
                </div>
                <div className="text-xl font-bold text-gray-900">{formatDate(session.session_date)}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center mb-3">
                  <FiClock className="w-5 h-5 text-blue-600 mr-2" />
                  <div className="text-sm font-bold text-blue-700">Time</div>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {formatTime(session.start_time)} - {formatTime(session.end_time)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6">
                <div className="flex items-center mb-3">
                  <FiCheckCircle className="w-5 h-5 text-orange-600 mr-2" />
                  <div className="text-sm font-bold text-orange-700">Status</div>
                </div>
                <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-2xl border shadow-md ${getStatusBadge(session.status)}`}>
                  {session.status}
                </span>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-50 border border-purple-200 rounded-2xl p-6">
                <div className="flex items-center mb-3">
                  <FiCreditCard className="w-5 h-5 text-purple-600 mr-2" />
                  <div className="text-sm font-bold text-purple-700">Payment Status</div>
                </div>
                <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-2xl border shadow-md ${getPaymentStatusBadge(session.payment_status)}`}>
                  {session.payment_status}
                </span>
              </div>
            </div>
          </div>

          {/* Court Information */}
          {session.court && (
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mr-3">
                  <FiMapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Court Information</h3>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6">
                <div className="flex items-center mb-2">
                  <FiMapPin className="w-5 h-5 text-orange-600 mr-2" />
                  <div className="text-xl font-bold text-gray-900">{session.court.name}</div>
                </div>
                <div className="text-lg font-medium text-gray-700">{session.court.address}</div>
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-3">
                <FiDollarSign className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Payment Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center mb-3">
                  <FiDollarSign className="w-6 h-6 text-green-600 mr-2" />
                  <div className="text-sm font-bold text-green-700">Session Price</div>
                </div>
                <div className="text-3xl font-bold text-green-600">${session.price}</div>
              </div>
              {session.stripe_payment_id && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center mb-3">
                    <FiCreditCard className="w-6 h-6 text-blue-600 mr-2" />
                    <div className="text-sm font-bold text-blue-700">Payment ID</div>
                  </div>
                  <div className="text-sm font-mono font-bold text-gray-900 break-all">{session.stripe_payment_id}</div>
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          {session.rating && (
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-2xl flex items-center justify-center mr-3">
                  <FiStar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Student Rating</h3>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 text-center">
                <div className="flex justify-center items-center mb-3">
                  {Array.from({ length: 5 }, (_, index) => (
                    <FiStar
                      key={index}
                      className={`w-8 h-8 mx-1 ${
                        index < session.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{session.rating}/5</div>
                <div className="text-sm font-bold text-yellow-700">Student Rating</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {session.status === 'scheduled' && new Date(session.session_date) >= new Date() && (
            <div className="border-t-2 border-gray-200 pt-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center mr-3">
                  <FiCheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Actions</h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    onStatusChange(session.id, 'completed')
                    onClose()
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
                >
                  <FiCheckCircle className="w-5 h-5 mr-2" />
                  Mark as Completed
                </button>
                <button
                  onClick={() => {
                    onStatusChange(session.id, 'canceled')
                    onClose()
                  }}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
                >
                  <FiXCircle className="w-5 h-5 mr-2" />
                  Cancel Session
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-t-2 border-gray-200 rounded-b-3xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
            >
              <FiX className="w-5 h-5 mr-2" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionDetailsModal