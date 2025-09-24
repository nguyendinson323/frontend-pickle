import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import socketService from '../../services/socketService'
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  startConversation,
  searchPlayers,
  fetchContacts,
  markMessagesAsReadAction,
  updateOnlineStatus,
  setActiveConversation,
  setMessageInput,
  setSearchQuery,
  setSearchResults,
  closeNewConversationModal,
  closeImagePreviewModal
} from '../../store/slices/playerMessagesSlice'
import {
  MessagesHeader,
  ConversationsList,
  ChatWindow,
  MessageInput,
  NewConversationModal,
  ImagePreviewModal
} from '../../components/player/messages'
import { Conversation, Message } from '../../store/slices/playerMessagesSlice'
import {
  FiMessageCircle,
  FiAlertCircle,
  FiRefreshCw
} from 'react-icons/fi'

// Constants
const SEARCH_DEBOUNCE_DELAY = 300
const STATUS_UPDATE_INTERVAL = 30000
const MIN_SEARCH_LENGTH = 2

// Custom hooks
const useSocketConnection = (dispatch: AppDispatch) => {
  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (token && !socketService.isSocketConnected()) {
      socketService.connect(token)
    }
    
    return () => {
      socketService.disconnect()
    }
  }, [dispatch])
}

const useOnlineStatus = (dispatch: AppDispatch) => {
  useEffect(() => {
    dispatch(updateOnlineStatus(true))

    const statusInterval = setInterval(() => {
      dispatch(updateOnlineStatus(true))
    }, STATUS_UPDATE_INTERVAL)

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
}

const useActiveConversation = (
  activeConversation: Conversation | null,
  dispatch: AppDispatch
) => {
  useEffect(() => {
    if (activeConversation) {
      socketService.joinChat(activeConversation.id)
      dispatch(fetchMessages(activeConversation.id))
      dispatch(markMessagesAsReadAction(activeConversation.id))
      
      return () => {
        socketService.leaveChat(activeConversation.id)
      }
    }
  }, [activeConversation, dispatch])
}

const useSearchDebounce = (searchQuery: string, dispatch: AppDispatch) => {
  useEffect(() => {
    if (searchQuery.length >= MIN_SEARCH_LENGTH) {
      const searchTimeout = setTimeout(() => {
        dispatch(searchPlayers(searchQuery))
      }, SEARCH_DEBOUNCE_DELAY)
      
      return () => clearTimeout(searchTimeout)
    } else {
      dispatch(setSearchResults([]))
    }
  }, [searchQuery, dispatch])
}

const useAutoScroll = (messages: Message[], messagesEndRef: React.RefObject<HTMLDivElement>) => {
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesEndRef])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  return scrollToBottom
}

// Utility functions
const formatTime = (dateString: string): string => {
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

const getOnlineStatus = (participant: any): 'online' | 'recently' | 'away' | 'offline' => {
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

const getStatusColor = (status: string): string => {
  const statusColors = {
    online: 'bg-green-500',
    recently: 'bg-yellow-500',
    away: 'bg-orange-500',
    offline: 'bg-gray-400'
  }
  
  return statusColors[status as keyof typeof statusColors] || statusColors.offline
}

// Main component
const PlayerMessages: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  
  const {
    conversations,
    activeConversation,
    messages,
    contacts,
    isLoading,
    error,
    messageInput,
    searchQuery,
    conversationsFilter,
    searchResults,
    isSearching,
    newConversationModal,
    imagePreviewModal,
    unreadCount
  } = useSelector((state: RootState) => state.playerMessages)

  // Custom hooks for side effects
  useSocketConnection(dispatch)
  useOnlineStatus(dispatch)
  useActiveConversation(activeConversation, dispatch)
  useSearchDebounce(searchQuery, dispatch)
  useAutoScroll(messages, messagesEndRef)

  // Initialize data on mount
  useEffect(() => {
    dispatch(fetchConversations())
    dispatch(fetchContacts())
  }, [dispatch])

  // Memoized handlers
  const handleConversationSelect = useCallback((conversation: Conversation) => {
    dispatch(setActiveConversation(conversation))
  }, [dispatch])

  const handleSendMessage = useCallback(() => {
    if (messageInput.trim() && activeConversation) {
      dispatch(sendMessage({
        conversation_id: activeConversation.id,
        receiver_id: null,
        content: messageInput.trim(),
        message_type: 'text'
      }))
    }
  }, [messageInput, activeConversation, dispatch])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  const handleStartConversation = useCallback((playerId: number) => {
    dispatch(startConversation(playerId))
    dispatch(closeNewConversationModal())
  }, [dispatch])

  const handleSearchQueryChange = useCallback((query: string) => {
    dispatch(setSearchQuery(query))
  }, [dispatch])

  const handleMessageInputChange = useCallback((input: string) => {
    dispatch(setMessageInput(input))
  }, [dispatch])


  const handleCloseNewConversation = useCallback(() => {
    dispatch(closeNewConversationModal())
  }, [dispatch])

  const handleCloseImagePreview = useCallback(() => {
    dispatch(closeImagePreviewModal())
  }, [dispatch])

  // Memoized values
  const conversationListProps = useMemo(() => ({
    conversations,
    activeConversation,
    conversationsFilter,
    onConversationSelect: handleConversationSelect,
    formatTime,
    getOnlineStatus,
    getStatusColor
  }), [conversations, activeConversation, conversationsFilter, handleConversationSelect])

  const chatWindowProps = useMemo(() => ({
    activeConversation,
    messages,
    formatTime,
    getOnlineStatus,
    getStatusColor,
    messagesEndRef
  }), [activeConversation, messages])

  const messageInputProps = useMemo(() => ({
    messageInput,
    isLoading,
    showEmojiPicker,
    onSendMessage: handleSendMessage,
    onKeyPress: handleKeyPress,
    onInputChange: handleMessageInputChange,
    onEmojiToggle: () => setShowEmojiPicker(!showEmojiPicker),
    onEmojiSelect: (emoji: string) => {
      handleMessageInputChange(messageInput + emoji)
      setShowEmojiPicker(false)
    }
  }), [
    messageInput,
    isLoading,
    showEmojiPicker,
    handleSendMessage,
    handleKeyPress,
    handleMessageInputChange
  ])

  const newConversationModalProps = useMemo(() => ({
    isOpen: newConversationModal.isOpen,
    searchQuery,
    searchResults,
    contacts,
    isSearching,
    onStartConversation: handleStartConversation,
    onClose: handleCloseNewConversation,
    onSearchQueryChange: handleSearchQueryChange
  }), [
    newConversationModal.isOpen,
    searchQuery,
    searchResults,
    contacts,
    isSearching,
    handleStartConversation,
    handleCloseNewConversation,
    handleSearchQueryChange
  ])

  const imagePreviewModalProps = useMemo(() => ({
    isOpen: imagePreviewModal.isOpen,
    imageUrl: imagePreviewModal.imageUrl,
    onClose: handleCloseImagePreview
  }), [imagePreviewModal.isOpen, imagePreviewModal.imageUrl, handleCloseImagePreview])

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiAlertCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Messages</h3>
          <div className="text-red-700 text-lg font-medium mb-6 bg-red-100 border border-red-200 rounded-2xl p-4 max-w-md mx-auto">
            {error}
          </div>
          <button
            onClick={() => {
              dispatch(fetchConversations())
              dispatch(fetchContacts())
            }}
            className="inline-flex items-center bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
          >
            <FiRefreshCw className="w-5 h-5 mr-2" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <MessagesHeader unreadCount={unreadCount} />

      {/* Main Chat Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200 h-96 md:h-[600px] flex overflow-hidden">
          {/* Conversations List */}
          <div className="w-full md:w-1/3 border-r-2 border-gray-200 flex flex-col">
            <ConversationsList {...conversationListProps} />
          </div>

          {/* Chat Area */}
          <div className="hidden md:flex md:flex-1 flex-col">
            {activeConversation ? (
              <>
                <ChatWindow {...chatWindowProps} />
                <MessageInput {...messageInputProps} />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <FiMessageCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600 font-medium">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Chat View */}
      {activeConversation && (
        <div className="md:hidden fixed inset-0 bg-gradient-to-br from-white to-gray-50 z-50 flex flex-col">
          <ChatWindow {...chatWindowProps} />
          <MessageInput {...messageInputProps} />
        </div>
      )}

      {/* Modals */}
      <NewConversationModal {...newConversationModalProps} />
      <ImagePreviewModal {...imagePreviewModalProps} />
    </div>
  )
}

export default PlayerMessages