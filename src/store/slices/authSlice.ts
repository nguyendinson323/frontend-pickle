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
      state.user = action.payload.user
      state.dashboard = action.payload.dashboard
      state.token = action.payload.token
      state.isAuthenticated = true
      state.isLoading = false
      localStorage.setItem('token', action.payload.token)
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
    },
    updateProfileImage: (state, action: PayloadAction<{ imageType: string, imageUrl: string }>) => {
      console.log('🔄 Redux updateProfileImage called:', {
        imageType: action.payload.imageType,
        imageUrl: action.payload.imageUrl,
        dashboardStructure: state.dashboard ? Object.keys(state.dashboard) : 'No dashboard'
      })

      // Based on database schema: User table has NO image fields
      // Image fields are in profile tables (Player, Coach, Club, etc.)
      // Dashboard structure: { profile: PlayerRecord, stats: {...}, ... }

      if (state.dashboard) {
        const dashboard = state.dashboard as any

        // The correct location is dashboard.profile which contains the Player/Coach/Club record
        if (dashboard.profile) {
          dashboard.profile[action.payload.imageType] = action.payload.imageUrl
          console.log('✅ Updated dashboard.profile (correct location):', {
            [action.payload.imageType]: action.payload.imageUrl,
            profileKeys: Object.keys(dashboard.profile)
          })
        } else {
          console.log('❌ No dashboard.profile found. Dashboard keys:', Object.keys(dashboard))
        }
      } else {
        console.log('❌ No dashboard found in Redux state')
      }

      // For registration, temporarily store in user object until registration completes
      if (state.user && !state.dashboard) {
        (state.user as any)[action.payload.imageType] = action.payload.imageUrl
        console.log('✅ Temporarily stored in user object for registration:', { [action.payload.imageType]: action.payload.imageUrl })
      }
    }
  },
})

export const {
  setLoading,
  loginSuccess,
  updateUser,
  updateDashboard,
  logout,
  refreshDashboard,
  updateProfileImage
} = authSlice.actions

// Login function that handles the backend request with complete error handling
export const login = (credentials: LoginRequest) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Logging in...'))
  
  try {
    const response = await api.post('/api/auth/login', credentials)
    
    // Validate response structure BEFORE dispatching
    if (!response.data) {
      console.error('❌ No data in response')
      return { error: 'No data received from server' }
    }
    
    // Type guard to check if response has required fields
    const responseData = response.data as any
    if (!responseData.user || !responseData.token) {
      console.error('❌ Invalid response structure:', responseData)
      return { error: 'Invalid response structure from server' }
    }
    
    // Only dispatch success if we have valid data
    dispatch(loginSuccess(response.data as LoginResponse))
    return response.data
    
  } catch (error: any) {
    // Stop loading on any error
    console.error('❌ Login API Error:', error)
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`
      console.error('❌ Server error:', errorMessage)
      return { error: errorMessage }
    } else if (error.request) {
      // Request made but no response
      console.error('❌ No response from server')
      return { error: 'No response from server. Please check your connection.' }
    } else {
      // Something else happened
      console.error('❌ Request error:', error.message)
      return { error: error.message || 'An unexpected error occurred' }
    }
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
        gender: formData.gender,
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
        gender: formData.gender,
        state_id: parseInt(formData.state),
        curp: formData.curp,
        nrtp_level: formData.nrtpLevel,
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
        state_id: formData.state ? parseInt(formData.state) : null,
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
        state_id: parseInt(formData.state),
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
        state_id: formData.stateCoverage ? parseInt(formData.stateCoverage) : null,
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
    const response = await api.put('/api/player/profile', profileData)
    // Refresh dashboard to get updated data
    await dispatch(fetchDashboard('player'))
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

export const updateClubProfile = (profileData: Partial<Club> & { user_data?: Partial<User> }) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating club profile...'))

  try {
    const response = await api.put('/api/auth/profile/club', profileData)
    const dashboardData = response.data as ClubDashboard

    // Update both dashboard and user data if user_data was provided
    // Note: Backend updates user data but doesn't return it in the response.
    // The dashboard refresh includes the latest user info in the auth flow.
    if (profileData.user_data) {
      console.log('✅ User data updated on backend, will be reflected in next dashboard refresh')
    }

    dispatch(updateDashboard(dashboardData))
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

// Update admin profile
export const updateAdminProfile = (profileData: Partial<User>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating administrator profile...'))
  
  try {
    const response = await api.put<{user: User}>('/api/admin/profile', profileData)
    dispatch(updateUser(response.data.user))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

// Change admin password
export const changeAdminPassword = (passwordData: { currentPassword: string, newPassword: string }) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Changing password...'))
  
  try {
    const response = await api.put('/api/admin/profile/password', passwordData)
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

// Update admin security settings
export const updateAdminSecuritySettings = (securityData: { is_searchable: boolean }) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating security settings...'))
  
  try {
    const response = await api.put<{user: User}>('/api/admin/profile/security', securityData)
    dispatch(updateUser(response.data.user))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

// Fetch dashboard data for current user  
const fetchDashboard = (userRole: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading dashboard...'))
  
  try {
    let response
    switch (userRole) {
      case 'player':
        response = await api.get('/api/player/dashboard')
        break
      case 'coach':
        response = await api.get('/api/coach/dashboard')
        break
      case 'club':
        response = await api.get('/api/club/dashboard')
        break
      case 'partner':
        response = await api.get('/api/partner/dashboard')
        break
      case 'state':
        response = await api.get('/api/state/dashboard')
        break
      case 'admin':
        response = await api.get('/api/admin/dashboard')
        break
      default:
        throw new Error('Invalid user role')
    }
    
    dispatch(updateDashboard(response.data as PlayerDashboard | CoachDashboard | ClubDashboard | PartnerDashboard | StateDashboard | AdminDashboard))
    return response.data
  } catch (error) {
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

// Unified file upload function that handles all file types
export const uploadFile = (
  file: File | Blob,
  fileType: 'image' | 'document',
  fieldName: string
) => async (dispatch: AppDispatch) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileType', fileType)
    formData.append('fieldName', fieldName)

    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    const { secure_url } = response.data as { secure_url: string }

    // Immediately update user profile and dashboard with the new file URL
    dispatch(updateProfileImage({
      imageType: fieldName as any,
      imageUrl: secure_url
    }))

    return response.data
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}

// Export fetchDashboard function
export { fetchDashboard }

export default authSlice.reducer