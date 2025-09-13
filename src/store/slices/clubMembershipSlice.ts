import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import api from '../../services/api'

interface SubscriptionPlan {
  id: number
  name: string
  description: string
  for_role: string
  monthly_price: number
  yearly_price: number
  features: string
  is_active: boolean
  created_at: string
}

interface Subscription {
  id: number
  user_id: number
  plan_id: number
  start_date: string
  end_date: string
  status: 'active' | 'canceled' | 'expired'
  auto_renew: boolean
  stripe_subscription_id: string | null
  payment_id: number | null
  created_at: string
  updated_at: string
  plan: SubscriptionPlan
}

interface Payment {
  id: number
  user_id: number
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_type: string
  payment_method: string
  reference_type: string
  reference_id: number | null
  stripe_payment_id: string | null
  transaction_date: string
  created_at: string
  updated_at: string
}

interface ClubInfo {
  id: number
  name: string
  has_courts: boolean
  premium_expires_at: string | null
  affiliation_expires_at: string | null
}

interface ClubMembershipStats {
  total_spent: number
  membership_since: string | null
  days_remaining: number
  status: string
  has_premium: boolean
  premium_expires_at: string | null
  affiliation_expires_at: string | null
  has_courts: boolean
}

interface ClubMembershipState {
  currentSubscription: Subscription | null
  availablePlans: SubscriptionPlan[]
  paymentHistory: Payment[]
  stats: ClubMembershipStats | null
  clubInfo: ClubInfo | null
  loading: boolean
  error: string | null
}

const initialState: ClubMembershipState = {
  currentSubscription: null,
  availablePlans: [],
  paymentHistory: [],
  stats: null,
  clubInfo: null,
  loading: false,
  error: null
}

const clubMembershipSlice = createSlice({
  name: 'clubMembership',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setClubMembershipData: (state, action: PayloadAction<{
      currentSubscription: Subscription | null
      availablePlans: SubscriptionPlan[]
      paymentHistory: Payment[]
      stats: ClubMembershipStats | null
      clubInfo: ClubInfo | null
    }>) => {
      state.currentSubscription = action.payload.currentSubscription
      state.availablePlans = action.payload.availablePlans
      state.paymentHistory = action.payload.paymentHistory
      state.stats = action.payload.stats
      state.clubInfo = action.payload.clubInfo
    },
    updateCurrentSubscription: (state, action: PayloadAction<Subscription>) => {
      state.currentSubscription = action.payload
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.paymentHistory.unshift(action.payload)
    },
    cancelCurrentSubscription: (state) => {
      if (state.currentSubscription) {
        state.currentSubscription.status = 'canceled'
        state.currentSubscription.auto_renew = false
      }
    },
    clearError: (state) => {
      state.error = null
    },
    clearClubMembershipData: (state) => {
      state.currentSubscription = null
      state.availablePlans = []
      state.paymentHistory = []
      state.stats = null
      state.clubInfo = null
      state.loading = false
      state.error = null
    }
  }
})

export const {
  setLoading,
  setError,
  setClubMembershipData,
  updateCurrentSubscription,
  addPayment,
  cancelCurrentSubscription,
  clearError,
  clearClubMembershipData
} = clubMembershipSlice.actions

// Response interfaces
interface ClubMembershipResponse {
  currentSubscription: Subscription | null
  availablePlans: SubscriptionPlan[]
  paymentHistory: Payment[]
  stats: ClubMembershipStats
  clubInfo: ClubInfo
}

interface SubscriptionResponse {
  subscription: Subscription
  payment: Payment
  message: string
}

// API Functions
export const fetchClubMembershipData = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  
  try {
    dispatch(setError(null))
    
    const response = await api.get<ClubMembershipResponse>('/api/club/membership')
    
    dispatch(setClubMembershipData({
      currentSubscription: response.data.currentSubscription,
      availablePlans: response.data.availablePlans,
      paymentHistory: response.data.paymentHistory,
      stats: response.data.stats,
      clubInfo: response.data.clubInfo
    }))
    
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch membership data'
    dispatch(setError(errorMessage))
  } finally {
    dispatch(setLoading(false))
  }
}

export const subscribeToClubPlan = (planId: number, paymentData: {
  payment_method: string
  billing_cycle: 'monthly' | 'yearly'
}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  
  try {
    dispatch(setError(null))
    
    const response = await api.post<SubscriptionResponse>('/api/club/membership/subscribe', {
      plan_id: planId,
      ...paymentData
    })
    
    dispatch(updateCurrentSubscription(response.data.subscription))
    if (response.data.payment) {
      dispatch(addPayment(response.data.payment))
    }
    
    return response.data
    
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to subscribe to plan'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const cancelClubSubscription = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  
  try {
    dispatch(setError(null))
    
    await api.post('/api/club/membership/cancel')
    
    dispatch(cancelCurrentSubscription())
    
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to cancel subscription'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const renewClubSubscription = (planId: number, paymentData: {
  payment_method: string
  billing_cycle: 'monthly' | 'yearly'
}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  
  try {
    dispatch(setError(null))
    
    const response = await api.post<SubscriptionResponse>('/api/club/membership/renew', {
      plan_id: planId,
      ...paymentData
    })
    
    dispatch(updateCurrentSubscription(response.data.subscription))
    if (response.data.payment) {
      dispatch(addPayment(response.data.payment))
    }
    
    return response.data
    
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to renew subscription'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateClubPaymentMethod = (paymentMethodData: {
  payment_method: string
  stripe_payment_method_id?: string
}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  
  try {
    dispatch(setError(null))
    
    const response = await api.put<{ subscription: Subscription; message: string }>('/api/club/membership/payment-method', paymentMethodData)
    
    dispatch(updateCurrentSubscription(response.data.subscription))
    
    return response.data
    
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update payment method'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const changeClubPlan = (planId: number, billingCycle: 'monthly' | 'yearly') => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  
  try {
    dispatch(setError(null))
    
    const response = await api.put<SubscriptionResponse>('/api/club/membership/change-plan', {
      plan_id: planId,
      billing_cycle: billingCycle
    })
    
    dispatch(updateCurrentSubscription(response.data.subscription))
    if (response.data.payment) {
      dispatch(addPayment(response.data.payment))
    }
    
    return response.data
    
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to change plan'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export default clubMembershipSlice.reducer