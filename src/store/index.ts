import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import tournamentsReducer from './slices/tournamentsSlice'
import courtsReducer from './slices/courtsSlice'
import messagesReducer from './slices/messagesSlice'
import notificationsReducer from './slices/notificationsSlice'
import commonReducer from './slices/commonSlice'
import loadingReducer from './slices/loadingSlice'
import playerReducer from './slices/playerSlice'
import playerFinderReducer from './slices/playerFinderSlice'
import tournamentBrowseReducer from './slices/tournamentBrowseSlice'
import courtReservationReducer from './slices/courtReservationSlice'
import digitalCredentialsReducer from './slices/digitalCredentialsSlice'
import coachingSessionsReducer from './slices/coachingSessionsSlice'
import playerMessagesReducer from './slices/playerMessagesSlice'
import playerRankingsReducer from './slices/playerRankingsSlice'
import coachSessionsReducer from './slices/coachSessionsSlice'
import coachCertificationsReducer from './slices/coachCertificationsSlice'
import coachStudentsReducer from './slices/coachStudentsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tournaments: tournamentsReducer,
    courts: courtsReducer,
    messages: messagesReducer,
    notifications: notificationsReducer,
    common: commonReducer,
    loading: loadingReducer,
    player: playerReducer,
    playerFinder: playerFinderReducer,
    tournamentBrowse: tournamentBrowseReducer,
    courtReservation: courtReservationReducer,
    digitalCredentials: digitalCredentialsReducer,
    coachingSessions: coachingSessionsReducer,
    playerMessages: playerMessagesReducer,
    playerRankings: playerRankingsReducer,
    coachSessions: coachSessionsReducer,
    coachCertifications: coachCertificationsReducer,
    coachStudents: coachStudentsReducer
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