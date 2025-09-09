import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import socketService from '../../services/socketService'
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
import {
  MessagesHeader,
  ConversationsList,
  ChatWindow,
  MessageInput,
  NewConversationModal,
  ImagePreviewModal
} from '../../components/player/messages'

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
    const token = localStorage.getItem('token')
    
    // Initialize socket connection
    if (token && !socketService.isSocketConnected()) {
      socketService.connect(token)
    }
    
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
      socketService.disconnect()
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
      // Join the chat room for real-time updates
      socketService.joinChat(activeConversation.id)
      
      dispatch(fetchMessages(activeConversation.id))
      dispatch(markMessagesAsRead(activeConversation.id))
      
      return () => {
        // Leave chat room when switching conversations
        socketService.leaveChat(activeConversation.id)
      }
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
      <MessagesHeader unreadCount={unreadCount} />

      {/* Chat Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 md:h-[600px] flex">
          <ConversationsList
            conversations={conversations}
            activeConversation={activeConversation}
            onConversationSelect={handleConversationSelect}
            formatTime={formatTime}
            getOnlineStatus={getOnlineStatus}
            getStatusColor={getStatusColor}
          />
          
          <div className="flex-1 flex flex-col">
            <ChatWindow
              activeConversation={activeConversation}
              messages={messages}
              formatTime={formatTime}
              getOnlineStatus={getOnlineStatus}
              getStatusColor={getStatusColor}
            />
            
            {activeConversation && (
              <MessageInput
                messageInput={messageInput}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onKeyPress={handleKeyPress}
              />
            )}
          </div>
        </div>
      </div>

      <NewConversationModal
        isOpen={newConversationModal.isOpen}
        searchQuery={searchQuery}
        searchResults={searchResults}
        contacts={contacts}
        isSearching={isSearching}
        onStartConversation={handleStartConversation}
      />

      <ImagePreviewModal
        isOpen={imagePreviewModal.isOpen}
        imageUrl={imagePreviewModal.imageUrl}
      />
    </div>
  )
}

export default PlayerMessages