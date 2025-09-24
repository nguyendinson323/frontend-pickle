import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openImagePreviewModal, openNewConversationModal } from '../../../store/slices/playerMessagesSlice'
import { AppDispatch, RootState } from '../../../store'
import {
  FiMessageCircle,
  FiUser,
  FiPlus,
  FiClock,
  FiCheck,
  FiCheckCircle,
  FiImage,
  FiInbox
} from 'react-icons/fi'

interface ChatWindowProps {
  activeConversation: any
  messages: any[]
  formatTime: (dateString: string) => string
  getOnlineStatus: (participant: any) => string
  getStatusColor: (status: string) => string
  messagesEndRef: React.RefObject<HTMLDivElement>
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  activeConversation,
  messages,
  formatTime,
  getOnlineStatus,
  getStatusColor,
  messagesEndRef
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const currentUserId = user?.id

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiMessageCircle className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Select a conversation</h3>
          <p className="text-gray-600 font-medium mb-6">Choose from your existing conversations or start a new one</p>
          <button
            onClick={() => dispatch(openNewConversationModal(null))}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Start New Chat
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-white to-gray-50">
      {/* Chat Header */}
      <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-base">
                {activeConversation.participant?.full_name?.charAt(0) || '?'}
              </span>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-lg ${
              getStatusColor(getOnlineStatus(activeConversation.participant))
            }`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <FiUser className="w-5 h-5 mr-2 text-indigo-600" />
              {activeConversation.participant?.full_name || 'Unknown User'}
            </h3>
            <div className="flex items-center text-sm text-gray-600 font-medium">
              <FiClock className="w-4 h-4 mr-2 text-blue-500" />
              {getOnlineStatus(activeConversation.participant) === 'online'
                ? (
                  <span className="text-green-600 font-bold">Online</span>
                ) : activeConversation.participant?.last_seen
                ? `Last seen ${formatTime(activeConversation.participant.last_seen)}`
                : 'Offline'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiInbox className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No messages yet</h3>
            <p className="text-sm text-gray-600 font-medium">Start the conversation!</p>
          </div>
        ) : (
          messages.slice().reverse().map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                message.sender_id === currentUserId
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  : 'bg-gradient-to-r from-white to-gray-100 text-gray-900 border-2 border-gray-200'
              }`}>
                {message.message_type === 'image' ? (
                  <div>
                    <div className="relative">
                      <FiImage className="absolute top-2 right-2 w-5 h-5 text-blue-500" />
                      <img
                        src={message.attachment_url || ''}
                        alt="Shared image"
                        className="max-w-full h-auto rounded-2xl cursor-pointer hover:opacity-90 transition-opacity duration-300"
                        onClick={() => dispatch(openImagePreviewModal(message.attachment_url || ''))}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-medium leading-relaxed">{message.content}</p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className={`flex items-center text-xs font-medium ${
                    message.sender_id === currentUserId
                      ? 'text-green-100'
                      : 'text-gray-500'
                  }`}>
                    <FiClock className="w-3 h-3 mr-1" />
                    {formatTime(message.sent_at)}
                  </div>

                  {message.sender_id === currentUserId && (
                    <div className={`text-xs ml-3 flex items-center ${
                      message.is_read ? 'text-green-200' : 'text-green-100'
                    }`}>
                      {message.is_read ? (
                        <FiCheckCircle className="w-4 h-4" />
                      ) : (
                        <FiCheck className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default ChatWindow