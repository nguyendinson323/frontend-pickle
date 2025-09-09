import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

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

// API Functions
export const fetchCoachMembershipData = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.get('/api/coach/membership')
    dispatch(setMembershipData(response.data))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch membership data'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const subscribeToCoachPlan = (planId: number, paymentData: {
  payment_method: string
  billing_cycle: 'monthly' | 'yearly'
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.post('/api/coach/membership/subscribe', {
      plan_id: planId,
      ...paymentData
    })
    
    dispatch(updateSubscription(response.data.subscription))
    dispatch(addPayment(response.data.payment))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to subscribe to plan'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const cancelCoachSubscription = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    await axios.post('/api/coach/membership/cancel')
    dispatch(cancelSubscription())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to cancel subscription'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const renewCoachSubscription = (planId: number, paymentData: {
  payment_method: string
  billing_cycle: 'monthly' | 'yearly'
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.post('/api/coach/membership/renew', {
      plan_id: planId,
      ...paymentData
    })
    
    dispatch(updateSubscription(response.data.subscription))
    dispatch(addPayment(response.data.payment))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to renew subscription'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateCoachPaymentMethod = (paymentMethodData: {
  payment_method: string
  stripe_payment_method_id?: string
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    dispatch(setError(null))
    
    const response = await axios.put('/api/coach/membership/payment-method', paymentMethodData)
    dispatch(updateSubscription(response.data.subscription))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update payment method'))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export default coachMembershipSlice.reducer