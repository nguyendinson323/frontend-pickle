import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Notification {
  id: number
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement' | 'message'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload
      state.unreadCount = action.payload.filter(n => !n.read).length
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      // Add to beginning of array (newest first)
      state.notifications.unshift(action.payload)
      
      // Increment unread count if notification is unread
      if (!action.payload.read) {
        state.unreadCount += 1
      }
      
      // Keep only the latest 100 notifications
      if (state.notifications.length > 100) {
        const removed = state.notifications.pop()
        if (removed && !removed.read) {
          state.unreadCount -= 1
        }
      }
    },
    markNotificationAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount -= 1
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
      state.unreadCount = 0
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload)
      if (index !== -1) {
        const removed = state.notifications.splice(index, 1)[0]
        if (!removed.read) {
          state.unreadCount -= 1
        }
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = []
      state.unreadCount = 0
    },
    updateUnreadCount: (state) => {
      state.unreadCount = state.notifications.filter(n => !n.read).length
    }
  }
})

export const {
  setLoading,
  setError,
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  updateUnreadCount
} = notificationSlice.actions

export default notificationSlice.reducer