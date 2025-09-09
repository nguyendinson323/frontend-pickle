import React from 'react'

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
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">My Coaching Sessions</h1>
        <div className="text-sm text-gray-500">
          Manage your coaching schedule and student sessions
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{completedSessions}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{upcomingSessions}</div>
          <div className="text-sm text-gray-600">Upcoming</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{averageRating.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
          <div className="text-xs text-gray-500">
            {'★'.repeat(Math.floor(averageRating))}
            {averageRating > 0 && averageRating % 1 !== 0 && '☆'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachSessionsHeader