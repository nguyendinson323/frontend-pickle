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
  transaction_date?: string
  created_at: string
  updated_at: string
}

interface CoachMembershipState {
  currentSubscription: Subscription | null
  availablePlans: SubscriptionPlan[]
  paymentHistory: Payment[]
  stats: {
    total_spent: number
    membership_since: string | null
    days_remaining: number
    status: string
    total_earnings: number
    students_taught: number
    sessions_completed: number
  } | null
  loading: boolean
  error: string | null
}

const initialState: CoachMembershipState = {
  currentSubscription: null,
  availablePlans: [],
  paymentHistory: [],
  stats: null,
  loading: false,
  error: null
}

const coachMembershipSlice = createSlice({
  name: 'coachMembership',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setMembershipData: (state, action: PayloadAction<{
      currentSubscription: Subscription | null
      availablePlans: SubscriptionPlan[]
      paymentHistory: Payment[]
      stats: CoachMembershipState['stats']
    }>) => {
      state.currentSubscription = action.payload.currentSubscription
      state.availablePlans = action.payload.availablePlans
      state.paymentHistory = action.payload.paymentHistory
      state.stats = action.payload.stats
    },
    updateSubscription: (state, action: PayloadAction<Subscription>) => {
      state.currentSubscription = action.payload
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.paymentHistory.unshift(action.payload)
    },
    cancelSubscription: (state) => {
      if (state.currentSubscription) {
        state.currentSubscription.status = 'canceled'
        state.currentSubscription.auto_renew = false
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setMembershipData,
  updateSubscription,
  addPayment,
  cancelSubscription
} = coachMembershipSlice.actions

// Define response interfaces
interface MembershipDataResponse {
  currentSubscription: Subscription | null
  availablePlans: SubscriptionPlan[]
  paymentHistory: Payment[]
  stats: CoachMembershipState['stats']
}

interface SubscriptionResponse {
  subscription: Subscription
  payment: Payment
}

// API Functions
export const fetchCoachMembershipData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    const response = await api.get<MembershipDataResponse>('/api/coach/membership')
    dispatch(setMembershipData(response.data))
    dispatch(setLoading(false))
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch membership data'))
    dispatch(setLoading(false))
  }
}

export const subscribeToCoachPlan = (planId: number, paymentData: {
  payment_method: string
  billing_cycle: 'monthly' | 'yearly'
}) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    const response = await api.post<SubscriptionResponse>('/api/coach/membership/subscribe', {
      plan_id: planId,
      ...paymentData
    })
    
    dispatch(updateSubscription(response.data.subscription))
    dispatch(addPayment(response.data.payment))
    dispatch(setLoading(false))
    
    return response.data
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to subscribe to plan'))
    dispatch(setLoading(false))
    throw error
  }
}

export const cancelCoachSubscription = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    await api.post('/api/coach/membership/cancel')
    dispatch(cancelSubscription())
    dispatch(setLoading(false))
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to cancel subscription'))
    dispatch(setLoading(false))
    throw error
  }
}

export const renewCoachSubscription = (planId: number, paymentData: {
  payment_method: string
  billing_cycle: 'monthly' | 'yearly'
}) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    const response = await api.post<SubscriptionResponse>('/api/coach/membership/renew', {
      plan_id: planId,
      ...paymentData
    })
    
    dispatch(updateSubscription(response.data.subscription))
    dispatch(addPayment(response.data.payment))
    dispatch(setLoading(false))
    
    return response.data
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to renew subscription'))
    dispatch(setLoading(false))
    throw error
  }
}

export const updateCoachPaymentMethod = (paymentMethodData: {
  payment_method: string
  stripe_payment_method_id?: string
}) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    const response = await api.put<{ subscription: Subscription }>('/api/coach/membership/payment-method', paymentMethodData)
    dispatch(updateSubscription(response.data.subscription))
    dispatch(setLoading(false))
    
    return response.data
  } catch (error: unknown) {
    dispatch(setError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update payment method'))
    dispatch(setLoading(false))
    throw error
  }
}

export default coachMembershipSlice.reducer