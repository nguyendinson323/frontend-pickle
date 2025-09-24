import React from 'react'
import {
  FiUsers,
  FiCheckCircle,
  FiCalendar,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi'

interface CoachSessionsHeaderProps {
  totalSessions: number
  completedSessions: number
  upcomingSessions: number
  averageRating: number
}

const CoachSessionsHeader: React.FC<CoachSessionsHeaderProps> = ({
  totalSessions,
  completedSessions,
  upcomingSessions,
  averageRating
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8 mb-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
          <FiTrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Coaching Sessions</h1>
          <p className="text-gray-600 font-medium">
            Overview of your coaching performance and session statistics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sessions */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiUsers className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {totalSessions}
          </div>
          <div className="text-sm font-bold text-blue-700">
            Total Sessions
          </div>
        </div>

        {/* Completed Sessions */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {completedSessions}
          </div>
          <div className="text-sm font-bold text-green-700">
            Completed Sessions
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiCalendar className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {upcomingSessions}
          </div>
          <div className="text-sm font-bold text-orange-700">
            Upcoming Sessions
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiStar className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="text-sm font-bold text-yellow-700">
            Average Rating
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachSessionsHeader