import React from 'react'
import { StateMessage } from '../../../store/slices/stateInboxSlice'

interface InboxTabProps {
  messages: StateMessage[]
  onViewMessage: (message: StateMessage) => void
  onMarkAsRead: (messageId: number) => void
  onDeleteMessage: (messageId: number) => void
}

const InboxTab: React.FC<InboxTabProps> = ({
  messages,
  onViewMessage,
  onMarkAsRead,
  onDeleteMessage
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMessageTypeColor = (isAnnouncement: boolean) => {
    return isAnnouncement 
      ? 'bg-green-100 text-green-800'
      : 'bg-blue-100 text-blue-800'
  }

  const getSenderRoleColor = (role: string) => {
    switch (role) {
      case 'player':
        return 'bg-blue-100 text-blue-800'
      case 'coach':
        return 'bg-purple-100 text-purple-800'
      case 'club':
        return 'bg-orange-100 text-orange-800'
      case 'partner':
        return 'bg-green-100 text-green-800'
      case 'state':
        return 'bg-indigo-100 text-indigo-800'
      case 'admin':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0L12 8 4 13" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
          <p className="mt-1 text-sm text-gray-500">You have no received messages.</p>
        </div>
      ) : (
        messages.map((message) => (
          <div 
            key={message.id} 
            className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
              !message.is_read ? 'bg-blue-50 border-blue-200' : 'bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0" onClick={() => onViewMessage(message)}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center space-x-2">
                    {!message.is_read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                    <h3 className={`text-lg font-medium ${!message.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {message.subject}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMessageTypeColor(message.is_announcement)}`}>
                      {message.is_announcement ? 'Announcement' : 'Direct'}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSenderRoleColor(message.sender.role)}`}>
                      {message.sender.role.charAt(0).toUpperCase() + message.sender.role.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    From: <span className="font-medium">{message.sender.username}</span> ({message.sender.email})
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(message.sent_at)}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {message.message.length > 150 
                      ? `${message.message.substring(0, 150)}...`
                      : message.message
                    }
                  </p>
                </div>

                {message.is_announcement && message.announcement_stats && (
                  <div className="mb-3 p-2  rounded-lg">
                    <p className="text-xs text-gray-600">
                      Announcement Stats: {message.announcement_stats.total_recipients} recipients, {message.announcement_stats.delivered} delivered, {message.announcement_stats.read} read
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewMessage(message)
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  title="View message"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>

                {!message.is_read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onMarkAsRead(message.id)
                    }}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                    title="Mark as read"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm('Are you sure you want to delete this message?')) {
                      onDeleteMessage(message.id)
                    }
                  }}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                  title="Delete message"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default InboxTab