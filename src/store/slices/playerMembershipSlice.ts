import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
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

// Async thunks
export const fetchPlayerMembershipData = createAsyncThunk(
  'playerMembership/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/player/membership')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch membership data')
    }
  }
)

export const subscribeToPlan = createAsyncThunk(
  'playerMembership/subscribe',
  async ({ planId, paymentData }: {
    planId: number
    paymentData: {
      payment_method: string
      billing_cycle: 'monthly' | 'yearly'
    }
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/player/membership/subscribe', {
        plan_id: planId,
        ...paymentData
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to subscribe to plan')
    }
  }
)

export const cancelPlayerSubscription = createAsyncThunk(
  'playerMembership/cancel',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/player/membership/cancel')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel subscription')
    }
  }
)

export const renewSubscription = createAsyncThunk(
  'playerMembership/renew',
  async ({ planId, paymentData }: {
    planId: number
    paymentData: {
      payment_method: string
      billing_cycle: 'monthly' | 'yearly'
    }
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/player/membership/renew', {
        plan_id: planId,
        ...paymentData
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to renew subscription')
    }
  }
)

export const updatePaymentMethod = createAsyncThunk(
  'playerMembership/updatePaymentMethod',
  async (paymentMethodData: {
    payment_method: string
    stripe_payment_method_id?: string
  }, { rejectWithValue }) => {
    try {
      const response = await api.put('/api/player/membership/payment-method', paymentMethodData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update payment method')
    }
  }
)

const playerMembershipSlice = createSlice({
  name: 'playerMembership',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch membership data
      .addCase(fetchPlayerMembershipData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPlayerMembershipData.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload as {
          currentSubscription: Subscription | null
          availablePlans: SubscriptionPlan[]
          paymentHistory: Payment[]
          stats: PlayerMembershipState['stats']
        }
        state.currentSubscription = payload.currentSubscription
        state.availablePlans = payload.availablePlans
        state.paymentHistory = payload.paymentHistory
        state.stats = payload.stats
      })
      .addCase(fetchPlayerMembershipData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Subscribe to plan
      .addCase(subscribeToPlan.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(subscribeToPlan.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload as { subscription: Subscription; payment: Payment }
        state.currentSubscription = payload.subscription
        if (payload.payment) {
          state.paymentHistory.unshift(payload.payment)
        }
      })
      .addCase(subscribeToPlan.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Cancel subscription
      .addCase(cancelPlayerSubscription.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(cancelPlayerSubscription.fulfilled, (state) => {
        state.loading = false
        if (state.currentSubscription) {
          state.currentSubscription.status = 'canceled'
          state.currentSubscription.auto_renew = false
        }
      })
      .addCase(cancelPlayerSubscription.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Renew subscription
      .addCase(renewSubscription.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(renewSubscription.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload as { subscription: Subscription; payment: Payment }
        state.currentSubscription = payload.subscription
        if (payload.payment) {
          state.paymentHistory.unshift(payload.payment)
        }
      })
      .addCase(renewSubscription.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Update payment method
      .addCase(updatePaymentMethod.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePaymentMethod.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload as { subscription: Subscription }
        state.currentSubscription = payload.subscription
      })
      .addCase(updatePaymentMethod.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError } = playerMembershipSlice.actions

export default playerMembershipSlice.reducer