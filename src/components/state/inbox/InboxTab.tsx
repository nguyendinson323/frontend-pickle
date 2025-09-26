import React from 'react'
import { StateMessage } from '../../../store/slices/stateInboxSlice'
import { FiMail, FiEye, FiCheck, FiTrash2, FiAlertCircle } from 'react-icons/fi'

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

  const getMessageTypeColor = (messageType: string) => {
    return messageType === 'announcement' 
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
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-200 p-8 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg">
            <FiMail className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="mt-6 text-xl font-bold text-gray-900">No messages</h3>
          <p className="mt-3 text-gray-600 max-w-sm mx-auto leading-relaxed">You have no received messages. New messages will appear here.</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
              !message.is_read
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-blue-100/50'
                : 'bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0" onClick={() => onViewMessage(message)}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center space-x-3">
                    {!message.is_read && (
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg animate-pulse"></div>
                    )}
                    <h3 className={`text-xl font-bold ${!message.is_read ? 'text-gray-900' : 'text-gray-800'}`}>
                      {message.subject}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-3 py-2 text-xs font-bold rounded-xl shadow-sm ${getMessageTypeColor(message.message_type)}`}>
                      {message.message_type === 'announcement' ? 'Announcement' : 'Direct'}
                    </span>
                    <span className={`inline-flex px-3 py-2 text-xs font-bold rounded-xl shadow-sm ${getSenderRoleColor(message.sender.role)}`}>
                      {message.sender.role.charAt(0).toUpperCase() + message.sender.role.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 flex items-center space-x-2">
                    <span className="font-medium text-gray-500">From:</span>
                    <span className="font-bold text-gray-900">{message.sender.username}</span>
                    <span className="text-gray-500">({message.sender.email})</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center space-x-1">
                    <span>📅</span>
                    <span>{formatDate(message.sent_at)}</span>
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 line-clamp-3 leading-relaxed">
                    {message.content.length > 200
                      ? `${message.content.substring(0, 200)}...`
                      : message.content
                    }
                  </p>
                </div>

                {message.message_type === 'announcement' && message.announcement_stats && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiAlertCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">Announcement Statistics</span>
                    </div>
                    <p className="text-sm text-green-700">
                      📊 {message.announcement_stats.total_recipients} recipients • ✅ {message.announcement_stats.delivered} delivered • 👁️ {message.announcement_stats.read} read
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 ml-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewMessage(message)
                  }}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
                  title="View message"
                >
                  <FiEye className="w-4 h-4" />
                </button>

                {!message.is_read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onMarkAsRead(message.id)
                    }}
                    className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
                    title="Mark as read"
                  >
                    <FiCheck className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm('Are you sure you want to delete this message?')) {
                      onDeleteMessage(message.id)
                    }
                  }}
                  className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
                  title="Delete message"
                >
                  <FiTrash2 className="w-4 h-4" />
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