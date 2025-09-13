import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

const initialState: ToastState = {
  toasts: []
}

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        id: Date.now().toString(),
        ...action.payload,
        duration: action.payload.duration || 5000
      }
      state.toasts.push(toast)
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
    },
    clearAllToasts: (state) => {
      state.toasts = []
    }
  }
})

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions
export default toastSlice.reducer

// Helper functions for common toast types
export const showSuccessToast = (message: string) => addToast({ type: 'success', message })
export const showErrorToast = (message: string) => addToast({ type: 'error', message })
export const showWarningToast = (message: string) => addToast({ type: 'warning', message })
export const showInfoToast = (message: string) => addToast({ type: 'info', message })