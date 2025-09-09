import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'

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
  metadata: Record<string, string | number | boolean> | null
  is_active: boolean
  verification_count: number
  last_verified_at: string | null
  created_at: string
  updated_at: string
  tournament: {
    id: number
    name: string
    tournament_type: string
  } | null
  certification: {
    id: number
    name: string
    issuer: string
  } | null
}

export interface PlayerProfile {
  id: number
  user_id: number
  full_name: string
  nrtp_level: number | null
  profile_photo_url: string | null
  nationality: string
  ranking_position: number | null
  affiliation_expires_at: string | null
  state: {
    id: number
    name: string
    short_code: string
  } | null
  club: {
    id: number
    name: string
  } | null
  username: string
  email: string
  phone: string | null
  is_premium: boolean
  is_verified: boolean
}

export interface CredentialTemplate {
  id: number
  name: string
  type: 'player_card' | 'tournament_badge' | 'certification' | 'membership_card'
  description: string
  template_config: Record<string, string | number | boolean | object>
  background_url: string | null
  logo_url: string | null
  design_elements: Record<string, string | number | boolean>
  required_fields: string[]
}

export interface CreateCredentialData {
  credential_type: 'player_card' | 'tournament_badge' | 'certification' | 'membership_card'
  title: string
  description?: string
  expiry_date?: string
  tournament_id?: number
  certification_id?: number
  metadata?: Record<string, string | number | boolean>
}

export interface VerificationResult {
  valid: boolean
  message?: string
  credential?: {
    id: number
    credential_type: string
    title: string
    description: string | null
    issue_date: string
    expiry_date: string | null
    is_expired: boolean
    verification_count: number
    player: {
      id: number
      full_name: string
      nrtp_level: number | null
      profile_photo_url: string | null
      nationality: string
      ranking_position: number | null
      state: string | null
      club: string
    }
    tournament: {
      name: string
      tournament_type: string
      start_date: string
    } | null
    certification: {
      name: string
      issuer: string
      issue_date: string
    } | null
  }
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
    formData: Record<string, string>
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
    setSelectedCredential: (state, action: PayloadAction<DigitalCredential | null>) => {
      state.selectedCredential = action.payload
    },
    setPlayerProfile: (state, action: PayloadAction<PlayerProfile | null>) => {
      state.playerProfile = action.payload
    },
    setTemplates: (state, action: PayloadAction<CredentialTemplate[]>) => {
      state.templates = action.payload
    },
    openQrCodeModal: (state, action: PayloadAction<{ credentialId: number; qrCodeUrl: string }>) => {
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
    updateCreateCredentialFormData: (state, action: PayloadAction<Record<string, string>>) => {
      state.createCredentialModal.formData = {
        ...state.createCredentialModal.formData,
        ...action.payload
      }
    }
  }
})

export const {
  setLoading,
  setError,
  setCredentials,
  addCredential,
  updateCredential,
  removeCredential,
  setSelectedCredential,
  setPlayerProfile,
  setTemplates,
  openQrCodeModal,
  closeQrCodeModal,
  openCreateCredentialModal,
  closeCreateCredentialModal,
  updateCreateCredentialFormData
} = digitalCredentialsSlice.actions

// Thunks
export const fetchPlayerCredentials = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading credentials...'))
  
  try {
    dispatch(setError(null))
    const response = await api.get('/api/digital-credentials/player')
    dispatch(setCredentials(response.data as DigitalCredential[]))
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch credentials'
    dispatch(setError(errorMessage))
  } finally {
    dispatch(stopLoading())
  }
}

export const fetchPlayerProfile = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading player profile...'))
  
  try {
    dispatch(setError(null))
    const response = await api.get('/api/digital-credentials/profile')
    dispatch(setPlayerProfile(response.data as PlayerProfile))
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch player profile'
    dispatch(setError(errorMessage))
  } finally {
    dispatch(stopLoading())
  }
}

export const fetchCredentialTemplates = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading templates...'))
  
  try {
    dispatch(setError(null))
    const response = await api.get('/api/digital-credentials/templates')
    dispatch(setTemplates(response.data as CredentialTemplate[]))
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch templates'
    dispatch(setError(errorMessage))
  } finally {
    dispatch(stopLoading())
  }
}

export const createDigitalCredential = (credentialData: CreateCredentialData) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Creating credential...'))
  
  try {
    dispatch(setError(null))
    const response = await api.post('/api/digital-credentials/create', credentialData)
    dispatch(addCredential(response.data as DigitalCredential))
    dispatch(closeCreateCredentialModal())
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create credential'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const generateCredentialQrCode = (credentialId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Generating QR code...'))
  
  try {
    dispatch(setError(null))
    const response = await api.post(`/api/digital-credentials/${credentialId}/qr-code`)
    const responseData = response.data as { credential_id: number; qr_code_url: string }
    dispatch(openQrCodeModal({
      credentialId: responseData.credential_id,
      qrCodeUrl: responseData.qr_code_url
    }))
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate QR code'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const verifyCredential = (qrCodeData: string) => async (dispatch: AppDispatch): Promise<VerificationResult> => {
  dispatch(startLoading('Verifying credential...'))
  
  try {
    dispatch(setError(null))
    const response = await api.get(`/api/digital-credentials/verify/${encodeURIComponent(qrCodeData)}`)
    return response.data as VerificationResult
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify credential'
    dispatch(setError(errorMessage))
    return {
      valid: false,
      message: errorMessage
    }
  } finally {
    dispatch(stopLoading())
  }
}

export const updateCredentialStatus = (credentialId: number, isActive: boolean) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating credential status...'))
  
  try {
    dispatch(setError(null))
    const response = await api.put(`/api/digital-credentials/${credentialId}/status`, {
      is_active: isActive
    })
    
    const updatedCredential = { ...(response.data as DigitalCredential), is_active: isActive }
    dispatch(updateCredential(updatedCredential))
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update credential status'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export const deleteCredential = (credentialId: number) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Deleting credential...'))
  
  try {
    dispatch(setError(null))
    await api.delete(`/api/digital-credentials/${credentialId}`)
    dispatch(removeCredential(credentialId))
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete credential'
    dispatch(setError(errorMessage))
    throw error
  } finally {
    dispatch(stopLoading())
  }
}

export default digitalCredentialsSlice.reducer