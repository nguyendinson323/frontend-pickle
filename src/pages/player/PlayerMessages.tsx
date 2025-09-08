import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { 
  fetchConversations,
  fetchMessages,
  sendMessage,
  startConversation,
  searchPlayers,
  fetchContacts,
  markMessagesAsRead,
  updateOnlineStatus,
  setActiveConversation,
  setMessageInput,
  setSearchQuery,
  setSearchResults,
  openNewConversationModal,
  closeNewConversationModal,
  openImagePreviewModal,
  closeImagePreviewModal
} from '../../store/slices/playerMessagesSlice'
import { AppDispatch } from '../../store'

const PlayerMessages: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  
  const {
    conversations,
    activeConversation,
    messages,
    contacts,
    selectedContact,
    isLoading,
    error,
    messageInput,
    searchQuery,
    searchResults,
    isSearching,
    newConversationModal,
    imagePreviewModal,
    unreadCount
  } = useSelector((state: RootState) => state.playerMessages)

  useEffect(() => {
    dispatch(fetchConversations())
    dispatch(fetchContacts())
    dispatch(updateOnlineStatus(true))

    // Update online status periodically
    const statusInterval = setInterval(() => {
      dispatch(updateOnlineStatus(true))
    }, 30000) // Every 30 seconds

    // Set offline when page unloads
    const handleUnload = () => {
      dispatch(updateOnlineStatus(false))
    }
    
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      clearInterval(statusInterval)
      window.removeEventListener('beforeunload', handleUnload)
      dispatch(updateOnlineStatus(false))
    }
  }, [dispatch])

  useEffect(() => {
    if (activeConversation) {
      dispatch(fetchMessages(activeConversation.id))
      dispatch(markMessagesAsRead(activeConversation.id))
    }
  }, [activeConversation, dispatch])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const searchTimeout = setTimeout(() => {
        dispatch(searchPlayers(searchQuery))
      }, 300)
      
      return () => clearTimeout(searchTimeout)
    } else {
      dispatch(setSearchResults([]))
    }
  }, [searchQuery, dispatch])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleConversationSelect = (conversation: any) => {
    dispatch(setActiveConversation(conversation))
  }

  const handleSendMessage = () => {
    if (messageInput.trim() && activeConversation) {
      dispatch(sendMessage({
        conversation_id: activeConversation.id,
        receiver_id: null,
        content: messageInput.trim(),
        message_type: 'text'
      }))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleStartConversation = (playerId: number) => {
    dispatch(startConversation(playerId))
    dispatch(closeNewConversationModal())
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const getOnlineStatus = (participant: any) => {
    if (participant.is_online) return 'online'
    if (participant.last_seen) {
      const lastSeen = new Date(participant.last_seen)
      const now = new Date()
      const diffInMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60)
      
      if (diffInMinutes < 5) return 'recently'
      if (diffInMinutes < 60) return 'away'
    }
    return 'offline'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'recently': return 'bg-yellow-500'
      case 'away': return 'bg-orange-500'
      default: return 'bg-gray-400'
    }
  }

  const emojis = ['😊', '😂', '❤️', '👍', '👏', '🔥', '💯', '🎾', '🏆', '😎']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600">Chat with other players</p>
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

      {/* Chat Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 md:h-[600px] flex">
          {/* Conversations Sidebar */}
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
                    onClick={() => handleConversationSelect(conversation)}
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

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
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

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <textarea
                        value={messageInput}
                        onChange={(e) => dispatch(setMessageInput(e.target.value))}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none"
                        rows={1}
                        style={{ minHeight: '38px', maxHeight: '120px' }}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        😊
                      </button>
                      
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || isLoading}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                  
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="mt-2 p-2 bg-white border border-gray-200 rounded-md shadow-sm">
                      <div className="flex flex-wrap gap-2">
                        {emojis.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => {
                              dispatch(setMessageInput(messageInput + emoji))
                              setShowEmojiPicker(false)
                            }}
                            className="text-lg hover:bg-gray-100 p-1 rounded"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
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
            )}
          </div>
        </div>
      </div>

      {/* New Conversation Modal */}
      {newConversationModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Start New Conversation
              </h3>
              
              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  placeholder="Search for players..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="max-h-60 overflow-y-auto">
                {searchQuery.length >= 2 ? (
                  isSearching ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map(player => (
                        <div
                          key={player.id}
                          onClick={() => handleStartConversation(player.id)}
                          className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                        >
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {player.full_name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{player.full_name}</p>
                            <p className="text-xs text-gray-500">{player.skill_level}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-gray-500 text-sm">No players found</p>
                  )
                ) : (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Contacts</h4>
                    <div className="space-y-2">
                      {contacts.slice(0, 5).map(contact => (
                        <div
                          key={contact.id}
                          onClick={() => handleStartConversation(contact.id)}
                          className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                        >
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {contact.full_name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{contact.full_name}</p>
                            <p className="text-xs text-gray-500">{contact.skill_level}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => dispatch(closeNewConversationModal())}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreviewModal.isOpen && imagePreviewModal.imageUrl && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={imagePreviewModal.imageUrl}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => dispatch(closeImagePreviewModal())}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayerMessages