import React from 'react'
import { useDispatch } from 'react-redux'
import { openNewConversationModal } from '../../../store/slices/playerMessagesSlice'
import { AppDispatch } from '../../../store'

interface MessagesHeaderProps {
  unreadCount: number
  title?: string
  description?: string
}

const MessagesHeader: React.FC<MessagesHeaderProps> = ({
  unreadCount,
  title = "Messages",
  description = "Chat with other players"
}) => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                {unreadCount} unread
              </span>
            )}
            <button
              onClick={() => dispatch(openNewConversationModal(null))}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              ➕ New Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagesHeader