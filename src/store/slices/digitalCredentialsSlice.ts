import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import axios from 'axios'

const BASE_URL = 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export interface DigitalCredential {
  id: number
  player_id: number
  credential_type: 'player_card' | 'tournament_badge' | 'certification' | 'membership_card'
  title: string
  description: string | null
  issue_date: string
  expiry_date: string | null
  qr_code_data: string
  qr_code_url: string | null
  metadata: Record<string, any> | null
  is_active: boolean
  created_at: string
  updated_at: string
  tournament?: {
    id: number
    name: string
    level: string
  } | null
  certification?: {
    id: number
    name: string
    issuer: string
    level: string
  } | null
}

export interface PlayerProfile {
  id: number
  full_name: string
  email: string
  skill_level: string
  profile_image: string | null
  club: {
    id: number
    name: string
  } | null
}

export interface CredentialTemplate {
  type: 'player_card' | 'tournament_badge' | 'certification' | 'membership_card'
  name: string
  description: string
  required_fields: string[]
  template_data: Record<string, any>
}

export interface DigitalCredentialsState {
  credentials: DigitalCredential[]
  selectedCredential: DigitalCredential | null
  playerProfile: PlayerProfile | null
  templates: CredentialTemplate[]
  isLoading: boolean
  error: string | null
  qrCodeModal: {
    isOpen: boolean
    credentialId: number | null
    qrCodeUrl: string | null
  }
  createCredentialModal: {
    isOpen: boolean
    selectedTemplate: CredentialTemplate | null
    formData: Record<string, any>
  }
}

const initialState: DigitalCredentialsState = {
  credentials: [],
  selectedCredential: null,
  playerProfile: null,
  templates: [],
  isLoading: false,
  error: null,
  qrCodeModal: {
    isOpen: false,
    credentialId: null,
    qrCodeUrl: null
  },
  createCredentialModal: {
    isOpen: false,
    selectedTemplate: null,
    formData: {}
  }
}

const digitalCredentialsSlice = createSlice({
  name: 'digitalCredentials',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setCredentials: (state, action: PayloadAction<DigitalCredential[]>) => {
      state.credentials = action.payload
    },
    setSelectedCredential: (state, action: PayloadAction<DigitalCredential | null>) => {
      state.selectedCredential = action.payload
    },
    setPlayerProfile: (state, action: PayloadAction<PlayerProfile | null>) => {
      state.playerProfile = action.payload
    },
    setTemplates: (state, action: PayloadAction<CredentialTemplate[]>) => {
      state.templates = action.payload
    },
    addCredential: (state, action: PayloadAction<DigitalCredential>) => {
      state.credentials.unshift(action.payload)
    },
    updateCredential: (state, action: PayloadAction<DigitalCredential>) => {
      const index = state.credentials.findIndex(cred => cred.id === action.payload.id)
      if (index !== -1) {
        state.credentials[index] = action.payload
      }
    },
    removeCredential: (state, action: PayloadAction<number>) => {
      state.credentials = state.credentials.filter(cred => cred.id !== action.payload)
    },
    openQrCodeModal: (state, action: PayloadAction<{
      credentialId: number
      qrCodeUrl: string
    }>) => {
      state.qrCodeModal = {
        isOpen: true,
        credentialId: action.payload.credentialId,
        qrCodeUrl: action.payload.qrCodeUrl
      }
    },
    closeQrCodeModal: (state) => {
      state.qrCodeModal = {
        isOpen: false,
        credentialId: null,
        qrCodeUrl: null
      }
    },
    openCreateCredentialModal: (state, action: PayloadAction<CredentialTemplate>) => {
      state.createCredentialModal = {
        isOpen: true,
        selectedTemplate: action.payload,
        formData: {}
      }
    },
    closeCreateCredentialModal: (state) => {
      state.createCredentialModal = {
        isOpen: false,
        selectedTemplate: null,
        formData: {}
      }
    },
    updateCreateCredentialFormData: (state, action: PayloadAction<Record<string, any>>) => {
      state.createCredentialModal.formData = {
        ...state.createCredentialModal.formData,
        ...action.payload
      }
    },
    clearDigitalCredentials: (state) => {
      state.credentials = []
      state.selectedCredential = null
      state.playerProfile = null
      state.templates = []
      state.error = null
      state.qrCodeModal = {
        isOpen: false,
        credentialId: null,
        qrCodeUrl: null
      }
      state.createCredentialModal = {
        isOpen: false,
        selectedTemplate: null,
        formData: {}
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setCredentials,
  setSelectedCredential,
  setPlayerProfile,
  setTemplates,
  addCredential,
  updateCredential,
  removeCredential,
  openQrCodeModal,
  closeQrCodeModal,
  openCreateCredentialModal,
  closeCreateCredentialModal,
  updateCreateCredentialFormData,
  clearDigitalCredentials
} = digitalCredentialsSlice.actions

// Get player's digital credentials
export const fetchPlayerCredentials = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading credentials...'))
  
  try {
    const response = await apiClient.get<DigitalCredential[]>('/api/digital-credentials/player')
    dispatch(setCredentials(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load credentials'))
    dispatch(stopLoading())
    throw error
  }
}

// Get player profile for credential creation
export const fetchPlayerProfile = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading profile...'))
  
  try {
    const response = await apiClient.get<PlayerProfile>('/api/digital-credentials/profile')
    dispatch(setPlayerProfile(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load profile'))
    dispatch(stopLoading())
    throw error
  }
}

// Get available credential templates
export const fetchCredentialTemplates = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading templates...'))
  
  try {
    const response = await apiClient.get<CredentialTemplate[]>('/api/digital-credentials/templates')
    dispatch(setTemplates(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load templates'))
    dispatch(stopLoading())
    throw error
  }
}

// Create a new digital credential
export const createDigitalCredential = (credentialData: {
  credential_type: string
  title: string
  description?: string
  expiry_date?: string
  metadata?: Record<string, any>
}) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Creating credential...'))
  
  try {
    const response = await apiClient.post<DigitalCredential>('/api/digital-credentials/create', credentialData)
    dispatch(addCredential(response.data))
    dispatch(closeCreateCredentialModal())
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to create credential'))
    dispatch(stopLoading())
    throw error
  }
}

// Generate QR code for a credential
export const generateCredentialQrCode = (credentialId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Generating QR code...'))
  
  try {
    const response = await apiClient.post<{qr_code_url: string}>(`/api/digital-credentials/${credentialId}/qr-code`)
    
    // Update the credential with the new QR code URL
    const credentialsResponse = await apiClient.get<DigitalCredential[]>('/api/digital-credentials/player')
    dispatch(setCredentials(credentialsResponse.data))
    
    dispatch(openQrCodeModal({
      credentialId,
      qrCodeUrl: response.data.qr_code_url
    }))
    dispatch(stopLoading())
    return response.data.qr_code_url
  } catch (error) {
    dispatch(setError('Failed to generate QR code'))
    dispatch(stopLoading())
    throw error
  }
}

// Verify a credential using QR code
export const verifyCredential = (qrCodeData: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Verifying credential...'))
  
  try {
    const response = await apiClient.post<{
      valid: boolean
      credential: DigitalCredential | null
      message: string
    }>('/api/digital-credentials/verify', { qr_code_data: qrCodeData })
    
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to verify credential'))
    dispatch(stopLoading())
    throw error
  }
}

// Update credential status (activate/deactivate)
export const updateCredentialStatus = (credentialId: number, isActive: boolean) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating credential...'))
  
  try {
    const response = await apiClient.put<DigitalCredential>(`/api/digital-credentials/${credentialId}/status`, {
      is_active: isActive
    })
    dispatch(updateCredential(response.data))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to update credential'))
    dispatch(stopLoading())
    throw error
  }
}

// Delete a credential
export const deleteCredential = (credentialId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Deleting credential...'))
  
  try {
    await apiClient.delete(`/api/digital-credentials/${credentialId}`)
    dispatch(removeCredential(credentialId))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to delete credential'))
    dispatch(stopLoading())
    throw error
  }
}

export default digitalCredentialsSlice.reducer