import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CommonState, CommonPageData } from '../../types/common'
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

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

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

export const fetchCommonData = () => async (dispatch: any) => {
  dispatch(startLoading('Loading data...'))
  
  try {
    const response = await apiClient.get<CommonPageData>('/api/common/data')
    dispatch(setCommonData(response.data))
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    throw error
  }
}

export const fetchPrivacyPolicy = () => async (dispatch: any) => {
  dispatch(startLoading('Loading privacy policy...'))
  
  try {
    const response = await apiClient.get('/api/common/privacy-policy')
    dispatch(stopLoading())
    return response.data
  } catch (error) {
    dispatch(stopLoading())
    throw error
  }
}

export default commonSlice.reducer