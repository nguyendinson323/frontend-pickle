import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import api from '../../services/api'

interface StateCommittee {
  id: number
  name: string
  president_name: string
  president_title: string
  state_id: number
  logo_url: string | null
  website: string | null
  social_media: string | null
  institutional_email: string | null
  phone: string | null
  affiliation_expires_at: string
  created_at: string
}

interface AffiliationStatus {
  isActive: boolean
  expiresAt: string
  daysRemaining: number
  memberSince: string
  annualFee: number
}

interface StateStatistics {
  registeredPlayers: number
  affiliatedClubs: number
  certifiedCoaches: number
  annualTournaments: number
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

interface RecentActivity {
  id: number
  name: string
  start_date: string
  created_at: string
  status: string
}

interface ComplianceRequirement {
  name: string
  description: string
  dueDate: string
  frequency: string
}

interface ComplianceStatus {
  annualReport: {
    completed: boolean
    completedDate: string
    dueDate: string
  }
  insurance: {
    valid: boolean
    validUntil: string
  }
  boardElections: {
    completed: boolean
    completedDate: string
    nextDue: string
  }
  quarterlyReview: {
    completed: boolean
    dueDate: string
  }
}

interface AffiliationRequirements {
  annualFee: number
  currency: string
  paymentSchedule: string
  benefits: string[]
  complianceRequirements: ComplianceRequirement[]
}

interface StateMembershipState {
  stateCommittee: StateCommittee | null
  affiliationStatus: AffiliationStatus | null
  stateStatistics: StateStatistics | null
  paymentHistory: Payment[]
  recentActivities: RecentActivity[]
  complianceStatus: ComplianceStatus | null
  affiliationRequirements: AffiliationRequirements | null
  loading: boolean
  error: string | null
}

const initialState: StateMembershipState = {
  stateCommittee: null,
  affiliationStatus: null,
  stateStatistics: null,
  paymentHistory: [],
  recentActivities: [],
  complianceStatus: null,
  affiliationRequirements: null,
  loading: false,
  error: null
}

const stateMembershipSlice = createSlice({
  name: 'stateMembership',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setStateMembershipData: (state, action: PayloadAction<{
      stateCommittee: StateCommittee
      affiliationStatus: AffiliationStatus
      stateStatistics: StateStatistics
      paymentHistory: Payment[]
      recentActivities: RecentActivity[]
      complianceStatus: ComplianceStatus
    }>) => {
      state.stateCommittee = action.payload.stateCommittee
      state.affiliationStatus = action.payload.affiliationStatus
      state.stateStatistics = action.payload.stateStatistics
      state.paymentHistory = action.payload.paymentHistory
      state.recentActivities = action.payload.recentActivities
      state.complianceStatus = action.payload.complianceStatus
    },
    setAffiliationRequirements: (state, action: PayloadAction<AffiliationRequirements>) => {
      state.affiliationRequirements = action.payload
    },
    updateAffiliationStatus: (state, action: PayloadAction<AffiliationStatus>) => {
      state.affiliationStatus = action.payload
    },
    updateStateCommitteeInfo: (state, action: PayloadAction<Partial<StateCommittee>>) => {
      if (state.stateCommittee) {
        state.stateCommittee = { ...state.stateCommittee, ...action.payload }
      }
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.paymentHistory.unshift(action.payload)
    },
    clearError: (state) => {
      state.error = null
    },
    clearStateMembershipData: (state) => {
      state.stateCommittee = null
      state.affiliationStatus = null
      state.stateStatistics = null
      state.paymentHistory = []
      state.recentActivities = []
      state.complianceStatus = null
      state.loading = false
      state.error = null
    }
  }
})

export const {
  setLoading,
  setError,
  setStateMembershipData,
  setAffiliationRequirements,
  updateAffiliationStatus,
  updateStateCommitteeInfo,
  addPayment,
  clearError,
  clearStateMembershipData
} = stateMembershipSlice.actions

// Response interfaces
interface StateMembershipResponse {
  stateCommittee: StateCommittee
  affiliationStatus: AffiliationStatus
  stateStatistics: StateStatistics
  paymentHistory: Payment[]
  recentActivities: RecentActivity[]
  complianceStatus: ComplianceStatus
}

interface AffiliationRenewalResponse {
  payment: Payment
  newExpirationDate: string
  affiliationStatus: AffiliationStatus
  message: string
}

// API Functions
export const fetchStateMembershipData = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    dispatch(setError(null))

    const response = await api.get<StateMembershipResponse>('/api/state/membership')

    dispatch(setStateMembershipData({
      stateCommittee: response.data.stateCommittee,
      affiliationStatus: response.data.affiliationStatus,
      stateStatistics: response.data.stateStatistics,
      paymentHistory: response.data.paymentHistory,
      recentActivities: response.data.recentActivities,
      complianceStatus: response.data.complianceStatus
    }))

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch state membership data'
    dispatch(setError(errorMessage))
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchAffiliationRequirements = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setError(null))

    const response = await api.get<AffiliationRequirements>('/api/state/affiliation/requirements')
    dispatch(setAffiliationRequirements(response.data))

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch affiliation requirements'
    dispatch(setError(errorMessage))
  }
}

export const renewStateAffiliation = (paymentData: {
  payment_method: string
}) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    dispatch(setError(null))

    const response = await api.post<AffiliationRenewalResponse>('/api/state/membership/renew', {
      paymentData
    })

    dispatch(updateAffiliationStatus(response.data.affiliationStatus))
    if (response.data.payment) {
      dispatch(addPayment(response.data.payment))
    }

    return response.data

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to renew affiliation'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const submitComplianceReport = (reportType: string, reportData: any) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    dispatch(setError(null))

    const response = await api.post('/api/state/membership/compliance-report', {
      reportType,
      reportData
    })

    // Refresh membership data to get updated compliance status
    dispatch(fetchStateMembershipData())

    return response.data

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to submit compliance report'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateStateCommitteeInformation = (updateData: Partial<StateCommittee>) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  try {
    dispatch(setError(null))

    const response = await api.put('/api/state/membership/info', updateData)

    dispatch(updateStateCommitteeInfo(updateData))

    return response.data

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update state committee information'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(setLoading(false))
  }
}

export default stateMembershipSlice.reducer