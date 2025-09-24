import React from 'react'
import { useDispatch } from 'react-redux'
import { closeBookingModal, CoachingSession } from '../../../store/slices/coachingSessionsSlice'
import { AppDispatch } from '../../../store'
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiUser,
  FiX,
  FiCheck,
  FiBookOpen
} from 'react-icons/fi'

interface SessionBookingModalProps {
  isOpen: boolean
  selectedSession: CoachingSession | null
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
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 w-full max-w-lg mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                <FiBookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Book Session</h3>
            </div>
            <button
              onClick={() => dispatch(closeBookingModal())}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <FiX className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Session Details */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 mb-8">
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              {selectedSession.title}
            </h4>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center">
                <FiUser className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-gray-700 font-medium">
                  Coach: {selectedSession.coach.full_name}
                </span>
              </div>

              <div className="flex items-center">
                <FiCalendar className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-gray-700 font-medium">
                  Date: {formatDate(selectedSession.scheduled_date)}
                </span>
              </div>

              <div className="flex items-center">
                <FiClock className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-gray-700 font-medium">
                  Time: {formatTime(selectedSession.start_time)} - {formatTime(selectedSession.end_time)}
                </span>
              </div>

              <div className="flex items-center">
                <FiClock className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-gray-700 font-medium">
                  Duration: {selectedSession.duration_minutes} minutes
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mb-8 text-center">
            <div className="flex items-center justify-center mb-2">
              <FiDollarSign className="w-6 h-6 text-green-600 mr-2" />
              <span className="text-lg font-bold text-green-800">Total Price</span>
            </div>
            <p className="text-4xl font-bold text-green-600">${selectedSession.price_per_person}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => dispatch(closeBookingModal())}
              className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
            >
              <FiX className="w-5 h-5 mr-3" />
              Cancel
            </button>
            <button
              onClick={onBookSession}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Booking...
                </>
              ) : (
                <>
                  <FiCheck className="w-5 h-5 mr-3" />
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

export default SessionBookingModal