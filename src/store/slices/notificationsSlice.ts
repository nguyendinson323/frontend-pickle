import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  NotificationsState,
  Notification,
  PaginatedResponse
} from '../../types'

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  totalCount: 0
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setNotifications: (state, action: PayloadAction<PaginatedResponse<Notification>>) => {
      state.notifications = action.payload.rows
      state.totalCount = action.payload.count
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload)
      state.totalCount += 1
      if (!action.payload.is_read) {
        state.unreadCount += 1
      }
    },
    markNotificationAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.is_read) {
        notification.is_read = true
        notification.read_at = new Date().toISOString()
        if (state.unreadCount > 0) {
          state.unreadCount -= 1
        }
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        if (!notification.is_read) {
          notification.is_read = true
          notification.read_at = new Date().toISOString()
        }
      })
      state.unreadCount = 0
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload
    },
    updateUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount += action.payload
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      const notificationIndex = state.notifications.findIndex(n => n.id === action.payload)
      if (notificationIndex !== -1) {
        const notification = state.notifications[notificationIndex]
        if (!notification.is_read && state.unreadCount > 0) {
          state.unreadCount -= 1
        }
        state.notifications.splice(notificationIndex, 1)
        state.totalCount -= 1
      }
    },
    clearNotifications: (state) => {
      state.notifications = []
      state.totalCount = 0
      state.unreadCount = 0
    }
  }
})

export const {
  setLoading,
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setUnreadCount,
  updateUnreadCount,
  removeNotification,
  clearNotifications
} = notificationsSlice.actions

export default notificationsSlice.reducer