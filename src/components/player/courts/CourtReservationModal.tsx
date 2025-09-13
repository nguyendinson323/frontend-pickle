import React from 'react'
import { useDispatch } from 'react-redux'
import { closeReservationModal, Court, TimeSlot } from '../../../store/slices/courtReservationSlice'
import { AppDispatch } from '../../../store'

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Confirm Reservation
          </h3>
          
          {reservationModal.selectedSlot && (
            <div className="text-left bg-gray-50 p-4 rounded-md mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Reservation Details</h4>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Court:</span> {selectedCourt?.name}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Address:</span> {selectedCourt?.address}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Date:</span> {reservationModal.selectedDate ? new Date(reservationModal.selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Time:</span> {formatTime(reservationModal.selectedSlot.start_time)} - {formatTime(reservationModal.selectedSlot.end_time)}
              </p>
              <p className="text-lg font-semibold text-green-600 mt-3">
                Total: ${reservationModal.selectedSlot.price}
              </p>
            </div>
          )}
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => dispatch(closeReservationModal())}
              className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={onMakeReservation}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourtReservationModal