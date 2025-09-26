import React from 'react'
import { StateMessage } from '../../../store/slices/stateInboxSlice'
import { FiX, FiMail, FiUser, FiCalendar, FiCheck, FiCornerUpLeft, FiTrash2, FiAlertCircle } from 'react-icons/fi'

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-8 border border-white/20 w-full max-w-4xl shadow-2xl rounded-3xl bg-white/90 backdrop-blur-lg">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center space-x-4 flex-1">
              <div className={`p-4 rounded-2xl shadow-lg ${
                message.message_type === 'announcement'
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                  : 'bg-gradient-to-br from-blue-500 to-blue-600'
              }`}>
                <FiMail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  {!message.is_read && (
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg animate-pulse"></div>
                  )}
                  <h3 className="text-3xl font-bold text-gray-900">{message.subject}</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-xl shadow-sm ${getMessageTypeColor(message.message_type)}`}>
                    {message.message_type === 'announcement' ? 'Announcement' : 'Direct Message'}
                  </span>
                  <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-xl shadow-sm ${getSenderRoleColor(message.sender.role)}`}>
                    {message.sender.role.charAt(0).toUpperCase() + message.sender.role.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Message Details */}
          <div className="border-b border-gray-200/50 pb-6 mb-8">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl space-y-4">
              <div className="flex items-center space-x-3">
                <FiUser className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-bold text-gray-800">From:</span>
                <span className="text-lg font-semibold text-gray-900">
                  {message.sender.username}
                </span>
                <span className="text-gray-600">({message.sender.email})</span>
              </div>
              
              {message.recipients && message.recipients.length > 0 && (
                <div className="flex items-start space-x-3">
                  <FiUser className="w-5 h-5 text-green-600 mt-1" />
                  <span className="text-lg font-bold text-gray-800">To:</span>
                  <div className="flex-1">
                    {message.recipients.map((recipientData, index) => (
                      <div key={recipientData.id} className={`flex items-center justify-between p-3 rounded-xl ${index > 0 ? 'mt-2' : ''} bg-white shadow-sm`}>
                        <span className="font-semibold text-gray-900">
                          {recipientData.recipient.username} <span className="text-gray-600">({recipientData.recipient.email})</span>
                        </span>
                        {recipientData.is_read && (
                          <span className="flex items-center space-x-1 text-green-600 font-bold">
                            <FiCheck className="w-4 h-4" />
                            <span>Read</span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <FiCalendar className="w-5 h-5 text-purple-600" />
                <span className="text-lg font-bold text-gray-800">Sent:</span>
                <span className="text-lg font-semibold text-gray-900">{formatDate(message.sent_at)}</span>
              </div>

              {message.read_at && (
                <div className="flex items-center space-x-3">
                  <FiCheck className="w-5 h-5 text-green-600" />
                  <span className="text-lg font-bold text-gray-800">Read:</span>
                  <span className="text-lg font-semibold text-gray-900">{formatDate(message.read_at)}</span>
                </div>
              )}
            </div>

            {message.message_type === 'announcement' && message.announcement_stats && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50">
                <div className="flex items-center space-x-3 mb-4">
                  <FiAlertCircle className="w-6 h-6 text-green-600" />
                  <h4 className="text-xl font-bold text-green-900">Announcement Statistics</h4>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{message.announcement_stats.total_recipients}</div>
                    <span className="text-gray-600 font-semibold">Total Recipients</span>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-green-600 mb-2">{message.announcement_stats.delivered}</div>
                    <span className="text-gray-600 font-semibold">Delivered</span>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{message.announcement_stats.read}</div>
                    <span className="text-gray-600 font-semibold">Read</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Content */}
          <div className="mb-8">
            <h4 className="text-xl font-bold text-gray-900 mb-4">Message Content</h4>
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200/50 shadow-lg">
              <div className="whitespace-pre-wrap text-gray-900 leading-relaxed text-lg">
                {message.content}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200/50">
            <div className="flex space-x-4">
              {!message.is_read && onMarkAsRead && (
                <button
                  onClick={() => {
                    onMarkAsRead(message.id)
                    onClose()
                  }}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <FiCheck className="w-5 h-5 mr-2" />
                  Mark as Read
                </button>
              )}

              {message.message_type !== 'announcement' && onReply && (
                <button
                  onClick={() => {
                    onReply(message)
                    onClose()
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <FiCornerUpLeft className="w-5 h-5 mr-2" />
                  Reply
                </button>
              )}
            </div>

            <div className="flex space-x-4">
              {onDelete && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this message?')) {
                      onDelete(message.id)
                      onClose()
                    }
                  }}
                  className="text-red-700 hover:text-red-800 px-6 py-3 border-2 border-red-300 hover:border-red-400 rounded-xl font-semibold bg-white hover:bg-red-50 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                >
                  <FiTrash2 className="w-5 h-5" />
                  <span>Delete</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="px-8 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:scale-105"
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