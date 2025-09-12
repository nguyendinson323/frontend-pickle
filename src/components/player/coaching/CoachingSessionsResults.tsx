import React from 'react'
import { CoachingSession } from '../../../store/slices/coachingSessionsSlice'

interface CoachingSessionsResultsProps {
  sessions: CoachingSession[]
  searchPerformed: boolean
  onSessionSelect: (sessionId: number) => void
  formatDate: (dateString: string) => string
  formatTime: (timeString: string) => string
  getSessionTypeIcon: (type: string) => string
  getStatusColor: (status: string) => string
}

const CoachingSessionsResults: React.FC<CoachingSessionsResultsProps> = ({
  sessions,
  searchPerformed,
  onSessionSelect,
  formatDate,
  formatTime,
  getSessionTypeIcon,
  getStatusColor
}) => {
  if (!searchPerformed) return null

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Available Sessions ({sessions.length})
      </h3>
      
      {sessions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No sessions found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map(session => (
            <div
              key={session.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <span className="text-2xl">{getSessionTypeIcon(session.session_type)}</span>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{session.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      with {session.coach.full_name}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-3">
                      <span>📅 {formatDate(session.scheduled_date)}</span>
                      <span>⏰ {formatTime(session.start_time)} - {formatTime(session.end_time)}</span>
                      <span>⏱️ {session.duration_minutes} min</span>
                      <span>👥 {session.current_participants}/{session.max_participants} spots</span>
                    </div>

                    {session.description && (
                      <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                    )}

                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(session.status)}`}>
                        {session.session_type}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {session.session_format === 'in_person' ? '📍 In Person' : '💻 Virtual'}
                      </span>
                      {session.coach.rating && (
                        <span className="text-xs text-yellow-600">
                          ⭐ {session.coach.rating.toFixed(1)} ({session.coach.total_reviews} reviews)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    ${session.price_per_person}
                  </p>
                  <button
                    onClick={() => onSessionSelect(session.id)}
                    disabled={session.current_participants >= session.max_participants}
                    className={`mt-2 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      session.current_participants >= session.max_participants
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                    }`}
                  >
                    {session.current_participants >= session.max_participants ? 'Full' : 'Book Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CoachingSessionsResults