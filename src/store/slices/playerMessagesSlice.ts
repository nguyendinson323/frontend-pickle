import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'

export interface Message {
  id: number
  conversation_id: number
  sender_id: number
  receiver_id: number
  content: string
  message_type: 'text' | 'image' | 'file' | 'match_request' | 'system'
  attachment_url: string | null
  is_read: boolean
  sent_at: string
  edited_at: string | null
  sender: {
    id: number
    full_name: string
    profile_image: string | null
    skill_level: string | null
    is_online: boolean
    last_seen: string | null
  }
}

export interface Conversation {
  id: number
  participant1_id: number
  participant2_id: number
  last_message_id: number | null
  created_at: string
  updated_at: string
  participant: {
    id: number
    full_name: string
    profile_image: string | null
    skill_level: string | null
    is_online: boolean
    last_seen: string | null
  }
  last_message: Message | null
  unread_count: number
}

export interface MessageThread {
  conversation: Conversation
  messages: Message[]
  total_count: number
  has_more: boolean
}

export interface PlayerContact {
  id: number
  full_name: string
  email: string
  profile_image: string | null
  skill_level: string | null
  is_online: boolean
  last_seen: string | null
  club: {
    id: number
    name: string
  } | null
  mutual_connections: number
  last_conversation_id: number | null
}

export interface PlayerMessagesState {
  conversations: Conversation[]
  activeConversation: Conversation | null
  messages: Message[]
  contacts: PlayerContact[]
  selectedContact: PlayerContact | null
  isLoading: boolean
  error: string | null
  messageInput: string
  searchQuery: string
  searchResults: PlayerContact[]
  isSearching: boolean
  messagePagination: {
    page: number
    limit: number
    hasMore: boolean
  }
  typing: {
    conversationId: number | null
    isTyping: boolean
    typingUsers: string[]
  }
  newConversationModal: {
    isOpen: boolean
    selectedUserId: number | null
  }
  imagePreviewModal: {
    isOpen: boolean
    imageUrl: string | null
  }
  unreadCount: number
  lastActiveTime: string | null
}

const initialState: PlayerMessagesState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  contacts: [],
  selectedContact: null,
  isLoading: false,
  error: null,
  messageInput: '',
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  messagePagination: {
    page: 1,
    limit: 50,
    hasMore: true
  },
  typing: {
    conversationId: null,
    isTyping: false,
    typingUsers: []
  },
  newConversationModal: {
    isOpen: false,
    selectedUserId: null
  },
  imagePreviewModal: {
    isOpen: false,
    imageUrl: null
  },
  unreadCount: 0,
  lastActiveTime: null
}

const playerMessagesSlice = createSlice({
  name: 'playerMessages',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload
      // Calculate total unread count
      state.unreadCount = action.payload.reduce((sum, conv) => sum + conv.unread_count, 0)
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.unshift(action.payload)
    },
    updateConversation: (state, action: PayloadAction<Conversation>) => {
      const index = state.conversations.findIndex(conv => conv.id === action.payload.id)
      if (index !== -1) {
        state.conversations[index] = action.payload
      }
      
      // Recalculate unread count
      state.unreadCount = state.conversations.reduce((sum, conv) => sum + conv.unread_count, 0)
    },
    setActiveConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.activeConversation = action.payload
      if (action.payload) {
        // Mark conversation as read when opened
        const conv = state.conversations.find(c => c.id === action.payload!.id)
        if (conv) {
          conv.unread_count = 0
        }
        state.unreadCount = state.conversations.reduce((sum, conv) => sum + conv.unread_count, 0)
      }
    },
    setMessages: (state, action: PayloadAction<{
      messages: Message[]
      append: boolean
      hasMore: boolean
    }>) => {
      if (action.payload.append) {
        state.messages = [...state.messages, ...action.payload.messages]
      } else {
        state.messages = action.payload.messages
      }
      state.messagePagination.hasMore = action.payload.hasMore
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.unshift(action.payload)
      
      // Update conversation last message
      if (state.activeConversation && action.payload.conversation_id === state.activeConversation.id) {
        state.activeConversation.last_message = action.payload
      }
      
      // Update conversation in list
      const conversation = state.conversations.find(c => c.id === action.payload.conversation_id)
      if (conversation) {
        conversation.last_message = action.payload
        conversation.updated_at = action.payload.sent_at
        
        // Move conversation to top
        const index = state.conversations.indexOf(conversation)
        if (index > 0) {
          state.conversations.splice(index, 1)
          state.conversations.unshift(conversation)
        }
        
        // Increment unread count if not current conversation
        if (!state.activeConversation || action.payload.conversation_id !== state.activeConversation.id) {
          conversation.unread_count += 1
          state.unreadCount += 1
        }
      }
    },
    markMessageAsRead: (state, action: PayloadAction<number>) => {
      const message = state.messages.find(m => m.id === action.payload)
      if (message) {
        message.is_read = true
      }
    },
    markConversationAsRead: (state, action: PayloadAction<number>) => {
      const conversation = state.conversations.find(c => c.id === action.payload)
      if (conversation) {
        const oldUnreadCount = conversation.unread_count
        conversation.unread_count = 0
        state.unreadCount = Math.max(0, state.unreadCount - oldUnreadCount)
      }
    },
    setContacts: (state, action: PayloadAction<PlayerContact[]>) => {
      state.contacts = action.payload
    },
    setSelectedContact: (state, action: PayloadAction<PlayerContact | null>) => {
      state.selectedContact = action.payload
    },
    setMessageInput: (state, action: PayloadAction<string>) => {
      state.messageInput = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setSearchResults: (state, action: PayloadAction<PlayerContact[]>) => {
      state.searchResults = action.payload
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload
    },
    setTyping: (state, action: PayloadAction<{
      conversationId: number
      isTyping: boolean
      userName?: string
    }>) => {
      state.typing.conversationId = action.payload.conversationId
      state.typing.isTyping = action.payload.isTyping
      
      if (action.payload.userName) {
        if (action.payload.isTyping) {
          if (!state.typing.typingUsers.includes(action.payload.userName)) {
            state.typing.typingUsers.push(action.payload.userName)
          }
        } else {
          state.typing.typingUsers = state.typing.typingUsers.filter(
            user => user !== action.payload.userName
          )
        }
      }
    },
    updateTypingStatus: (state, action: PayloadAction<{
      chatRoomId: number
      userId: number
      isTyping: boolean
      username?: string
    }>) => {
      if (state.activeConversation?.id === action.payload.chatRoomId) {
        state.typing.conversationId = action.payload.chatRoomId
        state.typing.isTyping = action.payload.isTyping
        
        if (action.payload.username) {
          if (action.payload.isTyping) {
            if (!state.typing.typingUsers.includes(action.payload.username)) {
              state.typing.typingUsers.push(action.payload.username)
            }
          } else {
            state.typing.typingUsers = state.typing.typingUsers.filter(
              user => user !== action.payload.username
            )
          }
        }
      }
    },
    updateConversationLastMessage: (state, action: PayloadAction<{
      chatRoomId: number
      lastMessage: {
        content: string
        sentAt: string
        senderName: string
      }
    }>) => {
      const conversation = state.conversations.find(c => c.id === action.payload.chatRoomId)
      if (conversation) {
        conversation.last_message = {
          id: Date.now(),
          conversation_id: action.payload.chatRoomId,
          sender_id: 0,
          receiver_id: 0,
          content: action.payload.lastMessage.content,
          message_type: 'text',
          attachment_url: null,
          is_read: false,
          sent_at: action.payload.lastMessage.sentAt,
          edited_at: null,
          sender: {
            id: 0,
            full_name: action.payload.lastMessage.senderName,
            profile_image: null,
            skill_level: null,
            is_online: true,
            last_seen: null
          }
        }
        conversation.updated_at = action.payload.lastMessage.sentAt
        
        const index = state.conversations.indexOf(conversation)
        if (index > 0) {
          state.conversations.splice(index, 1)
          state.conversations.unshift(conversation)
        }
      }
    },
    markMessagesAsRead: (state, action: PayloadAction<{
      chatRoomId: number
      userId: number
      messageId: number
    }>) => {
      if (state.activeConversation?.id === action.payload.chatRoomId) {
        state.messages.forEach(message => {
          if (message.id <= action.payload.messageId && message.sender_id !== action.payload.userId) {
            message.is_read = true
          }
        })
      }
    },
    openNewConversationModal: (state, action: PayloadAction<number | null>) => {
      state.newConversationModal = {
        isOpen: true,
        selectedUserId: action.payload
      }
    },
    closeNewConversationModal: (state) => {
      state.newConversationModal = {
        isOpen: false,
        selectedUserId: null
      }
    },
    openImagePreviewModal: (state, action: PayloadAction<string>) => {
      state.imagePreviewModal = {
        isOpen: true,
        imageUrl: action.payload
      }
    },
    closeImagePreviewModal: (state) => {
      state.imagePreviewModal = {
        isOpen: false,
        imageUrl: null
      }
    },
    updateLastActiveTime: (state) => {
      state.lastActiveTime = new Date().toISOString()
    },
    clearPlayerMessages: (state) => {
      state.conversations = []
      state.activeConversation = null
      state.messages = []
      state.contacts = []
      state.selectedContact = null
      state.error = null
      state.messageInput = ''
      state.searchQuery = ''
      state.searchResults = []
      state.unreadCount = 0
      state.newConversationModal = {
        isOpen: false,
        selectedUserId: null
      }
      state.imagePreviewModal = {
        isOpen: false,
        imageUrl: null
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setConversations,
  addConversation,
  updateConversation,
  setActiveConversation,
  setMessages,
  addMessage,
  markMessageAsRead,
  markConversationAsRead,
  markMessagesAsRead,
  setContacts,
  setSelectedContact,
  setMessageInput,
  setSearchQuery,
  setSearchResults,
  setIsSearching,
  setTyping,
  updateTypingStatus,
  updateConversationLastMessage,
  openNewConversationModal,
  closeNewConversationModal,
  openImagePreviewModal,
  closeImagePreviewModal,
  updateLastActiveTime,
  clearPlayerMessages
} = playerMessagesSlice.actions

// Get all conversations for the current user
export const fetchConversations = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading conversations...'))
  
  try {
    dispatch(setError(null))
    const response = await api.get('/api/player-messages/conversations')
    dispatch(setConversations(response.data as Conversation[]))
  } catch (error) {
    dispatch(setError('Failed to load conversations'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

// Get messages for a specific conversation
export const fetchMessages = (conversationId: number, page: number = 1) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading messages...'))
  
  try {
    dispatch(setError(null))
    const response = await api.get(`/api/player-messages/conversations/${conversationId}/messages`, {
      params: { page, limit: 50 }
    })
    
    const responseData = response.data as { messages: Message[], has_more: boolean }
    dispatch(setMessages({
      messages: responseData.messages,
      append: page > 1,
      hasMore: responseData.has_more
    }))
    
    dispatch(markConversationAsRead(conversationId))
  } catch (error) {
    dispatch(setError('Failed to load messages'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

// Send a new message
export const sendMessage = (messageData: {
  conversation_id: number | null
  receiver_id: number | null
  content: string
  message_type: 'text' | 'image' | 'file'
  attachment_url?: string
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Sending message...'))
  
  try {
    dispatch(setError(null))
    const backendData = {
      chat_room_id: messageData.conversation_id,
      receiver_id: messageData.receiver_id,
      content: messageData.content,
      message_type: messageData.message_type,
      attachment_url: messageData.attachment_url
    }
    
    const response = await api.post('/api/player-messages/send', backendData)
    dispatch(addMessage(response.data as Message))
    dispatch(setMessageInput(''))
    return response.data
  } catch (error) {
    dispatch(setError('Failed to send message'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

// Start a new conversation
export const startConversation = (receiverId: number, initialMessage?: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Starting conversation...'))
  
  try {
    dispatch(setError(null))
    const response = await api.post('/api/player-messages/conversations', {
      receiver_id: receiverId,
      initial_message: initialMessage
    })
    
    const conversationData = response.data as Conversation
    dispatch(addConversation(conversationData))
    dispatch(setActiveConversation(conversationData))
    dispatch(closeNewConversationModal())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to start conversation'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

// Search for players to message
export const searchPlayers = (query: string) => async (dispatch: AppDispatch) => {
  dispatch(setIsSearching(true))
  
  try {
    dispatch(setError(null))
    const response = await api.get('/api/player-messages/search', {
      params: { q: query }
    })
    dispatch(setSearchResults(response.data as PlayerContact[]))
  } catch (error) {
    dispatch(setError('Failed to search players'))
    throw error
  } finally {
    dispatch(setIsSearching(false))
  }
}

// Get player contacts (recent contacts, mutual connections)
export const fetchContacts = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading contacts...'))
  
  try {
    dispatch(setError(null))
    const response = await api.get('/api/player-messages/contacts')
    dispatch(setContacts(response.data as PlayerContact[]))
  } catch (error) {
    dispatch(setError('Failed to load contacts'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

// Mark messages as read
export const markMessagesAsReadAction = (conversationId: number) => async (dispatch: AppDispatch) => {
  try {
    await api.post(`/api/player-messages/conversations/${conversationId}/read`)
    dispatch(markConversationAsRead(conversationId))
  } catch (error) {
    console.error('Failed to mark messages as read:', error)
  }
}

// Delete a message (soft delete)
export const deleteMessage = (messageId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Deleting message...'))
  
  try {
    dispatch(setError(null))
    await api.delete(`/api/player-messages/messages/${messageId}`)
  } catch (error) {
    dispatch(setError('Failed to delete message'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

// Update online status
export const updateOnlineStatus = (isOnline: boolean) => async (dispatch: AppDispatch) => {
  try {
    await api.post('/api/player-messages/online-status', { is_online: isOnline })
    dispatch(updateLastActiveTime())
  } catch (error) {
    console.error('Failed to update online status:', error)
  }
}

export default playerMessagesSlice.reducer