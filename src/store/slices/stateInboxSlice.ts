import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface StateMessage {
  id: number
  sender_id: number
  recipient_id: number | null
  recipient_type: 'direct' | 'group' | 'tournament' | 'state' | 'club'
  subject: string
  message: string
  is_read: boolean
  is_announcement: boolean
  sent_at: string
  read_at: string | null
  sender: {
    id: number
    username: string
    email: string
    role: string
  }
  recipient: {
    id: number
    username?: string
    email?: string
    name?: string
    role?: string
  } | null
  announcement_stats?: {
    total_recipients: number
    delivered: number
    read: number
  }
}

interface MessageRecipient {
  id: number
  name: string
  email: string
  type: 'player' | 'club' | 'partner' | 'coach'
  role: string
}

interface AnnouncementTemplate {
  id: number
  name: string
  subject: string
  content: string
  target_audience: string
  created_at: string
}

interface StateInboxStats {
  total_messages: number
  unread_messages: number
  announcements_sent: number
  total_recipients_reached: number
  recent_activity: number
}

interface StateInboxState {
  messages: StateMessage[]
  sentMessages: StateMessage[]
  recipients: MessageRecipient[]
  templates: AnnouncementTemplate[]
  stats: StateInboxStats | null
  selectedMessage: StateMessage | null
  loading: boolean
  error: string | null
}

const initialState: StateInboxState = {
  messages: [],
  sentMessages: [],
  recipients: [],
  templates: [],
  stats: null,
  selectedMessage: null,
  loading: false,
  error: null
}

const stateInboxSlice = createSlice({
  name: 'stateInbox',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setInboxData: (state, action: PayloadAction<{
      messages: StateMessage[]
      sentMessages: StateMessage[]
      stats: StateInboxStats
    }>) => {
      state.messages = action.payload.messages
      state.sentMessages = action.payload.sentMessages
      state.stats = action.payload.stats
    },
    setRecipients: (state, action: PayloadAction<MessageRecipient[]>) => {
      state.recipients = action.payload
    },
    setTemplates: (state, action: PayloadAction<AnnouncementTemplate[]>) => {
      state.templates = action.payload
    },
    setSelectedMessage: (state, action: PayloadAction<StateMessage | null>) => {
      state.selectedMessage = action.payload
    },
    addMessage: (state, action: PayloadAction<StateMessage>) => {
      state.sentMessages.unshift(action.payload)
    },
    markMessageAsRead: (state, action: PayloadAction<number>) => {
      const index = state.messages.findIndex(message => message.id === action.payload)
      if (index !== -1) {
        state.messages[index].is_read = true
        state.messages[index].read_at = new Date().toISOString()
      }
    },
    deleteMessage: (state, action: PayloadAction<number>) => {
      state.messages = state.messages.filter(message => message.id !== action.payload)
      state.sentMessages = state.sentMessages.filter(message => message.id !== action.payload)
    },
    addTemplate: (state, action: PayloadAction<AnnouncementTemplate>) => {
      state.templates.unshift(action.payload)
    },
    updateTemplate: (state, action: PayloadAction<AnnouncementTemplate>) => {
      const index = state.templates.findIndex(template => template.id === action.payload.id)
      if (index !== -1) {
        state.templates[index] = action.payload
      }
    },
    deleteTemplate: (state, action: PayloadAction<number>) => {
      state.templates = state.templates.filter(template => template.id !== action.payload)
    }
  }
})

export const {
  setLoading,
  setError,
  setInboxData,
  setRecipients,
  setTemplates,
  setSelectedMessage,
  addMessage,
  markMessageAsRead,
  deleteMessage,
  addTemplate,
  updateTemplate,
  deleteTemplate
} = stateInboxSlice.actions

// API Functions
export const fetchStateInboxData = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.get('/api/state/inbox')
    dispatch(setInboxData(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch inbox data'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchStateRecipients = (recipientType?: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const url = recipientType 
      ? `/api/state/recipients?type=${recipientType}` 
      : '/api/state/recipients'
    
    const response = await axios.get(url)
    dispatch(setRecipients(response.data.recipients))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch recipients'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const sendStateMessage = (messageData: {
  subject: string
  message: string
  recipient_type: 'direct' | 'group' | 'tournament' | 'state' | 'club'
  recipient_ids?: number[]
  is_announcement?: boolean
  schedule_at?: string
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.post('/api/state/messages', messageData)
    dispatch(addMessage(response.data.message))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to send message'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const sendBulkAnnouncement = (announcementData: {
  subject: string
  message: string
  target_groups: string[]
  recipient_ids?: number[]
  schedule_at?: string
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.post('/api/state/announcements', announcementData)
    dispatch(addMessage(response.data.announcement))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to send announcement'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const markStateMessageAsRead = (messageId: number) => async (dispatch: any) => {
  try {
    await axios.put(`/api/state/messages/${messageId}/read`)
    dispatch(markMessageAsRead(messageId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to mark message as read'))
  }
}

export const deleteStateMessage = (messageId: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    await axios.delete(`/api/state/messages/${messageId}`)
    dispatch(deleteMessage(messageId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete message'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchMessageTemplates = () => async (dispatch: any) => {
  try {
    const response = await axios.get('/api/state/templates')
    dispatch(setTemplates(response.data.templates))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch templates'))
  }
}

export const createMessageTemplate = (templateData: {
  name: string
  subject: string
  content: string
  target_audience: string
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.post('/api/state/templates', templateData)
    dispatch(addTemplate(response.data.template))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to create template'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateMessageTemplate = (templateId: number, templateData: Partial<AnnouncementTemplate>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.put(`/api/state/templates/${templateId}`, templateData)
    dispatch(updateTemplate(response.data.template))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update template'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const deleteMessageTemplate = (templateId: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    await axios.delete(`/api/state/templates/${templateId}`)
    dispatch(deleteTemplate(templateId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete template'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export default stateInboxSlice.reducer

// Export types
export type {
  StateMessage,
  MessageRecipient,
  AnnouncementTemplate
}