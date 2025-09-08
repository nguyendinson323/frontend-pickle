import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { 
  searchCoachingSessions,
  fetchAvailableCoaches,
  fetchCoachDetails,
  fetchMyBookings,
  bookCoachingSession,
  cancelSessionBooking,
  submitSessionReview,
  fetchSessionDetails,
  setFilters,
  openBookingModal,
  closeBookingModal,
  openReviewModal,
  closeReviewModal,
  updateReviewModal,
  openAvailabilityModal,
  closeAvailabilityModal
} from '../../store/slices/coachingSessionsSlice'
import { AppDispatch } from '../../store'

const CoachingSessions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [activeTab, setActiveTab] = useState<'search' | 'coaches' | 'my-bookings'>('search')
  
  const {
    availableSessions,
    myBookings,
    selectedSession,
    coaches,
    selectedCoach,
    filters,
    isLoading,
    error,
    searchPerformed,
    bookingModal,
    reviewModal,
    availabilityModal
  } = useSelector((state: RootState) => state.coachingSessions)

  useEffect(() => {
    dispatch(fetchMyBookings())
    dispatch(fetchAvailableCoaches())
  }, [dispatch])

  const handleSearch = () => {
    dispatch(searchCoachingSessions(filters))
  }

  const handleCoachSelect = (coachId: number) => {
    dispatch(fetchCoachDetails(coachId))
  }

  const handleSessionSelect = (sessionId: number) => {
    const session = availableSessions.find(s => s.id === sessionId)
    if (session) {
      dispatch(openBookingModal({
        sessionId,
        session
      }))
    }
  }

  const handleBookSession = () => {
    if (bookingModal.sessionId) {
      const bookingData = {
        session_id: bookingModal.sessionId,
        payment_method: 'card' // Mock payment method
      }
      
      dispatch(bookCoachingSession(bookingData))
    }
  }

  const handleCancelBooking = (bookingId: number) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      dispatch(cancelSessionBooking(bookingId))
    }
  }

  const handleSubmitReview = () => {
    if (reviewModal.sessionId) {
      dispatch(submitSessionReview(reviewModal.sessionId, {
        rating: reviewModal.rating,
        comment: reviewModal.comment
      }))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return '👤'
      case 'group': return '👥'
      case 'clinic': return '🏫'
      default: return '🎾'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'canceled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const canCancelBooking = (booking: any) => {
    if (booking.status === 'canceled') return false
    if (booking.session.status !== 'scheduled') return false
    
    // Check if within 24 hours
    const sessionDate = new Date(`${booking.session.scheduled_date} ${booking.session.start_time}`)
    const now = new Date()
    const hoursUntilSession = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    return hoursUntilSession >= 24
  }

  const canReviewSession = (booking: any) => {
    return booking.session.status === 'completed' && !booking.session.feedback_rating
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Coaching Sessions</h1>
              <p className="text-gray-600">Find and book professional coaching sessions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('search')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'search'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Find Sessions
            </button>
            <button
              onClick={() => setActiveTab('coaches')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'coaches'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Coaches ({coaches.length})
            </button>
            <button
              onClick={() => setActiveTab('my-bookings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-bookings'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Bookings ({myBookings.length})
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' && (
          <div>
            {/* Search Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Search Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Type
                  </label>
                  <select
                    value={filters.session_type || ''}
                    onChange={(e) => dispatch(setFilters({ session_type: e.target.value || null }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Any</option>
                    <option value="individual">Individual</option>
                    <option value="group">Group</option>
                    <option value="clinic">Clinic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Format
                  </label>
                  <select
                    value={filters.session_format || ''}
                    onChange={(e) => dispatch(setFilters({ session_format: e.target.value || null }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Any</option>
                    <option value="in_person">In Person</option>
                    <option value="virtual">Virtual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price ($)
                  </label>
                  <input
                    type="number"
                    value={filters.price_range.min || ''}
                    onChange={(e) => dispatch(setFilters({ 
                      price_range: { ...filters.price_range, min: e.target.value ? parseInt(e.target.value) : null }
                    }))}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price ($)
                  </label>
                  <input
                    type="number"
                    value={filters.price_range.max || ''}
                    onChange={(e) => dispatch(setFilters({ 
                      price_range: { ...filters.price_range, max: e.target.value ? parseInt(e.target.value) : null }
                    }))}
                    placeholder="200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.date_range.start || ''}
                    onChange={(e) => dispatch(setFilters({ 
                      date_range: { ...filters.date_range, start: e.target.value || null }
                    }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.date_range.end || ''}
                    onChange={(e) => dispatch(setFilters({ 
                      date_range: { ...filters.date_range, end: e.target.value || null }
                    }))}
                    min={filters.date_range.start || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isLoading ? 'Searching...' : 'Search Sessions'}
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchPerformed && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Available Sessions ({availableSessions.length})
                </h3>
                
                {availableSessions.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">No sessions found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableSessions.map(session => (
                      <div
                        key={session.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-4">
                            <span className="text-2xl">{getSessionTypeIcon(session.session_type)}</span>
                            <div className="flex-1">
                              <h4 className="text-lg font-medium text-gray-900">{session.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">
                                with {session.coach.full_name}
                              </p>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-3">
                                <span>📅 {formatDate(session.scheduled_date)}</span>
                                <span>⏰ {formatTime(session.start_time)} - {formatTime(session.end_time)}</span>
                                <span>⏱️ {session.duration_minutes} min</span>
                                <span>👥 {session.current_participants}/{session.max_participants} spots</span>
                              </div>

                              {session.description && (
                                <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                              )}

                              <div className="flex items-center space-x-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(session.status)}`}>
                                  {session.session_type}
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {session.session_format === 'in_person' ? '📍 In Person' : '💻 Virtual'}
                                </span>
                                {session.coach.rating && (
                                  <span className="text-xs text-yellow-600">
                                    ⭐ {session.coach.rating.toFixed(1)} ({session.coach.total_reviews} reviews)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-semibold text-green-600">
                              ${session.price_per_person}
                            </p>
                            <button
                              onClick={() => handleSessionSelect(session.id)}
                              disabled={session.current_participants >= session.max_participants}
                              className={`mt-2 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                session.current_participants >= session.max_participants
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                              }`}
                            >
                              {session.current_participants >= session.max_participants ? 'Full' : 'Book Now'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'coaches' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Available Coaches</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coaches.map(coach => (
                <div
                  key={coach.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {coach.full_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{coach.full_name}</h4>
                      <p className="text-sm text-gray-600">{coach.specialization || 'General Coach'}</p>
                    </div>
                  </div>

                  {coach.bio && (
                    <p className="text-sm text-gray-600 mb-4">{coach.bio}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Experience:</span>
                      <span className="text-gray-900">{coach.experience_years || 0} years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rate:</span>
                      <span className="text-gray-900">${coach.hourly_rate || 50}/hour</span>
                    </div>
                    {coach.rating && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Rating:</span>
                        <span className="text-yellow-600">
                          ⭐ {coach.rating.toFixed(1)} ({coach.total_reviews} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  {coach.certifications && coach.certifications.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Certifications:</p>
                      <div className="flex flex-wrap gap-1">
                        {coach.certifications.map((cert, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleCoachSelect(coach.id)}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-green-600 text-green-600 text-sm font-medium rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'my-bookings' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">My Session Bookings</h3>
            
            {myBookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-4xl mb-4">🎾</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Bookings Yet</h4>
                <p className="text-gray-500 mb-4">Book your first coaching session to get started</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Find Sessions
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map(booking => (
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
                              onClick={() => handleCancelBooking(booking.id)}
                              className="text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                              Cancel Booking
                            </button>
                          )}
                          
                          {canReviewSession(booking) && (
                            <button
                              onClick={() => dispatch(openReviewModal({ sessionId: booking.session.id }))}
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
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingModal.isOpen && bookingModal.selectedSession && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Book Session
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {bookingModal.selectedSession.title}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Coach: {bookingModal.selectedSession.coach.full_name}</p>
                  <p>Date: {formatDate(bookingModal.selectedSession.scheduled_date)}</p>
                  <p>Time: {formatTime(bookingModal.selectedSession.start_time)} - {formatTime(bookingModal.selectedSession.end_time)}</p>
                  <p>Duration: {bookingModal.selectedSession.duration_minutes} minutes</p>
                  <p className="font-medium text-green-600">Price: ${bookingModal.selectedSession.price_per_person}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => dispatch(closeBookingModal())}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookSession}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none disabled:opacity-50"
                >
                  {isLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Session Review
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => dispatch(updateReviewModal({ rating: star }))}
                      className={`text-2xl ${
                        star <= reviewModal.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  value={reviewModal.comment}
                  onChange={(e) => dispatch(updateReviewModal({ comment: e.target.value }))}
                  placeholder="Share your experience..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => dispatch(closeReviewModal())}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none disabled:opacity-50"
                >
                  {isLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CoachingSessions