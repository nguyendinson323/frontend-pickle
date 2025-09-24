import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { CoachUpcomingSession, updateCoachSessionStatus } from '../../../store/slices/coachDashboardSlice'
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiDollarSign,
  FiCheckCircle,
  FiX,
  FiAlertCircle,
  FiChevronRight,
  FiPlus
} from 'react-icons/fi'

interface CoachUpcomingSessionsProps {
  sessions: CoachUpcomingSession[]
}

const CoachUpcomingSessions: React.FC<CoachUpcomingSessionsProps> = ({ sessions }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [updatingSession, setUpdatingSession] = useState<number | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const formatTime = (timeString: string) => {
    // Parse time string (assumes format HH:MM:SS or HH:MM)
    const [hours, minutes] = timeString.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleStatusUpdate = async (sessionId: number, newStatus: 'completed' | 'canceled') => {
    try {
      setUpdatingSession(sessionId)
      setUpdateError(null)
      await dispatch(updateCoachSessionStatus(sessionId, newStatus))
    } catch (error: any) {
      console.error('Failed to update session status:', error)
      setUpdateError(`Failed to ${newStatus === 'completed' ? 'complete' : 'cancel'} session. Please try again.`)
    } finally {
      setUpdatingSession(null)
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl shadow-2xl p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
          <FiCalendar className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Upcoming Sessions</h3>
      </div>

      {/* Error Message */}
      {updateError && (
        <div className="mb-6 p-4 bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl">
          <div className="flex items-start justify-between">
            <div className="flex">
              <FiAlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
              <p className="text-sm font-medium text-red-700">{updateError}</p>
            </div>
            <button
              onClick={() => setUpdateError(null)}
              className="text-red-400 hover:text-red-600 ml-2 p-1 rounded-lg hover:bg-red-100 transition-all duration-200"
              title="Dismiss error"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {sessions.length > 0 ? (
        <div className="space-y-6">
          {sessions.slice(0, 3).map((session) => (
            <div key={session.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mr-3">
                      <FiUser className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-bold text-gray-900 text-lg">{session.student_name}</p>
                  </div>
                  <div className="space-y-2 ml-13">
                    <div className="flex items-center text-sm font-medium text-gray-600">
                      <FiMapPin className="w-4 h-4 mr-2 text-blue-600" />
                      {session.court_name || 'Court TBD'}
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-600">
                      <FiClock className="w-4 h-4 mr-2 text-blue-600" />
                      {formatDate(session.session_date)} at {formatTime(session.start_time)} - {formatTime(session.end_time)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-2">
                    <FiDollarSign className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-xl font-bold text-gray-900">${session.price}</span>
                  </div>
                  <span className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                    {session.status}
                  </span>
                </div>
              </div>

              {session.status === 'scheduled' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleStatusUpdate(session.id, 'completed')}
                    disabled={updatingSession === session.id}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-green-400 disabled:to-emerald-500 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
                  >
                    <FiCheckCircle className="w-4 h-4 mr-2" />
                    {updatingSession === session.id ? 'Updating...' : 'Mark Completed'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(session.id, 'canceled')}
                    disabled={updatingSession === session.id}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 disabled:from-red-400 disabled:to-pink-500 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
                  >
                    <FiX className="w-4 h-4 mr-2" />
                    {updatingSession === session.id ? 'Updating...' : 'Cancel Session'}
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => navigate('/coach/sessions')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
          >
            View all sessions
            <FiChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiCalendar className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-3">No upcoming sessions</h4>
          <p className="text-gray-600 font-medium mb-8">Ready to schedule your next coaching session?</p>
          <button
            onClick={() => navigate('/coach/schedule')}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center mx-auto"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Schedule Session
          </button>
        </div>
      )}
    </div>
  )
}

export default CoachUpcomingSessions