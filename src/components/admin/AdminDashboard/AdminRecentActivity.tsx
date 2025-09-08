import React from 'react'
import { useNavigate } from 'react-router-dom'

interface ActivityItem {
  type: string
  message: string
  time: string
  icon: string
}

const AdminRecentActivity: React.FC = () => {
  const navigate = useNavigate()

  const recentActivity: ActivityItem[] = [
    { type: 'user_registration', message: 'New player registered: Juan García', time: '2 hours ago', icon: '👤' },
    { type: 'tournament_created', message: 'Tournament created: Mexico City Open', time: '4 hours ago', icon: '🏆' },
    { type: 'club_approved', message: 'Club approved: Pickleball Guadalajara', time: '6 hours ago', icon: '🏢' },
    { type: 'court_registered', message: 'New court registered in Monterrey', time: '8 hours ago', icon: '🎾' },
    { type: 'state_committee', message: 'State committee update from Yucatán', time: '12 hours ago', icon: '🏛️' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {recentActivity.map((activity, index) => (
          <div key={index} className="flex items-start">
            <div className="text-2xl mr-3">{activity.icon}</div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/admin/activity')}
        className="mt-4 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
      >
        View all activity →
      </button>
    </div>
  )
}

export default AdminRecentActivity