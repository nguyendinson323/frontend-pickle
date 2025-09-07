import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { AppDataState, AppData } from '../../types/common'
import { AppDispatch } from '../index'

const initialState: AppDataState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
}

const appDataSlice = createSlice({
  name: 'appData',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setAppData: (state, action: PayloadAction<AppData>) => {
      state.data = action.payload
      state.loading = false
      state.error = null
      state.lastUpdated = new Date().toISOString()
    },
    clearError: (state) => {
      state.error = null
    },
    clearAppData: (state) => {
      state.data = null
      state.loading = false
      state.error = null
      state.lastUpdated = null
    },
  },
})

export const { setLoading, setError, setAppData, clearError, clearAppData } = appDataSlice.actions

// API function to fetch all app data at once
export const fetchAllAppData = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())
      
      const response = await api.get('/api/app-data')
      
      dispatch(setAppData(response.data.data))
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to fetch app data'))
      dispatch(setLoading(false))
    }
  }
}

// API function to refresh tournaments data
export const refreshTournaments = () => {
  return async (dispatch: AppDispatch, getState: any) => {
    try {
      const response = await api.get('/api/tournaments/all')
      
      const currentData = getState().appData.data
      if (currentData) {
        dispatch(setAppData({
          ...currentData,
          tournaments: response.data.data
        }))
      }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to refresh tournaments'))
    }
  }
}

// API function to refresh courts data
export const refreshCourts = () => {
  return async (dispatch: AppDispatch, getState: any) => {
    try {
      const response = await api.get('/api/courts/all')
      
      const currentData = getState().appData.data
      if (currentData) {
        dispatch(setAppData({
          ...currentData,
          courts: response.data.data
        }))
      }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to refresh courts'))
    }
  }
}

// API function to refresh rankings data
export const refreshRankings = () => {
  return async (dispatch: AppDispatch, getState: any) => {
    try {
      const response = await api.get('/api/rankings/all')
      
      const currentData = getState().appData.data
      if (currentData) {
        dispatch(setAppData({
          ...currentData,
          playerRankings: response.data.data.playerRankings,
          rankingPeriods: response.data.data.rankingPeriods,
          rankingCategories: response.data.data.rankingCategories
        }))
      }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to refresh rankings'))
    }
  }
}

// API function to refresh states data
export const refreshStates = () => {
  return async (dispatch: AppDispatch, getState: any) => {
    try {
      const response = await api.get('/api/states/all')
      
      const currentData = getState().appData.data
      if (currentData) {
        dispatch(setAppData({
          ...currentData,
          states: response.data.data.states,
          statesStatistics: response.data.data.statesStatistics
        }))
      }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Failed to refresh states'))
    }
  }
}

export default appDataSlice.reducer