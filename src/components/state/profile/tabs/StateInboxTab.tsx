import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../store'
import { fetchStateInboxData, markStateMessageAsRead } from '../../../../store/slices/stateInboxSlice'

export const StateInboxTab: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const {
    messages,
    sentMessages,
    templates,
    stats,
    error
  } = useSelector((state: RootState) => state.stateInbox)
  const { isLoading } = useSelector((state: RootState) => state.loading)

  useEffect(() => {
    dispatch(fetchStateInboxData())
  }, [dispatch])

  const getMessageIcon = (messageType: string) => {
    const type = messageType.toLowerCase()
    if (type.includes('announcement')) return '📢'
    if (type.includes('tournament')) return '🏆'
    if (type.includes('system')) return '⚙️'
    if (type.includes('warning') || type.includes('reminder')) return '⚠️'
    if (type.includes('federation')) return '🏛️'
    return '📮'
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString()
  }

  const handleMessageClick = (message: any) => {
    if (!message.is_read) {
      dispatch(markStateMessageAsRead(message.id))
    }
  }

  if (isLoading && !messages.length) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Inbox</h3>
          <p className="text-sm text-gray-600">Manage state committee communications</p>
        </div>
        <button
          onClick={() => navigate('/state/inbox')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Open Full Inbox
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Inbox Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Messages</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total_messages}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Unread</p>
                <p className="text-2xl font-bold text-green-900">{stats.unread_messages}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12h5v12z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Sent</p>
                <p className="text-2xl font-bold text-purple-900">{sentMessages.length}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Templates</p>
                <p className="text-2xl font-bold text-orange-900">{templates.length}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Messages */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Recent Messages</h4>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Messages</h4>
            <p className="text-gray-600">You don't have any messages yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.slice(0, 5).map((message) => (
              <div
                key={message.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !message.is_read ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleMessageClick(message)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-lg">{getMessageIcon(message.message_type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium text-gray-900 ${!message.is_read ? 'font-semibold' : ''}`}>
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(message.sent_at)}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message.content}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <p className="text-xs text-gray-500">From: {message.sender.username}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        message.message_type === 'announcement' ? 'bg-blue-100 text-blue-800' :
                        message.message_type === 'system' ? 'bg-gray-100 text-gray-800' :
                        message.message_type === 'tournament' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {message.message_type.charAt(0).toUpperCase() + message.message_type.slice(1)}
                      </span>
                      {message.has_attachments && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          📎 Attachment
                        </span>
                      )}
                      {!message.is_read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full" title="Unread"></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {messages.length > 5 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <button
              onClick={() => navigate('/state/inbox')}
              className="inline-flex items-center px-4 py-2 text-red-600 hover:text-red-700 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.476L3 21l2.476-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
              View All {messages.length} Messages
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/state/inbox?action=compose')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Compose Message
        </button>
        <button
          onClick={() => navigate('/state/inbox?action=announcement')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Send Announcement
        </button>
        <button
          onClick={() => navigate('/state/inbox?section=templates')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Message Templates
        </button>
      </div>
    </div>
  )
}