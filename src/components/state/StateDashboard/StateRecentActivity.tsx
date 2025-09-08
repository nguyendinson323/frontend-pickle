import React from 'react'
import { useNavigate } from 'react-router-dom'

interface Activity {
  icon: string
  message: string
  time: string
}

interface StateRecentActivityProps {
  recentActivity: Activity[]
}

const StateRecentActivity: React.FC<StateRecentActivityProps> = ({ recentActivity }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
      {recentActivity.length > 0 ? (
        <div className="space-y-4">
          {recentActivity.slice(0, 4).map((activity, index) => (
            <div key={index} className="flex items-start">
              <div className="text-2xl mr-3">{activity.icon}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/state/activity')}
            className="text-red-600 hover:text-red-500 text-sm font-medium"
          >
            View all activity →
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-gray-600">No recent activity</p>
        </div>
      )}
    </div>
  )
}

export default StateRecentActivity