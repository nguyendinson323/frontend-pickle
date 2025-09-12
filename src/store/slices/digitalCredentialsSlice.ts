import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
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
  },
  extraReducers: (builder) => {
    builder
      // fetchPlayerCredentials
      .addCase(fetchPlayerCredentials.fulfilled, (state, action) => {
        state.credentials = action.payload
        state.error = null
      })
      .addCase(fetchPlayerCredentials.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // fetchPlayerProfile
      .addCase(fetchPlayerProfile.fulfilled, (state, action) => {
        state.playerProfile = action.payload
        state.error = null
      })
      .addCase(fetchPlayerProfile.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // fetchCredentialTemplates
      .addCase(fetchCredentialTemplates.fulfilled, (state, action) => {
        state.templates = action.payload
        state.error = null
      })
      .addCase(fetchCredentialTemplates.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // createDigitalCredential
      .addCase(createDigitalCredential.fulfilled, (state, action) => {
        state.credentials.unshift(action.payload)
        state.error = null
      })
      .addCase(createDigitalCredential.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // updateCredentialStatus
      .addCase(updateCredentialStatus.fulfilled, (state, action) => {
        const { credentialId, isActive } = action.payload
        const index = state.credentials.findIndex(cred => cred.id === credentialId)
        if (index !== -1) {
          state.credentials[index].is_active = isActive
        }
        state.error = null
      })
      .addCase(updateCredentialStatus.rejected, (state, action) => {
        state.error = action.payload as string
      })
      // deleteCredential
      .addCase(deleteCredential.fulfilled, (state, action) => {
        state.credentials = state.credentials.filter(cred => cred.id !== action.payload)
        state.error = null
      })
      .addCase(deleteCredential.rejected, (state, action) => {
        state.error = action.payload as string
      })
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

// Async Thunks
export const fetchPlayerCredentials = createAsyncThunk(
  'digitalCredentials/fetchPlayerCredentials',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Loading credentials...'))
      const response = await api.get('/api/digital-credentials/player')
      return response.data as DigitalCredential[]
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch credentials'
      return rejectWithValue(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }
)

export const fetchPlayerProfile = createAsyncThunk(
  'digitalCredentials/fetchPlayerProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Loading player profile...'))
      const response = await api.get('/api/digital-credentials/profile')
      return response.data as PlayerProfile
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch player profile'
      return rejectWithValue(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }
)

export const fetchCredentialTemplates = createAsyncThunk(
  'digitalCredentials/fetchCredentialTemplates',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Loading templates...'))
      const response = await api.get('/api/digital-credentials/templates')
      return response.data as CredentialTemplate[]
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch templates'
      return rejectWithValue(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }
)

export const createDigitalCredential = createAsyncThunk(
  'digitalCredentials/createDigitalCredential',
  async (credentialData: CreateCredentialData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Creating credential...'))
      const response = await api.post('/api/digital-credentials/create', credentialData)
      dispatch(closeCreateCredentialModal())
      return response.data as DigitalCredential
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create credential'
      return rejectWithValue(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }
)

export const generateCredentialQrCode = createAsyncThunk(
  'digitalCredentials/generateCredentialQrCode',
  async (credentialId: number, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Generating QR code...'))
      const response = await api.post(`/api/digital-credentials/${credentialId}/qr-code`)
      const responseData = response.data as { credential_id: number; qr_code_url: string }
      dispatch(openQrCodeModal({
        credentialId: responseData.credential_id,
        qrCodeUrl: responseData.qr_code_url
      }))
      return responseData
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate QR code'
      return rejectWithValue(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }
)

export const verifyCredential = createAsyncThunk(
  'digitalCredentials/verifyCredential',
  async (qrCodeData: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Verifying credential...'))
      const response = await api.get(`/api/digital-credentials/verify/${encodeURIComponent(qrCodeData)}`)
      return response.data as VerificationResult
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify credential'
      return rejectWithValue({
        valid: false,
        message: errorMessage
      } as VerificationResult)
    } finally {
      dispatch(stopLoading())
    }
  }
)

export const updateCredentialStatus = createAsyncThunk(
  'digitalCredentials/updateCredentialStatus',
  async ({ credentialId, isActive }: { credentialId: number; isActive: boolean }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Updating credential status...'))
      await api.put(`/api/digital-credentials/${credentialId}/status`, {
        is_active: isActive
      })
      return { credentialId, isActive }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update credential status'
      return rejectWithValue(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }
)

export const deleteCredential = createAsyncThunk(
  'digitalCredentials/deleteCredential',
  async (credentialId: number, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading('Deleting credential...'))
      await api.delete(`/api/digital-credentials/${credentialId}`)
      return credentialId
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete credential'
      return rejectWithValue(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }
)

export default digitalCredentialsSlice.reducer