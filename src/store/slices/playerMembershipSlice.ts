import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
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
  created_at: string
  updated_at: string
}

interface PlayerMembershipState {
  currentSubscription: Subscription | null
  availablePlans: SubscriptionPlan[]
  paymentHistory: Payment[]
  stats: {
    total_spent: number
    membership_since: string | null
    days_remaining: number
    status: string
  } | null
  loading: boolean
  error: string | null
}

const initialState: PlayerMembershipState = {
  currentSubscription: null,
  availablePlans: [],
  paymentHistory: [],
  stats: null,
  loading: false,
  error: null
}

const playerMembershipSlice = createSlice({
  name: 'playerMembership',
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
      stats: PlayerMembershipState['stats']
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
} = playerMembershipSlice.actions

// API Functions
export const fetchPlayerMembershipData = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading membership data...'))
  
  try {
    dispatch(setError(null))
    const response = await api.get('/api/player/membership')
    const responseData = response.data as {
      currentSubscription: Subscription | null
      availablePlans: SubscriptionPlan[]
      paymentHistory: Payment[]
      stats: PlayerMembershipState['stats']
    }
    dispatch(setMembershipData(responseData))
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch membership data'))
  } finally {
    dispatch(stopLoading())
  }
}

export const subscribeToPlan = (planId: number, paymentData: {
  payment_method: string
  billing_cycle: 'monthly' | 'yearly'
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Subscribing to plan...'))
  
  try {
    dispatch(setError(null))
    const response = await api.post('/api/player/membership/subscribe', {
      plan_id: planId,
      ...paymentData
    })
    
    const responseData = response.data as { subscription: Subscription; payment: Payment }
    dispatch(updateSubscription(responseData.subscription))
    dispatch(addPayment(responseData.payment))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to subscribe to plan'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const cancelPlayerSubscription = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Canceling subscription...'))
  
  try {
    dispatch(setError(null))
    await api.post('/api/player/membership/cancel')
    dispatch(cancelSubscription())
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to cancel subscription'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const renewSubscription = (planId: number, paymentData: {
  payment_method: string
  billing_cycle: 'monthly' | 'yearly'
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Renewing subscription...'))
  
  try {
    dispatch(setError(null))
    const response = await api.post('/api/player/membership/renew', {
      plan_id: planId,
      ...paymentData
    })
    
    const responseData = response.data as { subscription: Subscription; payment: Payment }
    dispatch(updateSubscription(responseData.subscription))
    dispatch(addPayment(responseData.payment))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to renew subscription'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const updatePaymentMethod = (paymentMethodData: {
  payment_method: string
  stripe_payment_method_id?: string
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating payment method...'))
  
  try {
    dispatch(setError(null))
    const response = await api.put('/api/player/membership/payment-method', paymentMethodData)
    const responseData = response.data as { subscription: Subscription }
    dispatch(updateSubscription(responseData.subscription))
    
    return response.data
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to update payment method'))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export default playerMembershipSlice.reducer