import React from 'react'
import { useNavigate } from 'react-router-dom'
import { RecentActivity } from '../../../store/slices/adminDashboardSlice'

interface AdminRecentActivityProps {
  recentActivity: RecentActivity[]
}

const AdminRecentActivity: React.FC<AdminRecentActivityProps> = ({ recentActivity }) => {
  const navigate = useNavigate()

  const getActivityIcon = (type: RecentActivity['type']): string => {
    switch (type) {
      case 'user_registration': return '👤'
      case 'payment': return '💰'
      case 'tournament_created': return '🏆'
      case 'court_registered': return '🎾'
      case 'message_sent': return '📧'
      default: return '📋'
    }
  }

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInMs = now.getTime() - activityTime.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {recentActivity.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="text-2xl mr-3">{getActivityIcon(activity.type)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span>{activity.user.name} ({activity.user.role})</span>
                  <span className="mx-2">•</span>
                  <span>{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
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