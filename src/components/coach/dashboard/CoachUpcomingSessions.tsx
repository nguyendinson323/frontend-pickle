import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CoachUpcomingSession } from '../../../store/slices/coachDashboardSlice'

interface CoachUpcomingSessionsProps {
  sessions: CoachUpcomingSession[]
}

const CoachUpcomingSessions: React.FC<CoachUpcomingSessionsProps> = ({ sessions }) => {
  const navigate = useNavigate()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Sessions</h3>
      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.slice(0, 3).map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">{session.student_name}</p>
                <p className="text-sm text-gray-600">{session.court_name || 'Court TBD'}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(session.session_date)} at {formatTime(session.start_time)} - {formatTime(session.end_time)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">${session.price}</div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {session.status}
                </span>
              </div>
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