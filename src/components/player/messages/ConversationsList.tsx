import React from 'react'
import { useDispatch } from 'react-redux'
import { openNewConversationModal, setConversationsFilter } from '../../../store/slices/playerMessagesSlice'
import { AppDispatch } from '../../../store'
import {
  FiSearch,
  FiMessageCircle,
  FiPlus,
  FiUser,
  FiImage,
  FiInbox,
  FiClock
} from 'react-icons/fi'

interface ConversationsListProps {
  conversations: any[]
  activeConversation: any
  conversationsFilter: string
  onConversationSelect: (conversation: any) => void
  formatTime: (dateString: string) => string
  getOnlineStatus: (participant: any) => string
  getStatusColor: (status: string) => string
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  activeConversation,
  conversationsFilter,
  onConversationSelect,
  formatTime,
  getOnlineStatus,
  getStatusColor
}) => {
  const dispatch = useDispatch<AppDispatch>()

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => {
    if (!conversation.participant || !conversation.participant.full_name) {
      return false;
    }
    return (
      conversation.participant.full_name.toLowerCase().includes(conversationsFilter.toLowerCase()) ||
      (conversation.last_message?.content?.toLowerCase().includes(conversationsFilter.toLowerCase()) ?? false)
    );
  })

  return (
    <div className="w-1/3 border-r-2 border-gray-200 flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Search Bar */}
      <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={conversationsFilter}
            onChange={(e) => dispatch(setConversationsFilter(e.target.value))}
            placeholder="Search conversations..."
            className="w-full pl-12 pr-4 py-3 border-2 border-blue-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium bg-white"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiInbox className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-sm text-gray-600 font-medium mb-4">Start chatting with other players</p>
            <button
              onClick={() => dispatch(openNewConversationModal(null))}
              className="inline-flex items-center text-sm font-bold text-green-600 hover:text-green-800 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-2xl transition-colors duration-300"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Start a chat
            </button>
          </div>
        ) : (
          filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => onConversationSelect(conversation)}
              className={`p-6 border-b-2 border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 ${
                activeConversation?.id === conversation.id
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-lg'
                  : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {conversation.participant?.full_name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                    getStatusColor(getOnlineStatus(conversation.participant))
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-base font-bold text-gray-900 truncate">
                      {conversation.participant?.full_name || 'Unknown User'}
                    </p>
                    <div className="flex flex-col items-end">
                      {conversation.last_message && (
                        <div className="flex items-center text-xs text-gray-500 font-medium">
                          <FiClock className="w-3 h-3 mr-1" />
                          {formatTime(conversation.last_message.sent_at)}
                        </div>
                      )}
                      {conversation.unread_count > 0 && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full mt-1 shadow-lg">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                  </div>

                  {conversation.last_message && (
                    <div className="flex items-center text-sm text-gray-600 font-medium truncate">
                      {conversation.last_message.message_type === 'image' ? (
                        <>
                          <FiImage className="w-4 h-4 mr-2 text-blue-500" />
                          Image
                        </>
                      ) : (
                        <>
                          <FiMessageCircle className="w-4 h-4 mr-2 text-gray-400" />
                          {conversation.last_message.content}
                        </>
                      )}
                    </div>
                  )}

                  {conversation.participant?.skill_level && (
                    <div className="flex items-center mt-2">
                      <FiUser className="w-3 h-3 mr-1 text-indigo-500" />
                      <p className="text-xs text-indigo-600 font-medium bg-indigo-100 px-2 py-1 rounded-full">
                        {conversation.participant.skill_level}
                      </p>
                    </div>
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