import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'
import {
  AuthState,
  User,
  Player,
  Coach,
  Club,
  Partner,
  StateCommittee,
  PlayerDashboard,
  CoachDashboard,
  ClubDashboard,
  PartnerDashboard,
  StateDashboard,
  AdminDashboard,
  LoginResponse,
  LoginRequest,
  PlayerRegisterRequest,
  CoachRegisterRequest,
  ClubRegisterRequest,
  PartnerRegisterRequest,
  StateRegisterRequest,
  RegisterResponse
} from '../../types/auth'

const initialState: AuthState = {
  user: null,
  profile: null,
  dashboard: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      console.log('🔍 Login Success - Full Response:', action.payload)
      console.log('👤 User Data:', action.payload.user)
      console.log('📊 Dashboard Data:', action.payload.dashboard)
      
      state.user = action.payload.user
      state.dashboard = action.payload.dashboard
      state.token = action.payload.token
      state.isAuthenticated = true
      state.isLoading = false
      localStorage.setItem('token', action.payload.token)
      
      console.log('✅ Redux State Updated - isAuthenticated:', state.isAuthenticated)
      console.log('✅ Redux State Updated - user role:', state.user?.role)
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    updateDashboard: (state, action: PayloadAction<PlayerDashboard | CoachDashboard | ClubDashboard | PartnerDashboard | StateDashboard | AdminDashboard>) => {
      state.dashboard = action.payload
    },
    logout: (state) => {
      state.user = null
      state.profile = null
      state.dashboard = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      localStorage.removeItem('token')
    },
    refreshDashboard: (state, action: PayloadAction<PlayerDashboard | CoachDashboard | ClubDashboard | PartnerDashboard | StateDashboard | AdminDashboard>) => {
      state.dashboard = action.payload
    }
  }
})

export const {
  setLoading,
  loginSuccess,
  updateUser,
  updateDashboard,
  logout,
  refreshDashboard
} = authSlice.actions

// Login function that handles the backend request
export const login = (credentials: LoginRequest) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Logging in...'))
  
  try {
    const response = await api.post('/api/auth/login', credentials)
    dispatch(loginSuccess(response.data as LoginResponse))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

// Register functions that handle backend requests
export const registerPlayer = (formData: PlayerRegisterRequest) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Creating player account...'))
  
  try {
    const registerData = {
      userData: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'player' as const,
        phone: formData.phoneNumber
      },
      profileData: {
        full_name: formData.fullName,
        birth_date: formData.birthDate,
        gender: formData.gender === 'male' ? 'Male' : formData.gender === 'female' ? 'Female' : 'Other',
        state_id: parseInt(formData.state),
        curp: formData.curp,
        nrtp_level: parseFloat(formData.nrtpLevel),
        profile_photo_url: formData.profilePhotoUrl,
        id_document_url: formData.idDocumentUrl,
        nationality: formData.nationality
      }
    }
    
    const response = await api.post('/api/auth/register', registerData)
    dispatch(loginSuccess(response.data as LoginResponse))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const registerCoach = (formData: CoachRegisterRequest) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Creating coach account...'))
  
  try {
    const registerData = {
      userData: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'coach' as const,
        phone: formData.phoneNumber
      },
      profileData: {
        full_name: formData.fullName,
        birth_date: formData.birthDate,
        gender: formData.gender === 'male' ? 'Male' : formData.gender === 'female' ? 'Female' : 'Other',
        state_id: parseInt(formData.state),
        curp: formData.curp,
        profile_photo_url: formData.profilePhotoUrl,
        id_document_url: formData.idDocumentUrl
      }
    }
    
    const response = await api.post('/api/auth/register', registerData)
    dispatch(loginSuccess(response.data as LoginResponse))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const registerClub = (formData: ClubRegisterRequest) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Creating club account...'))
  
  try {
    const registerData = {
      userData: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'club' as const,
        phone: formData.phoneNumber
      },
      profileData: {
        name: formData.clubName,
        manager_name: formData.managerName,
        manager_title: 'Manager',
        club_type: formData.clubType,
        rfc: formData.rfc,
        logo_url: formData.logoUrl,
        has_courts: false
      }
    }
    
    const response = await api.post('/api/auth/register', registerData)
    dispatch(loginSuccess(response.data as LoginResponse))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const registerPartner = (formData: PartnerRegisterRequest) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Creating partner account...'))
  
  try {
    const registerData = {
      userData: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'partner' as const,
        phone: formData.phoneNumber
      },
      profileData: {
        business_name: formData.businessName,
        contact_name: formData.contactPersonName,
        contact_title: 'Contact Person',
        partner_type: formData.partnerType,
        rfc: formData.rfc,
        logo_url: formData.businessLogoUrl,
        has_courts: true
      }
    }
    
    const response = await api.post('/api/auth/register', registerData)
    dispatch(loginSuccess(response.data as LoginResponse))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const registerState = (formData: StateRegisterRequest) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Creating state committee account...'))
  
  try {
    const registerData = {
      userData: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'state' as const,
        phone: formData.phoneNumber
      },
      profileData: {
        name: formData.committeeName,
        president_name: formData.presidentName,
        president_title: 'President',
        rfc: formData.rfc,
        state_id: parseInt(formData.stateCoverage),
        logo_url: formData.committeeLogoUrl,
        institutional_email: formData.institutionalDetails,
        phone: formData.phoneNumber
      }
    }
    
    const response = await api.post('/api/auth/register', registerData)
    dispatch(loginSuccess(response.data as LoginResponse))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

// Update functions for all user types
export const updatePlayerProfile = (profileData: Partial<Player>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating player profile...'))
  
  try {
    const response = await api.put('/api/auth/profile/player', profileData)
    dispatch(updateDashboard(response.data as PlayerDashboard))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const updateCoachProfile = (profileData: Partial<Coach>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating coach profile...'))
  
  try {
    const response = await api.put('/api/auth/profile/coach', profileData)
    dispatch(updateDashboard(response.data as CoachDashboard))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const updateClubProfile = (profileData: Partial<Club>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating club profile...'))
  
  try {
    const response = await api.put('/api/auth/profile/club', profileData)
    dispatch(updateDashboard(response.data as ClubDashboard))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const updatePartnerProfile = (profileData: Partial<Partner>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating partner profile...'))
  
  try {
    const response = await api.put('/api/auth/profile/partner', profileData)
    dispatch(updateDashboard(response.data as PartnerDashboard))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const updateStateProfile = (profileData: Partial<StateCommittee>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating state committee profile...'))
  
  try {
    const response = await api.put('/api/auth/profile/state', profileData)
    dispatch(updateDashboard(response.data as StateDashboard))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export default authSlice.reducer