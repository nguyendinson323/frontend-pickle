import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { CoachUpcomingSession, updateCoachSessionStatus } from '../../../store/slices/coachDashboardSlice'

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Sessions</h3>

      {/* Error Message */}
      {updateError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start justify-between">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600">{updateError}</p>
            </div>
            <button
              onClick={() => setUpdateError(null)}
              className="text-red-400 hover:text-red-600 ml-2"
              title="Dismiss error"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.slice(0, 3).map((session) => (
            <div key={session.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{session.student_name}</p>
                  <p className="text-sm text-gray-600">{session.court_name || 'Court TBD'}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(session.session_date)} at {formatTime(session.start_time)} - {formatTime(session.end_time)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 mb-1">${session.price}</div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {session.status}
                  </span>
                </div>
              </div>
              
              {session.status === 'scheduled' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(session.id, 'completed')}
                    disabled={updatingSession === session.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs py-2 px-3 rounded-md font-medium transition-colors duration-200"
                  >
                    {updatingSession === session.id ? 'Updating...' : 'Mark Completed'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(session.id, 'canceled')}
                    disabled={updatingSession === session.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs py-2 px-3 rounded-md font-medium transition-colors duration-200"
                  >
                    {updatingSession === session.id ? 'Updating...' : 'Cancel Session'}
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => navigate('/coach/sessions')}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            View all sessions →
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📅</div>
          <p className="text-gray-600 mb-4">No upcoming sessions</p>
          <button
            onClick={() => navigate('/coach/schedule')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Schedule Session
          </button>
        </div>
      )}
    </div>
  )
}

export default CoachUpcomingSessions