import React from 'react'
import { useDispatch } from 'react-redux'
import { closeBookingModal } from '../../../store/slices/coachingSessionsSlice'
import { AppDispatch } from '../../../store'

interface SessionBookingModalProps {
  isOpen: boolean
  selectedSession: any
  onBookSession: () => void
  isLoading: boolean
  formatDate: (dateString: string) => string
  formatTime: (timeString: string) => string
}

const SessionBookingModal: React.FC<SessionBookingModalProps> = ({
  isOpen,
  selectedSession,
  onBookSession,
  isLoading,
  formatDate,
  formatTime
}) => {
  const dispatch = useDispatch<AppDispatch>()

  if (!isOpen || !selectedSession) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Book Session
          </h3>
          
          <div className=" p-4 rounded-md mb-4">
            <h4 className="font-medium text-gray-900 mb-2">
              {selectedSession.title}
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Coach: {selectedSession.coach.full_name}</p>
              <p>Date: {formatDate(selectedSession.scheduled_date)}</p>
              <p>Time: {formatTime(selectedSession.start_time)} - {formatTime(selectedSession.end_time)}</p>
              <p>Duration: {selectedSession.duration_minutes} minutes</p>
              <p className="font-medium text-green-600">Price: ${selectedSession.price_per_person}</p>
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
              onClick={onBookSession}
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

export default SessionBookingModal