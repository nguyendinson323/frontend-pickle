import React from 'react'
import { useDispatch } from 'react-redux'
import { closeReservationModal, Court, TimeSlot } from '../../../store/slices/courtReservationSlice'
import { AppDispatch } from '../../../store'
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiX,
  FiCheckCircle,
  FiCreditCard
} from 'react-icons/fi'

interface ReservationModal {
  isOpen: boolean
  selectedDate: string | null
  selectedSlot: TimeSlot | null
}

interface CourtReservationModalProps {
  reservationModal: ReservationModal
  selectedCourt: Court | null
  onMakeReservation: () => void
  isLoading: boolean
}

const CourtReservationModal: React.FC<CourtReservationModalProps> = ({
  reservationModal,
  selectedCourt,
  onMakeReservation,
  isLoading
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  if (!reservationModal.isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 w-full max-w-2xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                <FiCheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white">Confirm Reservation</h3>
            </div>
            <button
              onClick={() => dispatch(closeReservationModal())}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <FiX className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {reservationModal.selectedSlot && (
            <>
              {/* Court Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200 mb-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                    <FiMapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-blue-900 mb-2">{selectedCourt?.name}</h4>
                    <p className="text-blue-700 flex items-center text-lg">
                      <FiMapPin className="w-5 h-5 mr-2" />
                      {selectedCourt?.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reservation Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center text-green-800">
                    <FiCalendar className="w-6 h-6 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-green-700">Date</p>
                      <p className="text-xl font-bold">
                        {reservationModal.selectedDate ? new Date(reservationModal.selectedDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
                  <div className="flex items-center text-orange-800">
                    <FiClock className="w-6 h-6 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-orange-700">Time</p>
                      <p className="text-xl font-bold">
                        {formatTime(reservationModal.selectedSlot.start_time)} - {formatTime(reservationModal.selectedSlot.end_time)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                      <FiDollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-700">Total Amount</p>
                      <p className="text-4xl font-bold text-purple-800">${reservationModal.selectedSlot.price}</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl">
                    <div className="flex items-center">
                      <FiCheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-bold">Ready to Book</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => dispatch(closeReservationModal())}
              className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
            >
              <FiX className="w-5 h-5 mr-3" />
              Cancel
            </button>
            <button
              onClick={onMakeReservation}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Booking...
                </>
              ) : (
                <>
                  <FiCreditCard className="w-5 h-5 mr-3" />
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourtReservationModal