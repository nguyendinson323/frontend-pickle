import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'

interface StateDocument {
  id: number
  state_committee_id: number
  title: string
  description: string | null
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  document_type: 'invoice' | 'contract' | 'report' | 'certificate' | 'policy' | 'other'
  related_entity_type: 'tournament' | 'club' | 'partner' | 'player' | 'coach' | 'general' | null
  related_entity_id: number | null
  is_public: boolean
  created_by: number
  created_at: string
  updated_at: string
  created_by_user: {
    id: number
    username: string
    email: string
  }
}

interface StateInvoice {
  id: number
  state_committee_id: number
  invoice_number: string
  invoice_type: 'tournament_fee' | 'membership_fee' | 'court_rental' | 'sponsorship' | 'other'
  recipient_type: 'tournament' | 'club' | 'partner' | 'player' | 'coach'
  recipient_id: number
  recipient_name: string
  amount: number
  tax_amount: number | null
  total_amount: number
  due_date: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  description: string | null
  payment_date: string | null
  payment_method: string | null
  created_at: string
  updated_at: string
}

interface DocumentTemplate {
  id: number
  state_committee_id: number
  name: string
  description: string | null
  template_type: 'invoice' | 'contract' | 'certificate' | 'report' | 'letter'
  template_content: string
  variables: string[] // JSON array of variable names
  is_active: boolean
  created_at: string
}

interface StateDocumentsStats {
  total_documents: number
  documents_by_type: {
    [key: string]: number
  }
  total_invoices: number
  invoices_by_status: {
    draft: number
    sent: number
    paid: number
    overdue: number
    cancelled: number
  }
  financial_summary: {
    total_invoiced: number
    total_paid: number
    total_outstanding: number
    overdue_amount: number
  }
  recent_activity: number
}

interface StateDocumentsState {
  documents: StateDocument[]
  invoices: StateInvoice[]
  templates: DocumentTemplate[]
  stats: StateDocumentsStats | null
  selectedDocument: StateDocument | null
  selectedInvoice: StateInvoice | null
  loading: boolean
  error: string | null
  filters: {
    document_type: string
    related_entity_type: string
    is_public: boolean | null
    date_range: {
      start_date: string
      end_date: string
    }
  }
}

const initialState: StateDocumentsState = {
  documents: [],
  invoices: [],
  templates: [],
  stats: null,
  selectedDocument: null,
  selectedInvoice: null,
  loading: false,
  error: null,
  filters: {
    document_type: '',
    related_entity_type: '',
    is_public: null,
    date_range: {
      start_date: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0]
    }
  }
}

const stateDocumentsSlice = createSlice({
  name: 'stateDocuments',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setDocumentsData: (state, action: PayloadAction<{
      documents: StateDocument[]
      invoices: StateInvoice[]
      templates: DocumentTemplate[]
      stats: StateDocumentsStats
    }>) => {
      state.documents = action.payload.documents
      state.invoices = action.payload.invoices
      state.templates = action.payload.templates
      state.stats = action.payload.stats
    },
    setSelectedDocument: (state, action: PayloadAction<StateDocument | null>) => {
      state.selectedDocument = action.payload
    },
    setSelectedInvoice: (state, action: PayloadAction<StateInvoice | null>) => {
      state.selectedInvoice = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<StateDocumentsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    addDocument: (state, action: PayloadAction<StateDocument>) => {
      state.documents.unshift(action.payload)
    },
    updateDocument: (state, action: PayloadAction<StateDocument>) => {
      const index = state.documents.findIndex(doc => doc.id === action.payload.id)
      if (index !== -1) {
        state.documents[index] = action.payload
      }
    },
    deleteDocument: (state, action: PayloadAction<number>) => {
      state.documents = state.documents.filter(doc => doc.id !== action.payload)
    },
    addInvoice: (state, action: PayloadAction<StateInvoice>) => {
      state.invoices.unshift(action.payload)
    },
    updateInvoice: (state, action: PayloadAction<StateInvoice>) => {
      const index = state.invoices.findIndex(invoice => invoice.id === action.payload.id)
      if (index !== -1) {
        state.invoices[index] = action.payload
      }
    },
    deleteInvoice: (state, action: PayloadAction<number>) => {
      state.invoices = state.invoices.filter(invoice => invoice.id !== action.payload)
    },
    addTemplate: (state, action: PayloadAction<DocumentTemplate>) => {
      state.templates.unshift(action.payload)
    },
    updateTemplate: (state, action: PayloadAction<DocumentTemplate>) => {
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
  setDocumentsData,
  setSelectedDocument,
  setSelectedInvoice,
  setFilters,
  addDocument,
  updateDocument,
  deleteDocument,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  addTemplate,
  updateTemplate,
  deleteTemplate
} = stateDocumentsSlice.actions

// API Functions
export const fetchStateDocumentsData = (filters?: Partial<StateDocumentsState['filters']>) => async (dispatch: AppDispatch, getState: any) => {
  dispatch(startLoading('Loading documents data...'))
  
  try {
    dispatch(setError(null))
    
    const state = getState()
    const currentFilters = { ...state.stateDocuments.filters, ...filters }
    
    if (filters) {
      dispatch(setFilters(filters))
    }
    
    const response = await api.get('/api/state/documents', {
      params: currentFilters
    })
    
    const responseData = response.data as {
      documents: StateDocument[]
      invoices: StateInvoice[]
      templates: DocumentTemplate[]
      stats: StateDocumentsStats
    }
    dispatch(setDocumentsData(responseData))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch documents data'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const uploadStateDocument = (documentData: FormData) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Uploading document...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.post('/api/state/documents/upload', documentData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    const responseData = response.data as { document: StateDocument }
    dispatch(addDocument(responseData.document))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to upload document'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const updateStateDocument = (documentId: number, documentData: Partial<StateDocument>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating document...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.put(`/api/state/documents/${documentId}`, documentData)
    const responseData = response.data as { document: StateDocument }
    dispatch(updateDocument(responseData.document))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update document'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const deleteStateDocument = (documentId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Deleting document...'))
  
  try {
    dispatch(setError(null))
    
    await api.delete(`/api/state/documents/${documentId}`)
    dispatch(deleteDocument(documentId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete document'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const createStateInvoice = (invoiceData: {
  invoice_type: string
  recipient_type: string
  recipient_id: number
  recipient_name: string
  amount: number
  tax_amount?: number
  due_date: string
  description?: string
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Creating invoice...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.post('/api/state/invoices', invoiceData)
    const responseData = response.data as { invoice: StateInvoice }
    dispatch(addInvoice(responseData.invoice))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to create invoice'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const updateStateInvoice = (invoiceId: number, invoiceData: Partial<StateInvoice>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating invoice...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.put(`/api/state/invoices/${invoiceId}`, invoiceData)
    const responseData = response.data as { invoice: StateInvoice }
    dispatch(updateInvoice(responseData.invoice))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update invoice'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const deleteStateInvoice = (invoiceId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Deleting invoice...'))
  
  try {
    dispatch(setError(null))
    
    await api.delete(`/api/state/invoices/${invoiceId}`)
    dispatch(deleteInvoice(invoiceId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete invoice'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const createDocumentTemplate = (templateData: {
  name: string
  description?: string
  template_type: string
  template_content: string
  variables: string[]
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Creating document template...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.post('/api/state/document-templates', templateData)
    const responseData = response.data as { template: DocumentTemplate }
    dispatch(addTemplate(responseData.template))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to create template'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export default stateDocumentsSlice.reducer

// Export types
export type {
  StateDocument,
  StateInvoice,
  DocumentTemplate,
  StateDocumentsStats
}