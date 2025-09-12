import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'

interface Document {
  id: number
  owner_id: number
  title: string
  description: string | null
  document_url: string
  file_type: string | null
  is_public: boolean
  created_at: string
  owner: {
    id: number
    username: string
    email: string
  }
}

interface DocumentsStats {
  total_documents: number
  documents_by_type: {
    [key: string]: number
  }
  public_documents: number
  private_documents: number
  recent_activity: number
  total_invoices: number
  invoices_by_status: {
    paid: number
    pending: number
    overdue: number
  }
  financial_summary: {
    total_invoiced: number
    total_paid: number
    total_outstanding: number
    overdue_amount: number
  }
}

interface StateDocumentsState {
  documents: Document[]
  stats: DocumentsStats | null
  selectedDocument: Document | null
  loading: boolean
  error: string | null
  filters: {
    file_type: string
    is_public: boolean | null
    date_range: {
      start_date: string
      end_date: string
    }
    search: string
  }
}

const initialState: StateDocumentsState = {
  documents: [],
  stats: null,
  selectedDocument: null,
  loading: false,
  error: null,
  filters: {
    file_type: '',
    is_public: null,
    date_range: {
      start_date: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0]
    },
    search: ''
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
      documents: Document[]
      stats: DocumentsStats
    }>) => {
      state.documents = action.payload.documents
      state.stats = action.payload.stats
    },
    setSelectedDocument: (state, action: PayloadAction<Document | null>) => {
      state.selectedDocument = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<StateDocumentsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    addDocument: (state, action: PayloadAction<Document>) => {
      state.documents.unshift(action.payload)
      if (state.stats) {
        state.stats.total_documents += 1
        if (action.payload.is_public) {
          state.stats.public_documents += 1
        } else {
          state.stats.private_documents += 1
        }
        // Update documents by type
        const docType = action.payload.file_type || 'other'
        state.stats.documents_by_type[docType] = (state.stats.documents_by_type[docType] || 0) + 1
      }
    },
    updateDocument: (state, action: PayloadAction<Document>) => {
      const index = state.documents.findIndex(doc => doc.id === action.payload.id)
      if (index !== -1) {
        state.documents[index] = action.payload
      }
    },
    deleteDocument: (state, action: PayloadAction<number>) => {
      const document = state.documents.find(doc => doc.id === action.payload)
      state.documents = state.documents.filter(doc => doc.id !== action.payload)
      
      if (state.stats && document) {
        state.stats.total_documents -= 1
        if (document.is_public) {
          state.stats.public_documents -= 1
        } else {
          state.stats.private_documents -= 1
        }
        // Update documents by type
        const docType = document.file_type || 'other'
        if (state.stats.documents_by_type[docType] > 0) {
          state.stats.documents_by_type[docType] -= 1
        }
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setDocumentsData,
  setSelectedDocument,
  setFilters,
  addDocument,
  updateDocument,
  deleteDocument
} = stateDocumentsSlice.actions

// API Functions
export const fetchStateDocuments = (filters?: Partial<StateDocumentsState['filters']>) => async (dispatch: AppDispatch, getState: any) => {
  dispatch(startLoading('Loading documents...'))
  
  try {
    dispatch(setError(null))
    
    const state = getState()
    const currentFilters = { ...state.stateDocuments.filters, ...filters }
    
    if (filters) {
      dispatch(setFilters(filters))
    }
    
    const params: any = {}
    if (currentFilters.file_type) params.file_type = currentFilters.file_type
    if (currentFilters.is_public !== null) params.is_public = currentFilters.is_public
    if (currentFilters.search) params.search = currentFilters.search
    if (currentFilters.date_range.start_date) params.start_date = currentFilters.date_range.start_date
    if (currentFilters.date_range.end_date) params.end_date = currentFilters.date_range.end_date
    
    const response = await api.get('/api/state/documents', { params })
    
    const responseData = response.data as {
      documents: Document[]
      stats: DocumentsStats
    }
    dispatch(setDocumentsData(responseData))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch documents'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const uploadStateDocument = (documentData: {
  title: string
  description?: string
  is_public: boolean
  file: string // base64 encoded file
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Uploading document...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.post('/api/state/documents/upload', documentData)
    
    const responseData = response.data as { document: Document }
    dispatch(addDocument(responseData.document))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to upload document'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const updateStateDocument = (documentId: number, documentData: Partial<Document>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating document...'))
  
  try {
    dispatch(setError(null))
    
    const response = await api.put(`/api/state/documents/${documentId}`, documentData)
    const responseData = response.data as { document: Document }
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

export const downloadStateDocument = (documentId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setError(null))
    
    const response = await api.get(`/api/state/documents/${documentId}/download`, {
      maxRedirects: 0,
      validateStatus: (status) => status === 302 || status === 200
    })
    
    // If redirect response, get the location header
    if (response.status === 302 && response.headers.location) {
      window.open(response.headers.location, '_blank')
    } else if (response.data && (response.data as any).url) {
      window.open((response.data as any).url, '_blank')
    } else {
      // Fallback: try to get the URL directly
      const urlResponse = await api.get(`/api/state/documents/${documentId}/download`)
      window.open(urlResponse.request.responseURL, '_blank')
    }
  } catch (error: any) {
    if (error.response?.status === 302) {
      // Handle redirect manually
      window.open(error.response.headers.location, '_blank')
      return
    }
    dispatch(setError(error.response?.data?.message || 'Failed to download document'))
    throw error
  }
}

export default stateDocumentsSlice.reducer

// Placeholder types for future invoice functionality
interface StateInvoice {
  id: number
  owner_id: number
  title: string
  amount: number
  status: 'pending' | 'paid' | 'overdue'
  created_at: string
  invoice_number?: string
  invoice_type?: string
  recipient_type?: string
  recipient_id?: number
  recipient_name?: string
  tax_amount?: number
  due_date?: string
  description?: string
  total_amount?: number
}

// Placeholder types for future template functionality
interface DocumentTemplate {
  id: number
  owner_id: number
  name: string
  content: string
  template_type: string
  created_at: string
  description?: string
  variables?: any[]
  is_active?: boolean
}

// Export types
export type {
  Document,
  DocumentsStats,
  StateInvoice,
  DocumentTemplate
}