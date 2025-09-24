import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { fetchNotifications, markAllAsRead, markAsRead } from '../../../store/slices/notificationsSlice'
import { Notification } from '../../../types'
import {
  FiInbox,
  FiMail,
  FiLoader,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiAward,
  FiBarChart2,
  FiCreditCard,
  FiSettings,
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiChevronRight
} from 'react-icons/fi'

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
        return FiAward
      case 'Match':
        return FiUser
      case 'Ranking':
        return FiBarChart2
      case 'Payment':
        return FiCreditCard
      case 'System':
        return FiSettings
      default:
        return FiMail
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case 'Tournament':
        return 'from-yellow-500 to-orange-600'
      case 'Match':
        return 'from-green-500 to-emerald-600'
      case 'Ranking':
        return 'from-blue-500 to-indigo-600'
      case 'Payment':
        return 'from-purple-500 to-pink-600'
      case 'System':
        return 'from-gray-500 to-gray-600'
      default:
        return 'from-indigo-500 to-purple-600'
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
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FiLoader className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Notifications</h3>
          <p className="text-gray-600 font-medium">Please wait while we fetch your messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <FiInbox className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Notifications & Messages</h3>
              <p className="text-lg font-medium mt-1 flex items-center">
                {unreadCount > 0 ? (
                  <>
                    <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold mr-2 shadow-lg">
                      {unreadCount}
                    </span>
                    <span className="text-red-600">unread notification{unreadCount > 1 ? 's' : ''}</span>
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-600 font-bold">All caught up!</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Filter Buttons */}
            <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-2 shadow-lg">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 flex items-center ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-white'
                }`}
              >
                <FiMail className="w-4 h-4 mr-2" />
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 flex items-center ${
                  filter === 'unread'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-white'
                }`}
              >
                <FiFilter className="w-4 h-4 mr-2" />
                Unread ({unreadCount})
              </button>
            </div>

            {/* Mark All Read Button */}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
              >
                <FiCheckCircle className="w-4 h-4 mr-2" />
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-16 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            {filter === 'unread' ? (
              <FiCheckCircle className="w-12 h-12 text-white" />
            ) : (
              <FiInbox className="w-12 h-12 text-white" />
            )}
          </div>
          <h4 className="text-2xl font-bold text-gray-900 mb-4">
            {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
          </h4>
          <p className="text-gray-600 font-medium text-lg max-w-md mx-auto">
            {filter === 'unread'
              ? 'All notifications have been read.'
              : 'New notifications about tournaments, payments, and federation announcements will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredNotifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.notification_type)
            const iconColorClass = getIconColor(notification.notification_type)

            return (
              <div
                key={notification.id}
                className={`bg-white rounded-3xl border-2 transition-all duration-300 hover:shadow-xl cursor-pointer hover:transform hover:scale-105 ${
                  notification.is_read
                    ? 'border-gray-200 shadow-lg'
                    : 'border-blue-300 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50'
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="p-8">
                  <div className="flex items-start space-x-6">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 bg-gradient-to-r ${iconColorClass} rounded-full flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className={`text-lg font-bold ${
                          notification.is_read ? 'text-gray-900' : 'text-blue-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center text-gray-500">
                            <FiClock className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">
                              {formatDate(notification.created_at)}
                            </span>
                          </div>
                          {!notification.is_read && (
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg"></div>
                          )}
                        </div>
                      </div>

                      <p className={`text-base font-medium mb-4 ${
                        notification.is_read ? 'text-gray-700' : 'text-blue-800'
                      }`}>
                        {notification.content}
                      </p>

                      {notification.action_url && (
                        <button className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-100 hover:bg-indigo-200 px-4 py-2 rounded-2xl transition-all duration-300">
                          <FiEye className="w-4 h-4 mr-2" />
                          View Details
                          <FiChevronRight className="w-4 h-4 ml-2" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PlayerInbox