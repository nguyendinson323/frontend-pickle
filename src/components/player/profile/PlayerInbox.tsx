import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { fetchNotifications, markAllAsRead, markAsRead } from '../../../store/slices/notificationsSlice'
import { Notification } from '../../../types'

const PlayerInbox: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { notifications, unreadCount, isLoading } = useSelector((state: RootState) => state.notifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    dispatch(fetchNotifications({ limit: 20, offset: 0 }))
  }, [dispatch])

  const handleMarkAllAsRead = async () => {
    if (unreadCount > 0) {
      dispatch(markAllAsRead())
    }
  }

  const handleMarkAsRead = async (notificationId: number) => {
    const notification = notifications.find(n => n.id === notificationId)
    if (notification && !notification.is_read) {
      dispatch(markAsRead(notificationId))
    }
  }

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.is_read)
    : notifications

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Tournament':
        return '🏆'
      case 'Match':
        return '🏓'
      case 'Ranking':
        return '📊'
      case 'Payment':
        return '💳'
      case 'System':
        return '⚙️'
      default:
        return '📬'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Notifications & Messages</h3>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Filter Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                filter === 'unread'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Mark All Read Button */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl text-gray-400 mb-4 block">
            {filter === 'unread' ? '✅' : '📬'}
          </span>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
          </h4>
          <p className="text-gray-500">
            {filter === 'unread'
              ? 'All notifications have been read.'
              : 'New notifications about tournaments, payments, and federation announcements will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                notification.is_read
                  ? 'bg-white border-gray-200'
                  : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
              }`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    notification.is_read ? 'bg-gray-100' : 'bg-blue-200'
                  }`}>
                    {getNotificationIcon(notification.notification_type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${
                      notification.is_read ? 'text-gray-900' : 'text-blue-900'
                    }`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(notification.created_at)}
                      </span>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <p className={`text-sm mt-1 ${
                    notification.is_read ? 'text-gray-600' : 'text-blue-800'
                  }`}>
                    {notification.content}
                  </p>

                  {notification.action_url && (
                    <button className="text-xs text-indigo-600 hover:text-indigo-800 mt-2 font-medium">
                      View Details →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PlayerInbox