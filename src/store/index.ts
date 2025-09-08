import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import tournamentsReducer from './slices/tournamentsSlice'
import courtsReducer from './slices/courtsSlice'
import messagesReducer from './slices/messagesSlice'
import notificationsReducer from './slices/notificationsSlice'
import commonReducer from './slices/commonSlice'
import loadingReducer from './slices/loadingSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tournaments: tournamentsReducer,
    courts: courtsReducer,
    messages: messagesReducer,
    notifications: notificationsReducer,
    common: commonReducer,
    loading: loadingReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store