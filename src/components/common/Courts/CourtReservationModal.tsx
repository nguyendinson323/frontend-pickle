import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { Court } from '../../../types'
import { fetchAvailableSlots } from '../../../store/thunks/courtsThunks'
import PaymentModal from '../Payments/PaymentModal'
import api from '../../../services/api'

interface CourtReservationModalProps {
  isOpen: boolean
  onClose: () => void
  court: Court
}

export const CourtReservationModal: React.FC<CourtReservationModalProps> = ({
  isOpen,
  onClose,
  court
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { availableSlots, isLoading } = useSelector((state: RootState) => state.courts)
  
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<{start_time: string, end_time: string} | null>(null)
  const [reservationAmount] = useState(50) // Default hourly rate
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isCreatingReservation, setIsCreatingReservation] = useState(false)

  useEffect(() => {
    if (isOpen && selectedDate) {
      dispatch(fetchAvailableSlots({ courtId: court.id, date: selectedDate }))
    }
  }, [dispatch, isOpen, selectedDate, court.id])

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0]
    setSelectedDate(today)
  }, [isOpen])

  const handleReservation = () => {
    if (!selectedSlot || !user) return
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!selectedSlot || !user) return

    setIsCreatingReservation(true)
    try {
      await api.post('/api/payments/reservations', {
        court_id: court.id,
        date: selectedDate,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        amount: reservationAmount * 100, // Convert to cents
        payment_intent_id: paymentIntentId
      })

      alert('Reservation created successfully!')
      setShowPaymentModal(false)
      onClose()
      // Refresh available slots
      dispatch(fetchAvailableSlots({ courtId: court.id, date: selectedDate }))
    } catch (error) {
      console.error('Failed to create reservation:', error)
      alert('Failed to create reservation. Please try again.')
    } finally {
      setIsCreatingReservation(false)
    }
  }

  const handlePaymentCancel = () => {
    setShowPaymentModal(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-fade-in-up">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-2xl">🏓</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Reserve Court
                </h2>
                <p className="text-green-100 text-lg">
                  {court.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8">

          {!user ? (
            <div className="text-center py-12 space-y-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-1a6 6 0 00-6-6H9a6 6 0 00-6 6v1a2 2 0 002 2zM12 9a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                  Please log in to your account to make court reservations and access all booking features.
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Log In to Continue</span>
                </div>
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-8">
                {/* Enhanced Date Selection */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-500 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-blue-800">Select Date</h3>
                  </div>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border-2 border-blue-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold transition-all duration-300"
                  />
                </div>

                {/* Enhanced Time Slots Selection */}
                {selectedDate && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-500 rounded-lg mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-purple-800">Available Time Slots</h3>
                      </div>
                      <div className="text-sm text-purple-600 font-medium">
                        {new Date(selectedDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>

                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-purple-700 font-medium mt-4">Loading available slots...</p>
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">😔</span>
                        </div>
                        <p className="text-gray-600 text-lg font-medium">No available slots for this date</p>
                        <p className="text-gray-500 text-sm mt-2">Please try a different date</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {availableSlots.map((slot) => (
                          <button
                            key={`${slot.start_time}-${slot.end_time}`}
                            onClick={() => setSelectedSlot(slot)}
                            disabled={!slot.available}
                            className={`p-4 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                              !slot.available
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                                : selectedSlot?.start_time === slot.start_time && selectedSlot?.end_time === slot.end_time
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 border-2 border-green-400'
                                : 'bg-white text-purple-700 hover:bg-purple-100 border-2 border-purple-200 hover:border-purple-300 shadow-sm hover:shadow-md'
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-1">
                              <div className="text-xs opacity-75">
                                {!slot.available ? '❌' : selectedSlot?.start_time === slot.start_time ? '✅' : '🕐'}
                              </div>
                              <div>
                                {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Enhanced Reservation Summary */}
                {selectedSlot && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-green-500 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-green-800">Reservation Summary</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">🏓</span>
                          <span className="text-sm font-bold text-green-700 uppercase">Court</span>
                        </div>
                        <p className="font-bold text-green-800 text-lg">{court.name}</p>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">📅</span>
                          <span className="text-sm font-bold text-green-700 uppercase">Date</span>
                        </div>
                        <p className="font-bold text-green-800 text-lg">
                          {new Date(selectedDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">🕐</span>
                          <span className="text-sm font-bold text-green-700 uppercase">Time</span>
                        </div>
                        <p className="font-bold text-green-800 text-lg">
                          {selectedSlot.start_time.slice(0, 5)} - {selectedSlot.end_time.slice(0, 5)}
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">💰</span>
                          <span className="text-sm font-bold text-green-700 uppercase">Amount</span>
                        </div>
                        <p className="font-bold text-green-800 text-2xl">${reservationAmount}</p>
                      </div>
                    </div>

                    <div className="bg-green-100 rounded-lg p-4 border border-green-300">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-green-700 font-medium">
                          Your reservation will be confirmed immediately upon payment.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Cancel</span>
                    </div>
                  </button>
                  <button
                    onClick={handleReservation}
                    disabled={!selectedSlot || isCreatingReservation}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:shadow-none disabled:transform-none"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>💳</span>
                      <span>{isCreatingReservation ? 'Processing...' : 'Pay & Reserve'}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedSlot && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handlePaymentCancel}
          amount={reservationAmount}
          description={`Court reservation for ${court.name} on ${new Date(selectedDate).toLocaleDateString()} from ${selectedSlot.start_time.slice(0, 5)} to ${selectedSlot.end_time.slice(0, 5)}`}
          metadata={{
            court_id: court.id,
            date: selectedDate,
            start_time: selectedSlot.start_time,
            end_time: selectedSlot.end_time,
            player_id: user?.id || 0
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}