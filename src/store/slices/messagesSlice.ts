import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  MessagesState,
  Message,
  MessageRecipient,
  PaginatedResponse
} from '../../types'

const initialState: MessagesState = {
  inbox: {
    messages: [],
    totalCount: 0
  },
  sent: {
    messages: [],
    totalCount: 0
  },
  currentMessage: null,
  unreadCount: 0,
  isLoading: false
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setInboxMessages: (state, action: PayloadAction<PaginatedResponse<MessageRecipient>>) => {
      state.inbox.messages = action.payload.rows
      state.inbox.totalCount = action.payload.count
    },
    setSentMessages: (state, action: PayloadAction<PaginatedResponse<Message>>) => {
      state.sent.messages = action.payload.rows
      state.sent.totalCount = action.payload.count
    },
    addSentMessage: (state, action: PayloadAction<Message>) => {
      state.sent.messages.unshift(action.payload)
      state.sent.totalCount += 1
    },
    setCurrentMessage: (state, action: PayloadAction<{
      message: Message
      isSender: boolean
    }>) => {
      state.currentMessage = action.payload
    },
    clearCurrentMessage: (state) => {
      state.currentMessage = null
    },
    markMessageAsRead: (state, action: PayloadAction<number>) => {
      const messageRecipient = state.inbox.messages.find(m => m.message_id === action.payload)
      if (messageRecipient) {
        messageRecipient.is_read = true
        messageRecipient.read_at = new Date().toISOString()
        if (state.unreadCount > 0) {
          state.unreadCount -= 1
        }
      }
    },
    markAllMessagesAsRead: (state) => {
      state.inbox.messages.forEach(messageRecipient => {
        if (!messageRecipient.is_read) {
          messageRecipient.is_read = true
          messageRecipient.read_at = new Date().toISOString()
        }
      })
      state.unreadCount = 0
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload
    },
    updateUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount += action.payload
    },
    removeInboxMessage: (state, action: PayloadAction<number>) => {
      const messageIndex = state.inbox.messages.findIndex(m => m.message_id === action.payload)
      if (messageIndex !== -1) {
        const message = state.inbox.messages[messageIndex]
        if (!message.is_read && state.unreadCount > 0) {
          state.unreadCount -= 1
        }
        state.inbox.messages.splice(messageIndex, 1)
        state.inbox.totalCount -= 1
      }
    },
    removeSentMessage: (state, action: PayloadAction<number>) => {
      const messageIndex = state.sent.messages.findIndex(m => m.id === action.payload)
      if (messageIndex !== -1) {
        state.sent.messages.splice(messageIndex, 1)
        state.sent.totalCount -= 1
      }
    },
    clearInboxMessages: (state) => {
      state.inbox.messages = []
      state.inbox.totalCount = 0
    },
    clearSentMessages: (state) => {
      state.sent.messages = []
      state.sent.totalCount = 0
    }
  }
})

export const {
  setLoading,
  setInboxMessages,
  setSentMessages,
  addSentMessage,
  setCurrentMessage,
  clearCurrentMessage,
  markMessageAsRead,
  markAllMessagesAsRead,
  setUnreadCount,
  updateUnreadCount,
  removeInboxMessage,
  removeSentMessage,
  clearInboxMessages,
  clearSentMessages
} = messagesSlice.actions

export default messagesSlice.reducer