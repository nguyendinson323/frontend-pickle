import React from 'react'
import { PartnerMessage } from '../../../store/slices/partnerInboxSlice'
import {
  FiMail,
  FiPaperclip,
  FiEye,
  FiTrash2,
  FiInbox,
  FiUser,
  FiClock
} from 'react-icons/fi'

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
      Announcement: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300',
      Direct: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
      System: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300',
      Tournament: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300'
    }
    return colors[type as keyof typeof colors] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
  }

  const getSenderRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300',
      state: 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border border-indigo-300',
      club: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300',
      player: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
    }
    return colors[role as keyof typeof colors] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
  }

  const getSenderRoleIcon = (role: string) => {
    const colors = {
      admin: 'bg-gradient-to-br from-red-600 to-red-700',
      state: 'bg-gradient-to-br from-indigo-600 to-indigo-700',
      club: 'bg-gradient-to-br from-yellow-600 to-yellow-700',
      player: 'bg-gradient-to-br from-green-600 to-green-700'
    }
    return colors[role as keyof typeof colors] || 'bg-gradient-to-br from-gray-600 to-gray-700'
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
            <FiMail className="w-4 h-4 text-white animate-pulse" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Loading Messages...</h2>
        </div>
        <div className="animate-pulse space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <div className="flex space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-full animate-pulse"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-2/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <FiInbox className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">No Messages</h3>
        <p className="text-gray-600 font-medium">Your inbox is empty. New messages will appear here.</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-4">
        <div className="flex items-center text-white">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-3">
            <FiMail className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold">Messages ({messages.length})</h2>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-300 hover:shadow-md ${
              !message.recipient?.is_read ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500' : 'hover:border-l-4 hover:border-blue-200'
            }`}
            onClick={() => onMessageClick(message)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${getSenderRoleIcon(message.sender.role)}`}>
                  <FiUser className="w-6 h-6" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">
                      {message.sender.username}
                    </p>
                    <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getSenderRoleColor(message.sender.role)}`}>
                      {message.sender.role}
                    </span>
                    <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getMessageTypeColor(message.message_type)}`}>
                      {message.message_type}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 font-medium">
                    <FiClock className="w-4 h-4 mr-1" />
                    {formatDate(message.sent_at)}
                  </div>
                </div>

                <h3 className={`text-lg ${!message.recipient?.is_read ? 'font-bold' : 'font-semibold'} text-gray-900 mb-2`}>
                  {message.subject}
                </h3>

                <p className="text-sm text-gray-700 line-clamp-2 mb-4 font-medium">
                  {message.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {message.has_attachments && (
                      <div className="inline-flex items-center px-3 py-1 text-xs font-bold text-purple-700 bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-300 rounded-full">
                        <FiPaperclip className="w-3 h-3 mr-1" />
                        {message.attachments?.length || 0} attachment(s)
                      </div>
                    )}
                    {!message.recipient?.is_read && (
                      <span className="inline-flex px-3 py-1 text-xs font-bold text-orange-700 bg-gradient-to-r from-orange-100 to-orange-200 border border-orange-300 rounded-full animate-pulse">
                        New
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
                    {!message.recipient?.is_read && (
                      <button
                        onClick={() => onMarkAsRead(message.id)}
                        className="inline-flex items-center px-3 py-1 text-xs font-bold text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 rounded-full hover:from-blue-200 hover:to-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <FiEye className="w-3 h-3 mr-1" />
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(message.id)}
                      className="inline-flex items-center px-3 py-1 text-xs font-bold text-red-700 bg-gradient-to-r from-red-100 to-red-200 border border-red-300 rounded-full hover:from-red-200 hover:to-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <FiTrash2 className="w-3 h-3 mr-1" />
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