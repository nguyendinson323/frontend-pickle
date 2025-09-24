import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CoachRecentSession } from '../../../store/slices/coachDashboardSlice'
import {
  FiClock,
  FiUser,
  FiMapPin,
  FiDollarSign,
  FiStar,
  FiChevronRight,
  FiCalendar,
  FiFileText
} from 'react-icons/fi'

interface CoachRecentSessionsProps {
  sessions: CoachRecentSession[]
}

const CoachRecentSessions: React.FC<CoachRecentSessionsProps> = ({ sessions }) => {
  const navigate = useNavigate()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = today.getTime() - date.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl shadow-2xl p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-4">
          <FiClock className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Recent Sessions</h3>
      </div>
      {sessions.length > 0 ? (
        <div className="space-y-6">
          {sessions.slice(0, 4).map((session) => {
            const sessionType = session.court_name ? `At ${session.court_name}` : 'Private Session'

            return (
              <div key={session.id} className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center mr-3">
                        <FiUser className="w-5 h-5 text-white" />
                      </div>
                      <p className="font-bold text-gray-900 text-lg">{session.student_name}</p>
                    </div>
                    <div className="space-y-2 ml-13">
                      <div className="flex items-center text-sm font-medium text-gray-600">
                        <FiMapPin className="w-4 h-4 mr-2 text-green-600" />
                        {sessionType}
                      </div>
                      <div className="flex items-center text-sm font-medium text-gray-600">
                        <FiCalendar className="w-4 h-4 mr-2 text-green-600" />
                        {formatDate(session.session_date)} • {formatTime(session.start_time)}
                      </div>
                      <div className="flex items-center text-sm font-medium text-emerald-700">
                        <FiDollarSign className="w-4 h-4 mr-2" />
                        ${session.price}
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-3">
                    <span className={`text-sm font-bold px-3 py-1 rounded-full border ${
                      session.status === 'completed' ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-200 text-green-800' :
                      session.status === 'canceled' ? 'bg-gradient-to-r from-red-100 to-pink-100 border-red-200 text-red-800' :
                      'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200 text-blue-800'
                    }`}>
                      {session.status}
                    </span>
                    {session.rating && (
                      <div className="flex items-center justify-end">
                        <FiStar className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-bold text-gray-900">{session.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <button
            onClick={() => navigate('/coach/sessions')}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
          >
            View all sessions
            <FiChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiFileText className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-3">No recent sessions</h4>
          <p className="text-gray-600 font-medium">Your completed sessions will appear here</p>
        </div>
      )}
    </div>
  )
}

export default CoachRecentSessions