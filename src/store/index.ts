import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import appDataSlice from './slices/appDataSlice'
import dashboardSlice from './slices/dashboardSlice'
import adminSlice from './slices/adminSlice'
import playerSlice from './slices/playerSlice'
import coachSlice from './slices/coachSlice'
import clubSlice from './slices/clubSlice'
import partnerSlice from './slices/partnerSlice'
import stateSlice from './slices/stateSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    appData: appDataSlice,
    dashboard: dashboardSlice, // Keep for backward compatibility, will remove later
    admin: adminSlice,
    player: playerSlice,
    coach: coachSlice,
    club: clubSlice,
    partner: partnerSlice,
    state: stateSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch