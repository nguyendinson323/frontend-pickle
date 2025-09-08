import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import axios from 'axios'

const BASE_URL = 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

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
  setContacts,
  setSelectedContact,
  setMessageInput,
  setSearchQuery,
  setSearchResults,
  setIsSearching,
  setTyping,
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
    const response = await apiClient.get<Conversation[]>('/api/player-messages/conversations')
    dispatch(setConversations(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load conversations'))
    dispatch(stopLoading())
    throw error
  }
}

// Get messages for a specific conversation
export const fetchMessages = (conversationId: number, page: number = 1) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading messages...'))
  
  try {
    const response = await apiClient.get<{
      messages: Message[]
      total_count: number
      has_more: boolean
    }>(`/api/player-messages/conversations/${conversationId}/messages?page=${page}&limit=50`)
    
    dispatch(setMessages({
      messages: response.data.messages,
      append: page > 1,
      hasMore: response.data.has_more
    }))
    
    // Mark conversation as read
    dispatch(markConversationAsRead(conversationId))
    
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load messages'))
    dispatch(stopLoading())
    throw error
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
    const response = await apiClient.post<Message>('/api/player-messages/send', messageData)
    dispatch(addMessage(response.data))
    dispatch(setMessageInput(''))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to send message'))
    dispatch(stopLoading())
    throw error
  }
}

// Start a new conversation
export const startConversation = (receiverId: number, initialMessage?: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Starting conversation...'))
  
  try {
    const response = await apiClient.post<Conversation>('/api/player-messages/conversations', {
      receiver_id: receiverId,
      initial_message: initialMessage
    })
    
    dispatch(addConversation(response.data))
    dispatch(setActiveConversation(response.data))
    dispatch(closeNewConversationModal())
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to start conversation'))
    dispatch(stopLoading())
    throw error
  }
}

// Search for players to message
export const searchPlayers = (query: string) => async (dispatch: AppDispatch) => {
  dispatch(setIsSearching(true))
  
  try {
    const response = await apiClient.get<PlayerContact[]>(`/api/player-messages/search?q=${encodeURIComponent(query)}`)
    dispatch(setSearchResults(response.data))
    dispatch(setIsSearching(false))
  } catch (error) {
    dispatch(setError('Failed to search players'))
    dispatch(setIsSearching(false))
    throw error
  }
}

// Get player contacts (recent contacts, mutual connections)
export const fetchContacts = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading contacts...'))
  
  try {
    const response = await apiClient.get<PlayerContact[]>('/api/player-messages/contacts')
    dispatch(setContacts(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load contacts'))
    dispatch(stopLoading())
    throw error
  }
}

// Mark messages as read
export const markMessagesAsRead = (conversationId: number) => async (dispatch: AppDispatch) => {
  try {
    await apiClient.put(`/api/player-messages/conversations/${conversationId}/mark-read`)
    dispatch(markConversationAsRead(conversationId))
  } catch (error) {
    console.error('Failed to mark messages as read:', error)
  }
}

// Delete a message (soft delete)
export const deleteMessage = (messageId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Deleting message...'))
  
  try {
    await apiClient.delete(`/api/player-messages/messages/${messageId}`)
    // Remove message from state or mark as deleted
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to delete message'))
    dispatch(stopLoading())
    throw error
  }
}

// Update online status
export const updateOnlineStatus = (isOnline: boolean) => async (dispatch: AppDispatch) => {
  try {
    await apiClient.put('/api/player-messages/status', { is_online: isOnline })
    dispatch(updateLastActiveTime())
  } catch (error) {
    console.error('Failed to update online status:', error)
  }
}

export default playerMessagesSlice.reducer