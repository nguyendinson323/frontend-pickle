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

interface PartnerInfo {
  id: number
  business_name: string
  partner_type: string
  has_courts: boolean
  premium_expires_at: string | null
}

interface PartnerMembershipStats {
  profileViews: number
  leadsGenerated: number
  tournamentsSponsored: number
  averageRating: number
  partnerSince: string
  currentPlan: string
  planStatus: string
}

interface PartnerMembershipState {
  currentSubscription: Subscription | null
  availablePlans: SubscriptionPlan[]
  paymentHistory: Payment[]
  stats: PartnerMembershipStats | null
  partnerInfo: PartnerInfo | null
  loading: boolean
  error: string | null
}

const initialState: PartnerMembershipState = {
  currentSubscription: null,
  availablePlans: [],
  paymentHistory: [],
  stats: null,
  partnerInfo: null,
  loading: false,
  error: null
}

const partnerMembershipSlice = createSlice({
  name: 'partnerMembership',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setPartnerMembershipData: (state, action: PayloadAction<{
      currentSubscription: Subscription | null
      availablePlans: SubscriptionPlan[]
      paymentHistory: Payment[]
      stats: PartnerMembershipStats | null
      partnerInfo: PartnerInfo | null
    }>) => {
      state.currentSubscription = action.payload.currentSubscription
      state.availablePlans = action.payload.availablePlans
      state.paymentHistory = action.payload.paymentHistory
      state.stats = action.payload.stats
      state.partnerInfo = action.payload.partnerInfo
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
    clearPartnerMembershipData: (state) => {
      state.currentSubscription = null
      state.availablePlans = []
      state.paymentHistory = []
      state.stats = null
      state.partnerInfo = null
      state.loading = false
      state.error = null
    }
  }
})

export const {
  setLoading,
  setError,
  setPartnerMembershipData,
  updateCurrentSubscription,
  addPayment,
  cancelCurrentSubscription,
  clearError,
  clearPartnerMembershipData
} = partnerMembershipSlice.actions

// Response interfaces
interface PartnerMembershipResponse {
  currentSubscription: Subscription | null
  availablePlans: SubscriptionPlan[]
  paymentHistory: Payment[]
  stats: PartnerMembershipStats
  partnerInfo: PartnerInfo
}

interface SubscriptionResponse {
  subscription: Subscription
  payment: Payment
  message: string
}

// API Functions
export const fetchPartnerMembershipData = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    dispatch(setError(null))

    const response = await api.get<PartnerMembershipResponse>('/api/partner/membership')

    dispatch(setPartnerMembershipData({
      currentSubscription: response.data.currentSubscription,
      availablePlans: response.data.availablePlans,
      paymentHistory: response.data.paymentHistory,
      stats: response.data.stats,
      partnerInfo: response.data.partnerInfo
    }))

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch membership data'
    dispatch(setError(errorMessage))
  } finally {
    dispatch(setLoading(false))
  }
}

export const subscribeToPartnerPlan = (planId: number, paymentData: {
  payment_method: string
  billing_cycle: 'monthly' | 'yearly'
}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    dispatch(setError(null))

    const response = await api.post<SubscriptionResponse>('/api/partner/membership/subscribe', {
      planId,
      paymentData
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

export const cancelPartnerSubscription = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    dispatch(setError(null))

    await api.post('/api/partner/membership/cancel')

    dispatch(cancelCurrentSubscription())

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to cancel subscription'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const renewPartnerSubscription = (paymentData: {
  payment_method: string
  billing_cycle: 'monthly' | 'yearly'
}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    dispatch(setError(null))

    const response = await api.post<{ payment: Payment; message: string }>('/api/partner/membership/renew', {
      paymentData
    })

    if (response.data.payment) {
      dispatch(addPayment(response.data.payment))
    }

    // Refresh membership data to get updated subscription
    dispatch(fetchPartnerMembershipData())

    return response.data

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to renew subscription'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const updatePartnerPaymentMethod = (paymentMethodData: {
  type: string
  last4?: string
  brand?: string
}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    dispatch(setError(null))

    const response = await api.put('/api/partner/membership/payment-method', {
      paymentMethodData
    })

    return response.data

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update payment method'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const changePartnerPlan = (newPlanId: number, paymentData: {
  payment_method: string
  billing_cycle: 'monthly' | 'yearly'
}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    dispatch(setError(null))

    const response = await api.put<{ payment: Payment; message: string }>('/api/partner/membership/change-plan', {
      newPlanId,
      paymentData
    })

    if (response.data.payment) {
      dispatch(addPayment(response.data.payment))
    }

    // Refresh membership data to get updated subscription
    dispatch(fetchPartnerMembershipData())

    return response.data

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to change plan'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export default partnerMembershipSlice.reducer