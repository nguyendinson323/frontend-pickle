import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'

interface StateMessage {
  id: number
  sender_id: number
  subject: string
  content: string
  message_type: string
  sent_at: string
  has_attachments: boolean
  is_read?: boolean
  read_at?: string | null
  sender: {
    id: number
    username: string
    email: string
    role: string
  }
  recipients?: {
    id: number
    recipient_id: number
    is_read: boolean
    read_at: string | null
    recipient: {
      id: number
      username: string
      email: string
      role: string
    }
  }[]
  attachments?: {
    id: number
    filename: string
    original_name: string
    file_size: number
    file_type: string
  }[]
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
export const fetchStateInboxData = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading inbox data...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.get('/api/state/inbox')
    dispatch(setInboxData(response.data as {
      messages: StateMessage[]
      sentMessages: StateMessage[]
      stats: StateInboxStats
    }))
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch inbox data'))
    dispatch(stopLoading())
    throw error
  }
}

export const fetchStateRecipients = (recipientType?: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading recipients...'))
  
  try {
    dispatch(setError(null))
    
    const url = recipientType 
      ? `/api/state/recipients?type=${recipientType}` 
      : '/api/state/recipients'
    
    const response = await api.get(url)
    dispatch(setRecipients((response.data as { recipients: MessageRecipient[] }).recipients))
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch recipients'))
    dispatch(stopLoading())
    throw error
  }
}

export const sendStateMessage = (messageData: {
  subject: string
  content: string
  message_type: string
  recipient_ids: number[]
  has_attachments?: boolean
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Sending message...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.post('/api/state/messages', messageData)
    dispatch(addMessage((response.data as { message: StateMessage }).message))
    
    dispatch(stopLoading())
    return response.data as { message: StateMessage }
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to send message'))
    dispatch(stopLoading())
    throw error
  }
}

export const sendBulkAnnouncement = (announcementData: {
  subject: string
  content: string
  target_groups: string[]
  recipient_ids?: number[]
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Sending announcement...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.post('/api/state/announcements', announcementData)
    dispatch(addMessage((response.data as { message: StateMessage, stats: any }).message))
    
    dispatch(stopLoading())
    return response.data as { message: StateMessage, stats: any }
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to send announcement'))
    dispatch(stopLoading())
    throw error
  }
}

export const markStateMessageAsRead = (messageId: number) => async (dispatch: AppDispatch) => {
  try {
    await api.put(`/api/state/messages/${messageId}/read`)
    dispatch(markMessageAsRead(messageId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to mark message as read'))
    throw error
  }
}

export const deleteStateMessage = (messageId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Deleting message...'))
  
  try {
    dispatch(setError(null))
    
    await api.delete(`/api/state/messages/${messageId}`)
    dispatch(deleteMessage(messageId))
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete message'))
    dispatch(stopLoading())
    throw error
  }
}

export const fetchMessageTemplates = () => async (dispatch: AppDispatch) => {
  try {
    const response = await api.get('/api/state/templates')
    dispatch(setTemplates((response.data as { templates: AnnouncementTemplate[] }).templates))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch templates'))
    throw error
  }
}

export const createMessageTemplate = (templateData: {
  name: string
  subject: string
  content: string
  target_audience: string
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Creating template...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.post('/api/state/templates', templateData)
    dispatch(addTemplate((response.data as { template: AnnouncementTemplate }).template))
    
    dispatch(stopLoading())
    return response.data as { template: AnnouncementTemplate }
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to create template'))
    dispatch(stopLoading())
    throw error
  }
}

export const updateMessageTemplate = (templateId: number, templateData: Partial<AnnouncementTemplate>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating template...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.put(`/api/state/templates/${templateId}`, templateData)
    dispatch(updateTemplate((response.data as { template: AnnouncementTemplate }).template))
    
    dispatch(stopLoading())
    return response.data as { template: AnnouncementTemplate }
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update template'))
    dispatch(stopLoading())
    throw error
  }
}

export const deleteMessageTemplate = (templateId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Deleting template...'))
  
  try {
    dispatch(setError(null))
    
    await api.delete(`/api/state/templates/${templateId}`)
    dispatch(deleteTemplate(templateId))
    dispatch(stopLoading())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete template'))
    dispatch(stopLoading())
    throw error
  }
}

export default stateInboxSlice.reducer

// Export types
export type {
  StateMessage,
  MessageRecipient,
  AnnouncementTemplate,
  StateInboxStats
}