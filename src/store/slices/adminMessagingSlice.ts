import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
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
  loading: boolean
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
  loading: false,
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
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
  setLoading,
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
export const fetchTemplates = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const response = await axios.get('/api/admin/messaging/templates')

    dispatch(setTemplates(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch message templates'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchSentMessages = (filters?: Partial<MessageFilter>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }

    const response = await axios.get(`/api/admin/messaging/sent?${queryParams.toString()}`)

    dispatch(setSentMessages(response.data.messages))
    dispatch(setMessageStats(response.data.stats))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch sent messages'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const createTemplate = (templateData: Omit<MessageTemplate, 'id' | 'created_at'>) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post('/api/admin/messaging/templates', templateData)

    dispatch(addTemplate(response.data))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to create message template'))
    throw error
  }
}

export const updateTemplateAction = (templateId: number, templateData: Partial<MessageTemplate>) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.put(`/api/admin/messaging/templates/${templateId}`, templateData)

    dispatch(updateTemplate(response.data))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update message template'))
    throw error
  }
}

export const deleteTemplate = (templateId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    await axios.delete(`/api/admin/messaging/templates/${templateId}`)

    dispatch(removeTemplate(templateId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete message template'))
    throw error
  }
}

export const sendBroadcastMessage = (messageData: BroadcastMessage) => async (dispatch: any) => {
  try {
    dispatch(setSendingMessage(true))
    dispatch(setError(null))

    const response = await axios.post('/api/admin/messaging/broadcast', messageData)

    dispatch(addSentMessage(response.data))
    dispatch(resetBroadcastForm())
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to send broadcast message'))
    throw error
  } finally {
    dispatch(setSendingMessage(false))
  }
}

export const getMessagePreview = (messageData: BroadcastMessage) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post('/api/admin/messaging/preview', messageData)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to get message preview'))
    throw error
  }
}

export const resendFailedMessage = (messageId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/admin/messaging/resend/${messageId}`)

    // Refresh sent messages
    dispatch(fetchSentMessages())
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to resend message'))
    throw error
  }
}

export const getMessageDeliveryReport = (messageId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.get(`/api/admin/messaging/delivery-report/${messageId}`)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to get delivery report'))
    throw error
  }
}

export default adminMessagingSlice.reducer