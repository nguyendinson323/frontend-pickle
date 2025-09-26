import React from 'react'
import { StateMessage } from '../../../store/slices/stateInboxSlice'
import { FiSend, FiEye, FiTrash2, FiUsers, FiAlertCircle } from 'react-icons/fi'

interface SentMessagesTabProps {
  messages: StateMessage[]
  onViewMessage: (message: StateMessage) => void
  onDeleteMessage: (messageId: number) => void
}

const SentMessagesTab: React.FC<SentMessagesTabProps> = ({
  messages,
  onViewMessage,
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

  const getRecipientTypeColor = (recipientType: string) => {
    switch (recipientType) {
      case 'direct':
        return 'bg-blue-100 text-blue-800'
      case 'group':
        return 'bg-green-100 text-green-800'
      case 'tournament':
        return 'bg-purple-100 text-purple-800'
      case 'club':
        return 'bg-orange-100 text-orange-800'
      case 'state':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-green-100 to-emerald-200 p-8 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg">
            <FiSend className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="mt-6 text-xl font-bold text-gray-900">No sent messages</h3>
          <p className="mt-3 text-gray-600 max-w-sm mx-auto leading-relaxed">You haven't sent any messages yet. Sent messages will appear here.</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className="border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm transform hover:scale-[1.02] shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0" onClick={() => onViewMessage(message)}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {message.subject}
                  </h3>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-3 py-2 text-xs font-bold rounded-xl shadow-sm ${getMessageTypeColor(message.message_type)}`}>
                      {message.message_type === 'announcement' ? 'Announcement' : 'Direct'}
                    </span>
                    {message.recipients && message.recipients.length > 0 && (
                      <span className="inline-flex items-center px-3 py-2 text-xs font-bold rounded-xl shadow-sm bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800">
                        <FiUsers className="w-3 h-3 mr-1" />
                        {message.recipients.length} Recipient{message.recipients.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  {message.recipients && message.recipients.length > 0 ? (
                    <p className="text-sm text-gray-700 flex items-center space-x-2">
                      <span className="font-medium text-gray-500">To:</span>
                      {message.recipients.length === 1 ? (
                        <span className="font-bold text-gray-900">
                          {message.recipients[0].recipient.username} <span className="text-gray-500">({message.recipients[0].recipient.email})</span>
                        </span>
                      ) : (
                        <span className="font-bold text-indigo-700">
                          {message.recipients.length} Recipients
                        </span>
                      )}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-700 flex items-center space-x-2">
                      <span className="font-medium text-gray-500">To:</span>
                      <span className="font-bold text-gray-900">Unknown Recipients</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2 flex items-center space-x-1">
                    <span>📅</span>
                    <span>Sent: {formatDate(message.sent_at)}</span>
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

export default SentMessagesTab