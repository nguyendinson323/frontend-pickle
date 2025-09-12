import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'
import { CoachCertification, CertificationStats, CertificationFilters } from '../../types/coach'

interface CoachCertificationsState {
  certifications: CoachCertification[]
  stats: CertificationStats | null
  selectedCertification: CoachCertification | null
  filters: CertificationFilters
  isLoading: boolean
  error: string | null
}

const initialState: CoachCertificationsState = {
  certifications: [],
  stats: null,
  selectedCertification: null,
  filters: {
    status: 'all',
    issuer: '',
    search: ''
  },
  isLoading: false,
  error: null
}

const coachCertificationsSlice = createSlice({
  name: 'coachCertifications',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setCoachCertifications: (state, action: PayloadAction<CoachCertification[]>) => {
      state.certifications = action.payload
    },
    setCertificationStats: (state, action: PayloadAction<CertificationStats>) => {
      state.stats = action.payload
    },
    setSelectedCertification: (state, action: PayloadAction<CoachCertification | null>) => {
      state.selectedCertification = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<CoachCertificationsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    addCertification: (state, action: PayloadAction<CoachCertification>) => {
      state.certifications.unshift(action.payload)
    },
    updateCertification: (state, action: PayloadAction<CoachCertification>) => {
      const index = state.certifications.findIndex(cert => cert.id === action.payload.id)
      if (index !== -1) {
        state.certifications[index] = action.payload
      }
    },
    removeCertification: (state, action: PayloadAction<number>) => {
      state.certifications = state.certifications.filter(cert => cert.id !== action.payload)
    },
    clearCoachCertificationsData: (state) => {
      state.certifications = []
      state.stats = null
      state.selectedCertification = null
      state.error = null
    }
  }
})

export const {
  setLoading,
  setError,
  setCoachCertifications,
  setCertificationStats,
  setSelectedCertification,
  setFilters,
  addCertification,
  updateCertification,
  removeCertification,
  clearCoachCertificationsData
} = coachCertificationsSlice.actions

// Define response interfaces
interface CoachCertificationsResponse {
  certifications: CoachCertification[]
  stats: CertificationStats
}

interface CertificationResponse {
  certification: CoachCertification
}

// API Functions
export const fetchCoachCertificationsData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Loading certifications data...'))
    const response = await api.get<CoachCertificationsResponse>('/api/coach/certifications')
    dispatch(setCoachCertifications(response.data.certifications))
    dispatch(setCertificationStats(response.data.stats))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load certifications data'))
    dispatch(stopLoading())
    throw error
  }
}

export const addCoachCertification = (certificationData: Partial<CoachCertification>) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Adding certification...'))
    const response = await api.post<CertificationResponse>('/api/coach/certifications', certificationData)
    dispatch(addCertification(response.data.certification))
    dispatch(stopLoading())
    return response.data.certification
  } catch (error) {
    dispatch(stopLoading())
    dispatch(setError('Failed to add certification'))
    console.error('Error adding certification:', error)
    throw error
  }
}

export const updateCoachCertification = (certificationId: number, certificationData: Partial<CoachCertification>) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Updating certification...'))
    const response = await api.put<CertificationResponse>(`/api/coach/certifications/${certificationId}`, certificationData)
    dispatch(updateCertification(response.data.certification))
    dispatch(stopLoading())
    return response.data.certification
  } catch (error) {
    dispatch(stopLoading())
    dispatch(setError('Failed to update certification'))
    console.error('Error updating certification:', error)
    throw error
  }
}

export const deleteCoachCertification = (certificationId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Deleting certification...'))
    await api.delete(`/api/coach/certifications/${certificationId}`)
    dispatch(removeCertification(certificationId))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    dispatch(setError('Failed to delete certification'))
    console.error('Error deleting certification:', error)
    throw error
  }
}

export const downloadCertificate = (certificationId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading('Downloading certificate...'))
    const response = await api.get(`/api/coach/certifications/${certificationId}/download`)
    
    // Get the download URL from the response
    const { download_url, filename } = response.data
    
    // Open the URL in a new tab for download
    const link = document.createElement('a')
    link.href = download_url
    link.download = filename || `certification-${certificationId}.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    dispatch(setError('Failed to download certificate'))
    console.error('Error downloading certificate:', error)
  }
}

export default coachCertificationsSlice.reducer