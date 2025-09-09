import React, { useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { openImagePreviewModal } from '../../../store/slices/playerMessagesSlice'
import { AppDispatch } from '../../../store'

interface ChatWindowProps {
  activeConversation: any
  messages: any[]
  formatTime: (dateString: string) => string
  getOnlineStatus: (participant: any) => string
  getStatusColor: (status: string) => string
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  activeConversation,
  messages,
  formatTime,
  getOnlineStatus,
  getStatusColor
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
          <p className="text-gray-500 mb-4">Choose from your existing conversations or start a new one</p>
          <button
            onClick={() => dispatch(openNewConversationModal(null))}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Start New Chat
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {activeConversation.participant.full_name.charAt(0)}
              </span>
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${
              getStatusColor(getOnlineStatus(activeConversation.participant))
            }`} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {activeConversation.participant.full_name}
            </h3>
            <p className="text-xs text-gray-500">
              {getOnlineStatus(activeConversation.participant) === 'online' 
                ? 'Online' 
                : activeConversation.participant.last_seen 
                ? `Last seen ${formatTime(activeConversation.participant.last_seen)}`
                : 'Offline'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">💬</div>
            <p className="text-sm text-gray-500">No messages yet</p>
            <p className="text-xs text-gray-400 mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.slice().reverse().map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === activeConversation.participant.id ? 'justify-start' : 'justify-end'
              }`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender_id === activeConversation.participant.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-green-600 text-white'
              }`}>
                {message.message_type === 'image' ? (
                  <div>
                    <img
                      src={message.attachment_url || ''}
                      alt="Shared image"
                      className="max-w-full h-auto rounded cursor-pointer"
                      onClick={() => dispatch(openImagePreviewModal(message.attachment_url || ''))}
                    />
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-xs ${
                    message.sender_id === activeConversation.participant.id
                      ? 'text-gray-500'
                      : 'text-green-100'
                  }`}>
                    {formatTime(message.sent_at)}
                  </p>
                  
                  {message.sender_id !== activeConversation.participant.id && (
                    <span className={`text-xs ml-2 ${
                      message.is_read ? 'text-green-200' : 'text-green-100'
                    }`}>
                      {message.is_read ? '✓✓' : '✓'}
                    </span>
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