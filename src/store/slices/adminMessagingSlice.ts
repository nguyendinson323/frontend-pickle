import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'
import { MessageTemplate, BroadcastMessage } from '../../types/admin'

interface MessageFilter {
  recipientType: string
  status: string
  dateFrom: string
  dateTo: string
  searchTerm: string
}

interface SentMessage {
  id: number
  subject: string
  body: string
  recipients: string[]
  recipient_count: number
  sent_at: string
  sent_by: string
  status: 'sent' | 'failed' | 'pending'
  delivery_stats: {
    delivered: number
    failed: number
    pending: number
  }
}

interface AdminMessagingState {
  templates: MessageTemplate[]
  sentMessages: SentMessage[]
  selectedTemplate: MessageTemplate | null
  messageFilter: MessageFilter
  messageStats: {
    totalSent: number
    totalDelivered: number
    totalFailed: number
    totalPending: number
    emailsSent: number
    smsSent: number
    inAppSent: number
  }
  sendingMessage: boolean
  error: string | null
  broadcastForm: BroadcastMessage
}

const initialState: AdminMessagingState = {
  templates: [],
  sentMessages: [],
  selectedTemplate: null,
  messageFilter: {
    recipientType: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  },
  messageStats: {
    totalSent: 0,
    totalDelivered: 0,
    totalFailed: 0,
    totalPending: 0,
    emailsSent: 0,
    smsSent: 0,
    inAppSent: 0
  },
  sendingMessage: false,
  error: null,
  broadcastForm: {
    recipients: [],
    subject: '',
    body: '',
    attachments: [],
    sendEmail: true,
    sendSMS: false,
    sendInApp: true
  }
}

const adminMessagingSlice = createSlice({
  name: 'adminMessaging',
  initialState,
  reducers: {
    setSendingMessage: (state, action: PayloadAction<boolean>) => {
      state.sendingMessage = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setTemplates: (state, action: PayloadAction<MessageTemplate[]>) => {
      state.templates = action.payload
    },
    setSentMessages: (state, action: PayloadAction<SentMessage[]>) => {
      state.sentMessages = action.payload
    },
    setSelectedTemplate: (state, action: PayloadAction<MessageTemplate | null>) => {
      state.selectedTemplate = action.payload
    },
    setMessageFilter: (state, action: PayloadAction<Partial<MessageFilter>>) => {
      state.messageFilter = { ...state.messageFilter, ...action.payload }
    },
    setMessageStats: (state, action: PayloadAction<typeof initialState.messageStats>) => {
      state.messageStats = action.payload
    },
    setBroadcastForm: (state, action: PayloadAction<Partial<BroadcastMessage>>) => {
      state.broadcastForm = { ...state.broadcastForm, ...action.payload }
    },
    resetBroadcastForm: (state) => {
      state.broadcastForm = {
        recipients: [],
        subject: '',
        body: '',
        attachments: [],
        sendEmail: true,
        sendSMS: false,
        sendInApp: true
      }
    },
    addTemplate: (state, action: PayloadAction<MessageTemplate>) => {
      state.templates.unshift(action.payload)
    },
    updateTemplate: (state, action: PayloadAction<MessageTemplate>) => {
      const index = state.templates.findIndex(template => template.id === action.payload.id)
      if (index !== -1) {
        state.templates[index] = action.payload
      }
    },
    removeTemplate: (state, action: PayloadAction<number>) => {
      state.templates = state.templates.filter(template => template.id !== action.payload)
    },
    addSentMessage: (state, action: PayloadAction<SentMessage>) => {
      state.sentMessages.unshift(action.payload)
    }
  }
})

export const {
  setSendingMessage,
  setError,
  setTemplates,
  setSentMessages,
  setSelectedTemplate,
  setMessageFilter,
  setMessageStats,
  setBroadcastForm,
  resetBroadcastForm,
  addTemplate,
  updateTemplate,
  removeTemplate,
  addSentMessage
} = adminMessagingSlice.actions

// API Functions
export const fetchTemplates = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading message templates...'))
  
  try {
    dispatch(setError(null))

    const response = await api.get('/api/admin/messaging/templates')

    dispatch(setTemplates(response.data as MessageTemplate[]))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to fetch message templates'))
    dispatch(stopLoading())
    throw error
  }
}

export const fetchSentMessages = (filters?: Partial<MessageFilter>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading sent messages...'))
  
  try {
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }

    const response = await api.get(`/api/admin/messaging/sent?${queryParams.toString()}`)
    const responseData = response.data as { messages: SentMessage[], stats: typeof initialState.messageStats }

    dispatch(setSentMessages(responseData.messages))
    dispatch(setMessageStats(responseData.stats))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to fetch sent messages'))
    dispatch(stopLoading())
    throw error
  }
}

export const createTemplate = (templateData: Omit<MessageTemplate, 'id' | 'created_at'>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Creating template...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post('/api/admin/messaging/templates', templateData)

    dispatch(addTemplate(response.data as MessageTemplate))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to create message template'))
    dispatch(stopLoading())
    throw error
  }
}

export const updateTemplateAction = (templateId: number, templateData: Partial<MessageTemplate>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating template...'))
  
  try {
    dispatch(setError(null))

    const response = await api.put(`/api/admin/messaging/templates/${templateId}`, templateData)

    dispatch(updateTemplate(response.data as MessageTemplate))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to update message template'))
    dispatch(stopLoading())
    throw error
  }
}

export const deleteTemplate = (templateId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Deleting template...'))
  
  try {
    dispatch(setError(null))

    await api.delete(`/api/admin/messaging/templates/${templateId}`)

    dispatch(removeTemplate(templateId))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to delete message template'))
    dispatch(stopLoading())
    throw error
  }
}

export const sendBroadcastMessage = (messageData: BroadcastMessage) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Sending broadcast message...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post('/api/admin/messaging/broadcast', messageData)

    dispatch(addSentMessage(response.data as SentMessage))
    dispatch(resetBroadcastForm())
    dispatch(stopLoading())
    
    return response.data
  } catch (error) {
    dispatch(setError('Failed to send broadcast message'))
    dispatch(stopLoading())
    throw error
  }
}

export const getMessagePreview = (messageData: BroadcastMessage) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Generating preview...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post('/api/admin/messaging/preview', messageData)

    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to get message preview'))
    dispatch(stopLoading())
    throw error
  }
}

export const resendFailedMessage = (messageId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Resending message...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post(`/api/admin/messaging/resend/${messageId}`)

    // Refresh sent messages
    dispatch(fetchSentMessages())
    dispatch(stopLoading())
    
    return response.data
  } catch (error) {
    dispatch(setError('Failed to resend message'))
    dispatch(stopLoading())
    throw error
  }
}

export const getMessageDeliveryReport = (messageId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading delivery report...'))
  
  try {
    dispatch(setError(null))

    const response = await api.get(`/api/admin/messaging/delivery-report/${messageId}`)

    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to get delivery report'))
    dispatch(stopLoading())
    throw error
  }
}

export default adminMessagingSlice.reducer