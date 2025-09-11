import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { Court } from '../../../types'
import { fetchAvailableSlots, createReservation } from '../../../store/thunks/courtsThunks'

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

  const handleReservation = async () => {
    if (!selectedSlot || !user) return

    try {
      await dispatch(createReservation({
        court_id: court.id,
        date: selectedDate,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        amount: reservationAmount
      })).unwrap()
      
      alert('Reservation created successfully!')
      onClose()
    } catch (error) {
      alert('Failed to create reservation. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Reserve Court - {court.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!user ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Please log in to make a reservation</p>
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Log In
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {selectedDate && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots
                  </label>
                  
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-gray-500 py-4">No available slots for this date</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={`${slot.start_time}-${slot.end_time}`}
                          onClick={() => setSelectedSlot(slot)}
                          disabled={!slot.available}
                          className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                            !slot.available
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : selectedSlot?.start_time === slot.start_time && selectedSlot?.end_time === slot.end_time
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border'
                          }`}
                        >
                          {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedSlot && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Reservation Summary
                  </h3>
                  <div className="space-y-1 text-sm text-green-700">
                    <p><span className="font-medium">Court:</span> {court.name}</p>
                    <p><span className="font-medium">Date:</span> {selectedDate}</p>
                    <p><span className="font-medium">Time:</span> {selectedSlot.start_time.slice(0, 5)} - {selectedSlot.end_time.slice(0, 5)}</p>
                    <p><span className="font-medium">Amount:</span> ${reservationAmount}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReservation}
                  disabled={!selectedSlot}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  Confirm Reservation
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}