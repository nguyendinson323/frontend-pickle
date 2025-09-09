import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'

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
  setError,
  setInboxData,
  setSelectedMessage,
  setFilters,
  markMessageAsRead,
  deleteMessage
} = partnerInboxSlice.actions

// API Functions
export const fetchPartnerInboxData = (filters?: Partial<PartnerInboxState['filters']>) => async (dispatch: AppDispatch, getState: any) => {
  dispatch(startLoading('Loading inbox data...'))
  
  try {
    dispatch(setError(null))
    
    const state = getState()
    const currentFilters = { ...state.partnerInbox.filters, ...filters }
    
    if (filters) {
      dispatch(setFilters(filters))
    }
    
    const response = await api.get('/api/partner/inbox', {
      params: currentFilters
    })
    
    dispatch(setInboxData(response.data as { messages: PartnerMessage[]; stats: PartnerInboxStats }))
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch inbox data'))
    dispatch(stopLoading())
    throw error
  }
}

export const markPartnerMessageAsRead = (messageId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Marking message as read...'))
  
  try {
    dispatch(setError(null))
    
    await api.put(`/api/partner/messages/${messageId}/read`)
    dispatch(markMessageAsRead(messageId))
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to mark message as read'))
    dispatch(stopLoading())
    throw error
  }
}

export const deletePartnerMessage = (messageId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Deleting message...'))
  
  try {
    dispatch(setError(null))
    
    await api.delete(`/api/partner/messages/${messageId}`)
    dispatch(deleteMessage(messageId))
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete message'))
    dispatch(stopLoading())
    throw error
  }
}

export default partnerInboxSlice.reducer

// Export types
export type {
  PartnerMessage,
  PartnerInboxStats
}