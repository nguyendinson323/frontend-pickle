import React from 'react'
import { StateMessage } from '../../../store/slices/stateInboxSlice'

interface MessageViewModalProps {
  isOpen: boolean
  onClose: () => void
  message: StateMessage | null
  onMarkAsRead?: (messageId: number) => void
  onDelete?: (messageId: number) => void
  onReply?: (message: StateMessage) => void
}

const MessageViewModal: React.FC<MessageViewModalProps> = ({
  isOpen,
  onClose,
  message,
  onMarkAsRead,
  onDelete,
  onReply
}) => {
  if (!isOpen || !message) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                {!message.is_read && (
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">{message.subject}</h3>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMessageTypeColor(message.is_announcement)}`}>
                  {message.is_announcement ? 'Announcement' : 'Direct Message'}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSenderRoleColor(message.sender.role)}`}>
                  {message.sender.role.charAt(0).toUpperCase() + message.sender.role.slice(1)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Message Details */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 w-20">From:</span>
                <span className="text-sm text-gray-900">
                  {message.sender.username} ({message.sender.email})
                </span>
              </div>
              
              {message.recipient && (
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 w-20">To:</span>
                  <span className="text-sm text-gray-900">
                    {message.recipient.username || message.recipient.name}
                    {message.recipient.email && ` (${message.recipient.email})`}
                  </span>
                </div>
              )}

              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 w-20">Sent:</span>
                <span className="text-sm text-gray-900">{formatDate(message.sent_at)}</span>
              </div>

              {message.read_at && (
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 w-20">Read:</span>
                  <span className="text-sm text-gray-900">{formatDate(message.read_at)}</span>
                </div>
              )}
            </div>

            {message.is_announcement && message.announcement_stats && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Announcement Statistics</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Recipients:</span>
                    <div className="font-semibold text-gray-900">{message.announcement_stats.total_recipients}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Delivered:</span>
                    <div className="font-semibold text-green-600">{message.announcement_stats.delivered}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Read:</span>
                    <div className="font-semibold text-blue-600">{message.announcement_stats.read}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Content */}
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                {message.message}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex space-x-3">
              {!message.is_read && onMarkAsRead && (
                <button
                  onClick={() => {
                    onMarkAsRead(message.id)
                    onClose()
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mark as Read
                </button>
              )}

              {!message.is_announcement && onReply && (
                <button
                  onClick={() => {
                    onReply(message)
                    onClose()
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Reply
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              {onDelete && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this message?')) {
                      onDelete(message.id)
                      onClose()
                    }
                  }}
                  className="text-red-600 hover:text-red-800 px-4 py-2 border border-red-300 rounded-lg text-sm font-medium"
                >
                  Delete
                </button>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageViewModal