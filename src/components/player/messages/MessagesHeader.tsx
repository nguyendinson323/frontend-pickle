import React from 'react'
import { useDispatch } from 'react-redux'
import { openNewConversationModal } from '../../../store/slices/playerMessagesSlice'
import { AppDispatch } from '../../../store'
import {
  FiMessageCircle,
  FiPlus,
  FiBell,
  FiSettings
} from 'react-icons/fi'

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
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 border-b-4 border-purple-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
              <FiMessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{title}</h1>
              <p className="text-indigo-200 font-medium">{description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <FiBell className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  {unreadCount}
                </div>
              </div>
            )}
            <div className="flex items-center">
              <FiSettings className="w-5 h-5 text-indigo-200 mr-2" />
              <span className="text-sm text-indigo-200 font-medium">Chat Dashboard</span>
            </div>
            <button
              onClick={() => dispatch(openNewConversationModal(null))}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
            >
              <FiPlus className="w-5 h-5 mr-2" />
              New Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagesHeader