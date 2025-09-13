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
  openBookingModal,
  openReviewModal
} from '../../store/slices/coachingSessionsSlice'
import { AppDispatch } from '../../store'
import {
  CoachingSessionsHeader,
  CoachingSessionsTabs,
  CoachingSessionsFilters,
  CoachingSessionsResults,
  CoachesList,
  MyBookingsList,
  SessionBookingModal,
  SessionReviewModal
} from '../../components/player/coaching'

const CoachingSessions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [activeTab, setActiveTab] = useState<'search' | 'coaches' | 'my-bookings'>('search')
  
  const {
    availableSessions,
    myBookings,
    coaches,
    filters,
    isLoading,
    searchPerformed,
    bookingModal,
    reviewModal
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
    if (bookingModal.selectedSession) {
      const session = bookingModal.selectedSession;
      const bookingData = {
        coach_id: session.coach_id,
        session_date: session.scheduled_date,
        start_time: session.start_time,
        end_time: session.end_time,
        price: session.price_per_person,
        payment_method: 'card' // Mock payment method
      }
      
      dispatch(bookCoachingSession(bookingData))
    }
  }

  const handleCancelBooking = (sessionId: number) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      dispatch(cancelSessionBooking(sessionId))
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

  const handleOpenReview = (sessionId: number) => {
    dispatch(openReviewModal({ sessionId }))
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
    <div className="min-h-screen ">
      <CoachingSessionsHeader />
      
      <CoachingSessionsTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        coachesCount={coaches.length}
        bookingsCount={myBookings.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' && (
          <div>
            <CoachingSessionsFilters
              filters={filters}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
            
            <CoachingSessionsResults
              sessions={availableSessions}
              searchPerformed={searchPerformed}
              onSessionSelect={handleSessionSelect}
              formatDate={formatDate}
              formatTime={formatTime}
              getSessionTypeIcon={getSessionTypeIcon}
              getStatusColor={getStatusColor}
            />
          </div>
        )}

        {activeTab === 'coaches' && (
          <CoachesList
            coaches={coaches}
            onCoachSelect={handleCoachSelect}
          />
        )}

        {activeTab === 'my-bookings' && (
          <MyBookingsList
            bookings={myBookings}
            onTabChange={setActiveTab}
            onCancelBooking={(bookingId: number) => {
              // Find the booking and pass the session ID instead
              const booking = myBookings.find(b => b.id === bookingId)
              if (booking) {
                handleCancelBooking(booking.session.id)
              }
            }}
            onOpenReview={handleOpenReview}
            formatDate={formatDate}
            formatTime={formatTime}
            getStatusColor={getStatusColor}
            canCancelBooking={canCancelBooking}
            canReviewSession={canReviewSession}
          />
        )}
      </div>

      <SessionBookingModal
        isOpen={bookingModal.isOpen}
        selectedSession={bookingModal.selectedSession}
        onBookSession={handleBookSession}
        isLoading={isLoading}
        formatDate={formatDate}
        formatTime={formatTime}
      />

      <SessionReviewModal
        isOpen={reviewModal.isOpen}
        sessionId={reviewModal.sessionId}
        rating={reviewModal.rating}
        comment={reviewModal.comment}
        onSubmitReview={handleSubmitReview}
        isLoading={isLoading}
      />
    </div>
  )
}

export default CoachingSessions