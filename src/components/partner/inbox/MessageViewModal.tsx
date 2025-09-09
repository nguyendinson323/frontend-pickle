import React from 'react'
import { PartnerMessage } from '../../../store/slices/partnerInboxSlice'

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

  const handleDelete = () => {
    onDelete(message.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start pb-3 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{message.subject}</h3>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="font-medium mr-1">From:</span>
                <span>{message.sender.username}</span>
                <span className="ml-2 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {message.sender.role}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-1">Type:</span>
                <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {message.message_type}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {formatDate(message.sent_at)}
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

        <div className="mt-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">
              {message.content}
            </div>
          </div>

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Attachments</h4>
              <div className="space-y-2">
                {message.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3  rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{attachment.file_name}</p>
                        <p className="text-xs text-gray-500">
                          {attachment.file_type} • {(attachment.file_size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <a
                      href={attachment.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Message
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover: transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageViewModal