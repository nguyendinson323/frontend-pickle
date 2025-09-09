import React from 'react'
import { PartnerMessage } from '../../../store/slices/partnerInboxSlice'

interface MessagesListProps {
  messages: PartnerMessage[]
  onMessageClick: (message: PartnerMessage) => void
  onMarkAsRead: (messageId: number) => void
  onDelete: (messageId: number) => void
  loading: boolean
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  onMessageClick,
  onMarkAsRead,
  onDelete,
  loading
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' })
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const getMessageTypeColor = (type: string) => {
    const colors = {
      Announcement: 'bg-blue-100 text-blue-800',
      Direct: 'bg-green-100 text-green-800',
      System: 'bg-gray-100 text-gray-800',
      Tournament: 'bg-purple-100 text-purple-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getSenderRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      state: 'bg-indigo-100 text-indigo-800',
      club: 'bg-yellow-100 text-yellow-800',
      player: 'bg-green-100 text-green-800'
    }
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
        <p className="mt-1 text-sm text-gray-500">Your inbox is empty.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="divide-y divide-gray-200">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              !message.recipient?.is_read ? 'bg-blue-50' : ''
            }`}
            onClick={() => onMessageClick(message)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  message.sender.role === 'admin' ? 'bg-red-100' :
                  message.sender.role === 'state' ? 'bg-indigo-100' :
                  message.sender.role === 'club' ? 'bg-yellow-100' :
                  'bg-green-100'
                }`}>
                  <span className="text-sm font-medium">
                    {message.sender.username.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">
                      {message.sender.username}
                    </p>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getSenderRoleColor(message.sender.role)}`}>
                      {message.sender.role}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getMessageTypeColor(message.message_type)}`}>
                      {message.message_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(message.sent_at)}
                  </p>
                </div>

                <h3 className={`text-sm ${!message.recipient?.is_read ? 'font-semibold' : 'font-medium'} text-gray-900 mb-1`}>
                  {message.subject}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {message.content}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    {message.has_attachments && (
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        {message.attachments?.length || 0} attachment(s)
                      </span>
                    )}
                    {!message.recipient?.is_read && (
                      <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    {!message.recipient?.is_read && (
                      <button
                        onClick={() => onMarkAsRead(message.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(message.id)}
                      className="text-xs text-red-600 hover:text-red-800 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MessagesList