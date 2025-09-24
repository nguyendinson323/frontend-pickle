import React from 'react'
import { SessionBooking } from '../../../store/slices/coachingSessionsSlice'
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiSearch,
  FiX,
  FiStar,
  FiBookOpen,
  FiAlertCircle
} from 'react-icons/fi'

interface MyBookingsListProps {
  bookings: SessionBooking[]
  onTabChange: (tab: 'search' | 'coaches' | 'my-bookings') => void
  onCancelBooking: (bookingId: number) => void
  onOpenReview: (sessionId: number) => void
  formatDate: (dateString: string) => string
  formatTime: (timeString: string) => string
  getStatusColor: (status: string) => string
  canCancelBooking: (booking: SessionBooking) => boolean
  canReviewSession: (booking: SessionBooking) => boolean
}

const MyBookingsList: React.FC<MyBookingsListProps> = ({
  bookings,
  onTabChange,
  onCancelBooking,
  onOpenReview,
  formatDate,
  formatTime,
  getStatusColor,
  canCancelBooking,
  canReviewSession
}) => {

  if (bookings.length === 0) {
    return (
      <div>
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
            <FiCalendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">My Session Bookings</h3>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">🎾</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900 mb-4">No Bookings Yet</h4>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Book your first coaching session to get started on your pickleball journey
          </p>
          <button
            onClick={() => onTabChange('search')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
          >
            <FiSearch className="w-6 h-6 mr-3" />
            Find Sessions
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
          <FiCalendar className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">My Session Bookings</h3>
      </div>

      <div className="space-y-6">
        {bookings.map(booking => (
          <div
            key={booking.id}
            className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {/* Session Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-700 rounded-2xl flex items-center justify-center">
                    <FiBookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      {booking.session.title}
                    </h4>
                    <p className="text-lg text-gray-600 font-medium">
                      with {booking.session.coach.full_name}
                    </p>
                  </div>
                </div>

                {/* Session Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <FiCalendar className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-bold text-blue-800">Date</span>
                    </div>
                    <p className="text-blue-900 font-medium">{formatDate(booking.session.scheduled_date)}</p>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                    <div className="flex items-center mb-2">
                      <FiClock className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-bold text-green-800">Time</span>
                    </div>
                    <p className="text-green-900 font-medium">
                      {formatTime(booking.session.start_time)} - {formatTime(booking.session.end_time)}
                    </p>
                  </div>

                  <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
                    <div className="flex items-center mb-2">
                      <FiDollarSign className="w-4 h-4 text-yellow-600 mr-2" />
                      <span className="text-sm font-bold text-yellow-800">Amount</span>
                    </div>
                    <p className="text-yellow-900 font-medium">${booking.payment_amount}</p>
                  </div>
                </div>

                {/* Location */}
                {booking.session.location && (
                  <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
                    <div className="flex items-center">
                      <FiMapPin className="w-5 h-5 text-gray-600 mr-3" />
                      <p className="text-gray-700 font-medium">{booking.session.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status and Actions */}
              <div className="text-right ml-8">
                {/* Status Badges */}
                <div className="flex flex-col space-y-3 mb-6">
                  <span className={`px-4 py-2 text-sm font-bold rounded-2xl capitalize ${getStatusColor(booking.session.status)}`}>
                    {booking.session.status}
                  </span>
                  <span className={`px-4 py-2 text-sm font-bold rounded-2xl capitalize ${
                    booking.payment_status === 'paid'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : booking.payment_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {booking.payment_status}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  {canCancelBooking(booking) && (
                    <button
                      onClick={() => onCancelBooking(booking.id)}
                      className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-2xl hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
                    >
                      <FiX className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  )}

                  {canReviewSession(booking) && (
                    <button
                      onClick={() => onOpenReview(booking.session.id)}
                      className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
                    >
                      <FiStar className="w-4 h-4 mr-2" />
                      Review
                    </button>
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

export default MyBookingsList