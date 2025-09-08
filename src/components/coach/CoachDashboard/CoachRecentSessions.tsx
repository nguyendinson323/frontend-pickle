import React from 'react'
import { useNavigate } from 'react-router-dom'

interface RecentSession {
  id: number
  studentName: string
  sessionType: string
  date: string
  rating: number
}

interface CoachRecentSessionsProps {
  sessions: RecentSession[]
}

const CoachRecentSessions: React.FC<CoachRecentSessionsProps> = ({ sessions }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Sessions</h3>
      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.slice(0, 4).map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{session.studentName}</p>
                <p className="text-sm text-gray-600">{session.sessionType}</p>
                <p className="text-xs text-gray-500">{session.date}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">⭐</span>
                  <span className="text-sm font-medium text-gray-900">{session.rating}</span>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/coach/session-history')}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            View session history →
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