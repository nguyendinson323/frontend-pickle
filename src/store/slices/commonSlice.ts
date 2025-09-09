import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CommonState, CommonPageData } from '../../types/common'
import { startLoading, stopLoading } from './loadingSlice'
import { AppDispatch } from '../index'
import api from '../../services/api'

const initialState: CommonState = {
  data: null,
  isLoading: false,
  lastFetched: null
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setCommonData: (state, action: PayloadAction<CommonPageData>) => {
      state.data = action.payload
      state.isLoading = false
      state.lastFetched = new Date().toISOString()
    },
    clearCommonData: (state) => {
      state.data = null
      state.isLoading = false
      state.lastFetched = null
    }
  }
})

export const { setLoading, setCommonData, clearCommonData } = commonSlice.actions

export const fetchCommonData = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading data...'))
  
  try {
    const response = await api.get('/api/common/data')
    dispatch(setCommonData(response.data as CommonPageData))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    throw error
  }
}

export const fetchPrivacyPolicy = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading('Loading privacy policy...'))
  
  try {
    const response = await api.get('/api/common/privacy-policy')
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(stopLoading())
    throw error
  }
}

export default commonSlice.reducer