import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CoachRecentSession } from '../../../store/slices/coachDashboardSlice'

interface CoachRecentSessionsProps {
  sessions: CoachRecentSession[]
}

const CoachRecentSessions: React.FC<CoachRecentSessionsProps> = ({ sessions }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Sessions</h3>
      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.slice(0, 4).map((session) => {
            const sessionDate = new Date(session.session_date)
            const formattedDate = sessionDate.toLocaleDateString()
            const sessionType = session.court_name ? `At ${session.court_name}` : 'Private Session'
            
            return (
              <div key={session.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{session.student_name}</p>
                  <p className="text-sm text-gray-600">{sessionType}</p>
                  <p className="text-xs text-gray-500">{formattedDate} • {session.start_time}</p>
                  <p className="text-xs font-medium text-emerald-600">${session.price}</p>
                </div>
                <div className="text-right">
                  <div className="mb-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      session.status === 'completed' ? 'bg-green-100 text-green-800' :
                      session.status === 'canceled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  {session.rating && (
                    <div className="flex items-center justify-end">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      <span className="text-sm font-medium text-gray-900">{session.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          <button
            onClick={() => navigate('/coach/sessions')}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            View all sessions →
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-gray-600">No recent sessions</p>
        </div>
      )}
    </div>
  )
}

export default CoachRecentSessions