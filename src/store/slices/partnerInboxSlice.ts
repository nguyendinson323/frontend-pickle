import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface PartnerMessage {
  id: number
  sender_id: number
  subject: string
  content: string
  message_type: string
  sent_at: string
  has_attachments: boolean
  sender: {
    id: number
    username: string
    email: string
    role: string
  }
  recipient: {
    message_id: number
    recipient_id: number
    is_read: boolean
    read_at: string | null
  }
  attachments: {
    id: number
    file_name: string
    file_url: string
    file_type: string
    file_size: number
  }[]
}

interface PartnerInboxStats {
  total_messages: number
  unread_messages: number
  messages_by_type: {
    [key: string]: number
  }
  messages_by_sender: {
    [key: string]: number
  }
  recent_activity: number
}

interface PartnerInboxState {
  messages: PartnerMessage[]
  stats: PartnerInboxStats | null
  selectedMessage: PartnerMessage | null
  loading: boolean
  error: string | null
  filters: {
    message_type: string
    sender_role: string
    is_read: string
    search: string
  }
}

const initialState: PartnerInboxState = {
  messages: [],
  stats: null,
  selectedMessage: null,
  loading: false,
  error: null,
  filters: {
    message_type: '',
    sender_role: '',
    is_read: '',
    search: ''
  }
}

const partnerInboxSlice = createSlice({
  name: 'partnerInbox',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setInboxData: (state, action: PayloadAction<{
      messages: PartnerMessage[]
      stats: PartnerInboxStats
    }>) => {
      state.messages = action.payload.messages
      state.stats = action.payload.stats
    },
    setSelectedMessage: (state, action: PayloadAction<PartnerMessage | null>) => {
      state.selectedMessage = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<PartnerInboxState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    markMessageAsRead: (state, action: PayloadAction<number>) => {
      const message = state.messages.find(msg => msg.id === action.payload)
      if (message && message.recipient) {
        message.recipient.is_read = true
        message.recipient.read_at = new Date().toISOString()
      }
      if (state.stats) {
        state.stats.unread_messages = Math.max(0, state.stats.unread_messages - 1)
      }
    },
    deleteMessage: (state, action: PayloadAction<number>) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload)
      if (state.stats) {
        state.stats.total_messages = Math.max(0, state.stats.total_messages - 1)
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setInboxData,
  setSelectedMessage,
  setFilters,
  markMessageAsRead,
  deleteMessage
} = partnerInboxSlice.actions

// API Functions
export const fetchPartnerInboxData = (filters?: Partial<PartnerInboxState['filters']>) => async (dispatch: any, getState: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const state = getState()
    const currentFilters = { ...state.partnerInbox.filters, ...filters }
    
    if (filters) {
      dispatch(setFilters(filters))
    }
    
    const response = await axios.get('/api/partner/inbox', {
      params: currentFilters
    })
    
    dispatch(setInboxData(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch inbox data'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const markPartnerMessageAsRead = (messageId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))
    
    await axios.put(`/api/partner/messages/${messageId}/read`)
    dispatch(markMessageAsRead(messageId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to mark message as read'))
    throw error
  }
}

export const deletePartnerMessage = (messageId: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    await axios.delete(`/api/partner/messages/${messageId}`)
    dispatch(deleteMessage(messageId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete message'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export default partnerInboxSlice.reducer

// Export types
export type {
  PartnerMessage,
  PartnerInboxStats
}