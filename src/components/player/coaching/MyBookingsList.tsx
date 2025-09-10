import React from 'react'

interface MyBookingsListProps {
  bookings: any[]
  onTabChange: (tab: 'search' | 'coaches' | 'my-bookings') => void
  onCancelBooking: (bookingId: number) => void
  onOpenReview: (sessionId: number) => void
  formatDate: (dateString: string) => string
  formatTime: (timeString: string) => string
  getStatusColor: (status: string) => string
  canCancelBooking: (booking: any) => boolean
  canReviewSession: (booking: any) => boolean
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
        <h3 className="text-lg font-medium text-gray-900 mb-6">My Session Bookings</h3>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-4">🎾</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Bookings Yet</h4>
          <p className="text-gray-500 mb-4">Book your first coaching session to get started</p>
          <button
            onClick={() => onTabChange('search')}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Find Sessions
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">My Session Bookings</h3>
      
      <div className="space-y-4">
        {bookings.map(booking => (
          <div
            key={booking.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  {booking.session.title}
                </h4>
                <p className="text-sm text-gray-600">
                  with {booking.session.coach.full_name}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-700 mt-2 mb-3">
                  <span>📅 {formatDate(booking.session.scheduled_date)}</span>
                  <span>⏰ {formatTime(booking.session.start_time)} - {formatTime(booking.session.end_time)}</span>
                  <span>💰 ${booking.payment_amount}</span>
                </div>

                {booking.session.location && (
                  <p className="text-sm text-gray-600">📍 {booking.session.location}</p>
                )}
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.session.status)}`}>
                    {booking.session.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    booking.payment_status === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : booking.payment_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {booking.payment_status}
                  </span>
                </div>
                
                <div className="flex flex-col space-y-2">
                  {canCancelBooking(booking) && (
                    <button
                      onClick={() => onCancelBooking(booking.id)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Cancel Booking
                    </button>
                  )}
                  
                  {canReviewSession(booking) && (
                    <button
                      onClick={() => onOpenReview(booking.session.id)}
                      className="text-sm text-green-600 hover:text-green-800 font-medium"
                    >
                      Leave Review
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