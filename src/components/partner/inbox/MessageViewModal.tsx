import React from 'react'
import { PartnerMessage } from '../../../store/slices/partnerInboxSlice'
import {
  FiX,
  FiUser,
  FiClock,
  FiMail,
  FiPaperclip,
  FiDownload,
  FiTrash2,
  FiTag,
  FiFileText
} from 'react-icons/fi'

interface MessageViewModalProps {
  message: PartnerMessage | null
  isOpen: boolean
  onClose: () => void
  onDelete: (messageId: number) => void
}

const MessageViewModal: React.FC<MessageViewModalProps> = ({
  message,
  isOpen,
  onClose,
  onDelete
}) => {
  if (!isOpen || !message) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
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

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      onDelete(message.id)
      onClose()
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center text-white">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                <FiMail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{message.subject}</h2>
                <div className="flex items-center space-x-4 text-blue-100">
                  <div className="flex items-center">
                    <FiClock className="w-4 h-4 mr-1" />
                    <span className="font-medium">{formatDate(message.sent_at)}</span>
                  </div>
                  {!message.recipient?.is_read && (
                    <span className="inline-flex px-3 py-1 text-xs font-bold text-orange-700 bg-orange-200 border border-orange-300 rounded-full animate-pulse">
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-2 rounded-2xl hover:bg-white hover:bg-opacity-10 transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(95vh - 200px)' }}>
          <div className="p-8">
            {/* Sender Info */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${getSenderRoleIcon(message.sender.role)}`}>
                  <FiUser className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{message.sender.username}</h3>
                    <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full shadow-sm ${getSenderRoleColor(message.sender.role)}`}>
                      <FiUser className="w-4 h-4 mr-1" />
                      {message.sender.role}
                    </span>
                    <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full shadow-sm ${getMessageTypeColor(message.message_type)}`}>
                      <FiTag className="w-4 h-4 mr-1" />
                      {message.message_type}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">Message from {message.sender.role}</p>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
                  <FiFileText className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Message Content</h3>
              </div>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 text-lg leading-relaxed font-medium">
                  {message.content}
                </div>
              </div>
            </div>

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 mb-6">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3">
                    <FiPaperclip className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Attachments ({message.attachments.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {message.attachments.map((attachment) => (
                    <div key={attachment.id} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center">
                            <FiPaperclip className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                              {attachment.file_name}
                            </h4>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <span className="inline-flex px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300 rounded-full font-bold">
                                {attachment.file_type?.toUpperCase() || 'FILE'}
                              </span>
                              <span className="font-medium">
                                {formatFileSize(attachment.file_size)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <a
                          href={attachment.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 text-xs font-bold text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 rounded-full hover:from-blue-200 hover:to-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <FiDownload className="w-3 h-3 mr-1" />
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 font-medium">
              Message ID: {message.id}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-6 py-3 text-sm font-bold text-red-700 bg-gradient-to-r from-red-100 to-red-200 border border-red-300 rounded-2xl hover:from-red-200 hover:to-red-300 transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
              >
                <FiTrash2 className="w-4 h-4 mr-2" />
                Delete Message
              </button>
              <button
                onClick={onClose}
                className="inline-flex items-center px-6 py-3 text-sm font-bold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
              >
                <FiX className="w-4 h-4 mr-2" />
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