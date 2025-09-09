import React from 'react'
import { useDispatch } from 'react-redux'
import { openNewConversationModal } from '../../../store/slices/playerMessagesSlice'
import { AppDispatch } from '../../../store'

interface ConversationsListProps {
  conversations: any[]
  activeConversation: any
  onConversationSelect: (conversation: any) => void
  formatTime: (dateString: string) => string
  getOnlineStatus: (participant: any) => string
  getStatusColor: (status: string) => string
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  activeConversation,
  onConversationSelect,
  formatTime,
  getOnlineStatus,
  getStatusColor
}) => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div className="w-1/3 border-r border-gray-200 flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-gray-400 text-4xl mb-2">💬</div>
            <p className="text-sm text-gray-500">No conversations yet</p>
            <button
              onClick={() => dispatch(openNewConversationModal(null))}
              className="mt-2 text-sm text-green-600 hover:text-green-800 font-medium"
            >
              Start a chat
            </button>
          </div>
        ) : (
          conversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => onConversationSelect(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                activeConversation?.id === conversation.id ? 'bg-green-50 border-green-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {conversation.participant.full_name.charAt(0)}
                    </span>
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    getStatusColor(getOnlineStatus(conversation.participant))
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.participant.full_name}
                    </p>
                    <div className="flex flex-col items-end">
                      {conversation.last_message && (
                        <p className="text-xs text-gray-500">
                          {formatTime(conversation.last_message.sent_at)}
                        </p>
                      )}
                      {conversation.unread_count > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full mt-1">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {conversation.last_message && (
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.last_message.message_type === 'image' 
                        ? '📷 Image' 
                        : conversation.last_message.content
                      }
                    </p>
                  )}
                  
                  {conversation.participant.skill_level && (
                    <p className="text-xs text-gray-400">
                      {conversation.participant.skill_level}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ConversationsList