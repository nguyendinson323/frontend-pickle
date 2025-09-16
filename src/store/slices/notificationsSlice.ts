import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  NotificationsState,
  Notification,
  PaginatedResponse
} from '../../types'
import api from '../../services/api'
import { AppDispatch } from '..'

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

// Async actions
export const fetchNotifications = (params: { limit?: number; offset?: number }) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true))
    const response = await api.get<PaginatedResponse<Notification>>('/api/notifications', { params })
    dispatch(setNotifications(response.data))
    // Update unread count
    const unreadCount = response.data.rows.filter(n => !n.is_read).length
    dispatch(setUnreadCount(unreadCount))
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
  } finally {
    dispatch(setLoading(false))
  }
}

export const markAsRead = (notificationId: number) => async (dispatch: AppDispatch) => {
  try {
    await api.patch(`/api/notifications/${notificationId}/read`)
    dispatch(markNotificationAsRead(notificationId))
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  }
}

export const markAllAsRead = () => async (dispatch: AppDispatch) => {
  try {
    await api.patch('/api/notifications/mark-all-read')
    dispatch(markAllNotificationsAsRead())
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
  }
}

export default notificationsSlice.reducer