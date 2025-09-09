import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '..'
import api from '../../services/api'

export interface Payment {
  id: number
  amount: number
  currency: string
  status: string
  payment_method: string
  transaction_id: string
  description: string
  user_id: number
  metadata: any
  created_at: string
  updated_at: string
  user?: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
}

export interface PaymentMethod {
  id: number
  user_id: number
  provider: string
  provider_id: string
  card_last_four: string
  card_brand: string
  is_default: boolean
  created_at: string
}

export interface PaymentStats {
  totalRevenue: number
  totalTransactions: number
  successfulPayments: number
  failedPayments: number
  pendingPayments: number
  refundedPayments: number
  averageTransactionValue: number
  todayRevenue: number
  thisWeekRevenue: number
  thisMonthRevenue: number
  topPaymentMethods: {
    method: string
    count: number
    percentage: number
  }[]
  revenueByPeriod: {
    period: string
    revenue: number
    transactions: number
  }[]
}

export interface PaymentFilter {
  status: string
  payment_method: string
  date_range: string
  amount_min: number | null
  amount_max: number | null
  user_search: string
  transaction_id: string
}

export interface AdminPaymentsState {
  payments: Payment[]
  paymentMethods: PaymentMethod[]
  paymentStats: PaymentStats
  paymentFilter: PaymentFilter
  selectedPayments: number[]
  currentPage: number
  totalPages: number
  totalCount: number
  loading: boolean
  error: string | null
  bulkActionLoading: boolean
}

const initialState: AdminPaymentsState = {
  payments: [],
  paymentMethods: [],
  paymentStats: {
    totalRevenue: 0,
    totalTransactions: 0,
    successfulPayments: 0,
    failedPayments: 0,
    pendingPayments: 0,
    refundedPayments: 0,
    averageTransactionValue: 0,
    todayRevenue: 0,
    thisWeekRevenue: 0,
    thisMonthRevenue: 0,
    topPaymentMethods: [],
    revenueByPeriod: []
  },
  paymentFilter: {
    status: 'all',
    payment_method: 'all',
    date_range: 'all',
    amount_min: null,
    amount_max: null,
    user_search: '',
    transaction_id: ''
  },
  selectedPayments: [],
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  loading: false,
  error: null,
  bulkActionLoading: false
}

const adminPaymentsSlice = createSlice({
  name: 'adminPayments',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setBulkActionLoading: (state, action: PayloadAction<boolean>) => {
      state.bulkActionLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setPayments: (state, action: PayloadAction<{ payments: Payment[], totalCount: number, totalPages: number }>) => {
      state.payments = action.payload.payments
      state.totalCount = action.payload.totalCount
      state.totalPages = action.payload.totalPages
    },
    setPaymentMethods: (state, action: PayloadAction<PaymentMethod[]>) => {
      state.paymentMethods = action.payload
    },
    setPaymentStats: (state, action: PayloadAction<PaymentStats>) => {
      state.paymentStats = action.payload
    },
    updatePaymentFilter: (state, action: PayloadAction<Partial<PaymentFilter>>) => {
      state.paymentFilter = { ...state.paymentFilter, ...action.payload }
      state.currentPage = 1
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    togglePaymentSelection: (state, action: PayloadAction<number>) => {
      const paymentId = action.payload
      const index = state.selectedPayments.indexOf(paymentId)
      if (index === -1) {
        state.selectedPayments.push(paymentId)
      } else {
        state.selectedPayments.splice(index, 1)
      }
    },
    toggleAllPayments: (state) => {
      if (state.selectedPayments.length === state.payments.length) {
        state.selectedPayments = []
      } else {
        state.selectedPayments = state.payments.map(payment => payment.id)
      }
    },
    clearSelectedPayments: (state) => {
      state.selectedPayments = []
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const index = state.payments.findIndex(payment => payment.id === action.payload.id)
      if (index !== -1) {
        state.payments[index] = action.payload
      }
    },
    removePayment: (state, action: PayloadAction<number>) => {
      state.payments = state.payments.filter(payment => payment.id !== action.payload)
      state.selectedPayments = state.selectedPayments.filter(id => id !== action.payload)
      state.totalCount -= 1
    },
    clearFilters: (state) => {
      state.paymentFilter = initialState.paymentFilter
      state.currentPage = 1
    }
  }
})

export const {
  setLoading,
  setBulkActionLoading,
  setError,
  setPayments,
  setPaymentMethods,
  setPaymentStats,
  updatePaymentFilter,
  setCurrentPage,
  togglePaymentSelection,
  toggleAllPayments,
  clearSelectedPayments,
  updatePayment,
  removePayment,
  clearFilters
} = adminPaymentsSlice.actions

// Thunks
export const fetchPayments = () => async (dispatch: AppDispatch, getState: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))

    const { paymentFilter, currentPage } = getState().adminPayments
    
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: '10',
      ...(paymentFilter.status !== 'all' && { status: paymentFilter.status }),
      ...(paymentFilter.payment_method !== 'all' && { payment_method: paymentFilter.payment_method }),
      ...(paymentFilter.date_range !== 'all' && { date_range: paymentFilter.date_range }),
      ...(paymentFilter.amount_min && { amount_min: paymentFilter.amount_min.toString() }),
      ...(paymentFilter.amount_max && { amount_max: paymentFilter.amount_max.toString() }),
      ...(paymentFilter.user_search && { user_search: paymentFilter.user_search }),
      ...(paymentFilter.transaction_id && { transaction_id: paymentFilter.transaction_id })
    })

    const response = await api.get(`/api/admin/payments?${params}`)
    
    dispatch(setPayments({
      payments: response.data.payments,
      totalCount: response.data.totalCount,
      totalPages: response.data.totalPages
    }))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch payments'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchPaymentStats = () => async (dispatch: AppDispatch) => {
  try {
    const response = await api.get('/api/admin/payments/stats')
    dispatch(setPaymentStats(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch payment statistics'))
  }
}

export const fetchPaymentMethods = () => async (dispatch: AppDispatch) => {
  try {
    const response = await api.get('/api/admin/payment-methods')
    dispatch(setPaymentMethods(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch payment methods'))
  }
}

export const processRefund = (paymentId: number, amount?: number, reason?: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true))
    
    const response = await api.post(`/api/admin/payments/${paymentId}/refund`, {
      amount,
      reason
    })
    
    dispatch(updatePayment(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to process refund'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const updatePaymentStatus = (paymentId: number, status: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true))
    
    const response = await api.put(`/api/admin/payments/${paymentId}/status`, {
      status
    })
    
    dispatch(updatePayment(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update payment status'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const bulkUpdatePaymentStatus = (paymentIds: number[], status: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setBulkActionLoading(true))
    
    await api.put('/api/admin/payments/bulk-status', {
      payment_ids: paymentIds,
      status
    })
    
    // Refresh payments
    dispatch(fetchPayments())
    dispatch(clearSelectedPayments())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update payment statuses'))
    throw error
  } finally {
    dispatch(setBulkActionLoading(false))
  }
}

export const exportPayments = () => async (dispatch: AppDispatch, getState: any) => {
  try {
    dispatch(setLoading(true))
    
    const { paymentFilter } = getState().adminPayments
    
    const params = new URLSearchParams({
      ...(paymentFilter.status !== 'all' && { status: paymentFilter.status }),
      ...(paymentFilter.payment_method !== 'all' && { payment_method: paymentFilter.payment_method }),
      ...(paymentFilter.date_range !== 'all' && { date_range: paymentFilter.date_range }),
      ...(paymentFilter.amount_min && { amount_min: paymentFilter.amount_min.toString() }),
      ...(paymentFilter.amount_max && { amount_max: paymentFilter.amount_max.toString() }),
      ...(paymentFilter.user_search && { user_search: paymentFilter.user_search }),
      ...(paymentFilter.transaction_id && { transaction_id: paymentFilter.transaction_id })
    })
    
    const response = await api.get(`/api/admin/payments/export?${params}`, {
      responseType: 'blob'
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `payments-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to export payments'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export default adminPaymentsSlice.reducer