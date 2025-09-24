import React from 'react'
import { CoachingSession } from '../../../store/slices/coachingSessionsSlice'
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiMapPin,
  FiMonitor,
  FiStar,
  FiBookOpen,
  FiAlertCircle
} from 'react-icons/fi'

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
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-4">
          <FiBookOpen className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">
          Available Sessions ({sessions.length})
        </h3>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-10 h-10 text-white" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">No Sessions Found</h4>
          <p className="text-gray-600 text-lg">No sessions found matching your criteria. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sessions.map(session => (
            <div
              key={session.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-6 flex-1">
                  {/* Session Type Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">{getSessionTypeIcon(session.session_type)}</span>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{session.title}</h4>
                    <p className="text-lg text-gray-600 mb-4 font-medium">
                      with {session.coach.full_name}
                    </p>

                    {/* Session Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                        <div className="flex items-center mb-2">
                          <FiCalendar className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-sm font-bold text-blue-800">Date</span>
                        </div>
                        <p className="text-blue-900 font-medium">{formatDate(session.scheduled_date)}</p>
                      </div>

                      <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                        <div className="flex items-center mb-2">
                          <FiClock className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-sm font-bold text-green-800">Time</span>
                        </div>
                        <p className="text-green-900 font-medium">{formatTime(session.start_time)} - {formatTime(session.end_time)}</p>
                      </div>

                      <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
                        <div className="flex items-center mb-2">
                          <FiClock className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm font-bold text-yellow-800">Duration</span>
                        </div>
                        <p className="text-yellow-900 font-medium">{session.duration_minutes} min</p>
                      </div>

                      <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
                        <div className="flex items-center mb-2">
                          <FiUsers className="w-4 h-4 text-purple-600 mr-2" />
                          <span className="text-sm font-bold text-purple-800">Spots</span>
                        </div>
                        <p className="text-purple-900 font-medium">{session.current_participants}/{session.max_participants}</p>
                      </div>
                    </div>

                    {session.description && (
                      <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
                        <p className="text-gray-700 font-medium">{session.description}</p>
                      </div>
                    )}

                    {/* Tags and Ratings */}
                    <div className="flex flex-wrap items-center gap-4">
                      <span className={`px-4 py-2 text-sm font-bold rounded-2xl capitalize ${getStatusColor(session.status)}`}>
                        {session.session_type}
                      </span>

                      <span className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 text-sm font-bold rounded-2xl border border-indigo-200">
                        {session.session_format === 'in_person' ? (
                          <>
                            <FiMapPin className="w-4 h-4 mr-2" />
                            In Person
                          </>
                        ) : (
                          <>
                            <FiMonitor className="w-4 h-4 mr-2" />
                            Virtual
                          </>
                        )}
                      </span>

                      {session.coach.rating && (
                        <span className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-2xl border border-yellow-200">
                          <FiStar className="w-4 h-4 mr-2" />
                          {session.coach.rating.toFixed(1)} ({session.coach.total_reviews} reviews)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price and Book Button */}
                <div className="text-right ml-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mb-4">
                    <p className="text-sm font-bold text-green-700 mb-1">Price</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${session.price_per_person}
                    </p>
                  </div>

                  <button
                    onClick={() => onSessionSelect(session.id)}
                    disabled={session.current_participants >= session.max_participants}
                    className={`w-full inline-flex items-center justify-center px-6 py-4 text-lg font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                      session.current_participants >= session.max_participants
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:from-green-700 hover:to-emerald-800 focus:ring-green-500 shadow-lg hover:shadow-xl hover:transform hover:scale-105'
                    }`}
                  >
                    {session.current_participants >= session.max_participants ? (
                      <>
                        <FiUsers className="w-5 h-5 mr-2" />
                        Full
                      </>
                    ) : (
                      <>
                        <FiCalendar className="w-5 h-5 mr-2" />
                        Book Now
                      </>
                    )}
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