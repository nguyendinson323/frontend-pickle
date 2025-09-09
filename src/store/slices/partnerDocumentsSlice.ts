import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'

interface PartnerDocument {
  id: number
  document_name: string
  document_type: 'contract' | 'invoice' | 'agreement' | 'certificate' | 'other'
  file_url: string
  file_size: number
  mime_type: string
  uploaded_at: string
  is_signed: boolean
  signed_at: string | null
  expiry_date: string | null
  status: 'active' | 'expired' | 'pending' | 'archived'
  description: string | null
  uploaded_by_name?: string
}

interface PartnerInvoice {
  id: number
  invoice_number: string
  invoice_date: string
  due_date: string
  amount: number
  tax_amount: number
  total_amount: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  description: string
  line_items: {
    id: number
    description: string
    quantity: number
    unit_price: number
    total_price: number
  }[]
  payment_date: string | null
  payment_method: string | null
  document_url: string | null
}

interface DocumentsStats {
  total_documents: number
  pending_signatures: number
  expiring_soon: number
  total_invoices: number
  pending_invoices: number
  overdue_invoices: number
  total_invoice_amount: number
  paid_invoice_amount: number
}

interface PartnerDocumentsState {
  documents: PartnerDocument[]
  invoices: PartnerInvoice[]
  stats: DocumentsStats | null
  error: string | null
  documentFilter: {
    type: string
    status: string
    searchTerm: string
  }
  invoiceFilter: {
    status: string
    searchTerm: string
  }
  uploadingFile: boolean
}

const initialState: PartnerDocumentsState = {
  documents: [],
  invoices: [],
  stats: null,
  error: null,
  documentFilter: {
    type: '',
    status: '',
    searchTerm: ''
  },
  invoiceFilter: {
    status: '',
    searchTerm: ''
  },
  uploadingFile: false
}

const partnerDocumentsSlice = createSlice({
  name: 'partnerDocuments',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setDocuments: (state, action: PayloadAction<PartnerDocument[]>) => {
      state.documents = action.payload
    },
    setInvoices: (state, action: PayloadAction<PartnerInvoice[]>) => {
      state.invoices = action.payload
    },
    setStats: (state, action: PayloadAction<DocumentsStats>) => {
      state.stats = action.payload
    },
    setDocumentFilter: (state, action: PayloadAction<Partial<typeof initialState.documentFilter>>) => {
      state.documentFilter = { ...state.documentFilter, ...action.payload }
    },
    setInvoiceFilter: (state, action: PayloadAction<Partial<typeof initialState.invoiceFilter>>) => {
      state.invoiceFilter = { ...state.invoiceFilter, ...action.payload }
    },
    addDocument: (state, action: PayloadAction<PartnerDocument>) => {
      state.documents.unshift(action.payload)
    },
    updateDocument: (state, action: PayloadAction<PartnerDocument>) => {
      const index = state.documents.findIndex(doc => doc.id === action.payload.id)
      if (index !== -1) {
        state.documents[index] = action.payload
      }
    },
    removeDocument: (state, action: PayloadAction<number>) => {
      state.documents = state.documents.filter(doc => doc.id !== action.payload)
    },
    updateInvoice: (state, action: PayloadAction<PartnerInvoice>) => {
      const index = state.invoices.findIndex(inv => inv.id === action.payload.id)
      if (index !== -1) {
        state.invoices[index] = action.payload
      }
    },
    setUploadingFile: (state, action: PayloadAction<boolean>) => {
      state.uploadingFile = action.payload
    }
  }
})

export const {
  setError,
  setDocuments,
  setInvoices,
  setStats,
  setDocumentFilter,
  setInvoiceFilter,
  addDocument,
  updateDocument,
  removeDocument,
  updateInvoice,
  setUploadingFile
} = partnerDocumentsSlice.actions

// API Functions
export const fetchPartnerDocuments = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading documents...'))
  
  try {
    dispatch(setError(null))

    const response = await api.get('/api/partner/documents')
    const responseData = response.data as { documents: PartnerDocument[], invoices: PartnerInvoice[], stats: DocumentsStats }
    
    dispatch(setDocuments(responseData.documents))
    dispatch(setInvoices(responseData.invoices))
    dispatch(setStats(responseData.stats))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch documents'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const uploadPartnerDocument = (formData: FormData) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Uploading document...'))
  dispatch(setUploadingFile(true))
  
  try {
    dispatch(setError(null))

    const response = await api.post('/api/partner/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    dispatch(addDocument(response.data as PartnerDocument))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to upload document'))
    throw error
  } finally {
    dispatch(setUploadingFile(false))
    dispatch(stopLoading())
  }
}

export const signPartnerDocument = (documentId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Signing document...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post(`/api/partner/documents/${documentId}/sign`)
    
    dispatch(updateDocument(response.data as PartnerDocument))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to sign document'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const downloadPartnerDocument = (documentId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Downloading document...'))
  
  try {
    dispatch(setError(null))

    const response = await api.get(`/api/partner/documents/${documentId}/download`, {
      responseType: 'blob'
    })

    const documentResponse = await api.get(`/api/partner/documents/${documentId}`)
    const documentName = (documentResponse.data as PartnerDocument).document_name
    
    const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', documentName)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to download document'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const deletePartnerDocument = (documentId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Deleting document...'))
  
  try {
    dispatch(setError(null))

    await api.delete(`/api/partner/documents/${documentId}`)
    
    dispatch(removeDocument(documentId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete document'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const downloadPartnerInvoice = (invoiceId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Downloading invoice...'))
  
  try {
    dispatch(setError(null))

    const response = await api.get(`/api/partner/invoices/${invoiceId}/download`, {
      responseType: 'blob'
    })

    const invoiceResponse = await api.get(`/api/partner/invoices/${invoiceId}`)
    const invoiceNumber = (invoiceResponse.data as PartnerInvoice).invoice_number
    
    const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `invoice-${invoiceNumber}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to download invoice'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const markInvoiceAsPaid = (invoiceId: number, paymentData: { payment_method: string; payment_date: string }) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating invoice payment...'))
  
  try {
    dispatch(setError(null))

    const response = await api.post(`/api/partner/invoices/${invoiceId}/pay`, paymentData)
    
    dispatch(updateInvoice(response.data as PartnerInvoice))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to mark invoice as paid'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export default partnerDocumentsSlice.reducer

export type {
  PartnerDocument,
  PartnerInvoice,
  DocumentsStats
}