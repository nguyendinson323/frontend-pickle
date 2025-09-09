import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

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
  loading: boolean
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
  loading: false,
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
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
  setLoading,
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
export const fetchPartnerDocuments = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const response = await axios.get('/api/partner/documents')
    
    dispatch(setDocuments(response.data.documents))
    dispatch(setInvoices(response.data.invoices))
    dispatch(setStats(response.data.stats))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch documents'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const uploadPartnerDocument = (formData: FormData) => async (dispatch: any) => {
  try {
    dispatch(setUploadingFile(true))
    dispatch(setError(null))

    const response = await axios.post('/api/partner/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    dispatch(addDocument(response.data))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to upload document'))
    throw error
  } finally {
    dispatch(setUploadingFile(false))
  }
}

export const signPartnerDocument = (documentId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/partner/documents/${documentId}/sign`)
    
    dispatch(updateDocument(response.data))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to sign document'))
    throw error
  }
}

export const downloadPartnerDocument = (documentId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.get(`/api/partner/documents/${documentId}/download`, {
      responseType: 'blob'
    })

    const document = await axios.get(`/api/partner/documents/${documentId}`)
    const documentName = document.data.document_name
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
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
  }
}

export const deletePartnerDocument = (documentId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    await axios.delete(`/api/partner/documents/${documentId}`)
    
    dispatch(removeDocument(documentId))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete document'))
    throw error
  }
}

export const downloadPartnerInvoice = (invoiceId: number) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.get(`/api/partner/invoices/${invoiceId}/download`, {
      responseType: 'blob'
    })

    const invoice = await axios.get(`/api/partner/invoices/${invoiceId}`)
    const invoiceNumber = invoice.data.invoice_number
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
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
  }
}

export const markInvoiceAsPaid = (invoiceId: number, paymentData: { payment_method: string; payment_date: string }) => async (dispatch: any) => {
  try {
    dispatch(setError(null))

    const response = await axios.post(`/api/partner/invoices/${invoiceId}/pay`, paymentData)
    
    dispatch(updateInvoice(response.data))
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to mark invoice as paid'))
    throw error
  }
}

export default partnerDocumentsSlice.reducer

export type {
  PartnerDocument,
  PartnerInvoice,
  DocumentsStats
}