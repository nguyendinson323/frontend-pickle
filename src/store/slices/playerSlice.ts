import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../index'
import { startLoading, stopLoading } from './loadingSlice'
import api from '../../services/api'
import { Player, State, User } from '../../types/auth'

export interface PlayerState {
  profileData: Player | null
  statesList: State[]
  isLoading: boolean
  error: string | null
}

const initialState: PlayerState = {
  profileData: null,
  statesList: [],
  isLoading: false,
  error: null
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setProfileData: (state, action: PayloadAction<Player>) => {
      state.profileData = action.payload
    },
    setStatesList: (state, action: PayloadAction<State[]>) => {
      state.statesList = action.payload
    },
    updateProfileData: (state, action: PayloadAction<Partial<Player>>) => {
      if (state.profileData) {
        state.profileData = { ...state.profileData, ...action.payload }
      }
    },
    clearPlayerData: (state) => {
      state.profileData = null
      state.statesList = []
      state.error = null
    }
  }
})

export const {
  setLoading,
  setError,
  setProfileData,
  setStatesList,
  updateProfileData,
  clearPlayerData
} = playerSlice.actions

// Fetch states list for dropdowns
export const fetchStates = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading states...'))
  
  try {
    const response = await api.get<State[]>('/api/player/states')
    dispatch(setStatesList(response.data as State[]))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load states'))
    dispatch(stopLoading())
    throw error
  }
}

// Fetch player profile data
export const fetchPlayerProfile = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading profile...'))
  
  try {
    const response = await api.get('/api/player/profile')
    dispatch(setProfileData(response.data as Player))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(setError('Failed to load profile'))
    dispatch(stopLoading())
    throw error
  }
}

// Update player profile
export const updatePlayerProfile = (profileData: Partial<Player>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating profile...'))
  
  try {
    const response = await api.put('/api/player/profile', profileData)
    dispatch(setProfileData(response.data as Player))
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to update profile'))
    dispatch(stopLoading())
    throw error
  }
}

// Update user account data (username, email, phone)
export const updateUserAccount = (userData: Partial<User>) => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Updating account...'))
  
  try {
    const response = await api.put<User>('/api/player/account', userData)
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(setError('Failed to update account'))
    dispatch(stopLoading())
    throw error
  }
}

export default playerSlice.reducer