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
import playerMembershipReducer from './slices/playerMembershipSlice'
import coachMembershipReducer from './slices/coachMembershipSlice'
import coachDashboardReducer from './slices/coachDashboardSlice'
import clubDashboardReducer from './slices/clubDashboardSlice'
import clubCourtsReducer from './slices/clubCourtsSlice'
import clubMembersReducer from './slices/clubMembersSlice'
import clubTournamentsReducer from './slices/clubTournamentsSlice'
import clubMicrositeReducer from './slices/clubMicrositeSlice'
import stateDashboardReducer from './slices/stateDashboardSlice'
import stateManagementReducer from './slices/stateManagementSlice'
import stateInboxReducer from './slices/stateInboxSlice'
import stateMicrositeReducer from './slices/stateMicrositeSlice'
import stateStatisticsReducer from './slices/stateStatisticsSlice'
import stateDocumentsReducer from './slices/stateDocumentsSlice'
import stateMemberManagementReducer from './slices/stateMemberManagementSlice'
import partnerInboxReducer from './slices/partnerInboxSlice'
import partnerMicrositeReducer from './slices/partnerMicrositeSlice'
import partnerStatisticsReducer from './slices/partnerStatisticsSlice'
import partnerDocumentsReducer from './slices/partnerDocumentsSlice'
import partnerManagementReducer from './slices/partnerManagementSlice'
import partnerDashboardReducer from './slices/partnerDashboardSlice'
import adminUserManagementReducer from './slices/adminUserManagementSlice'
import adminMessagingReducer from './slices/adminMessagingSlice'
import adminRankingsReducer from './slices/adminRankingsSlice'
import adminCourtsReducer from './slices/adminCourtsSlice'
import adminTournamentsReducer from './slices/adminTournamentsSlice'
import adminMicrositesReducer from './slices/adminMicrositesSlice'
import adminReportsReducer from './slices/adminReportsSlice'
import adminPaymentsReducer from './slices/adminPaymentsSlice'
import adminDashboardReducer from './slices/adminDashboardSlice'

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
    coachStudents: coachStudentsReducer,
    playerMembership: playerMembershipReducer,
    coachMembership: coachMembershipReducer,
    coachDashboard: coachDashboardReducer,
    clubDashboard: clubDashboardReducer,
    clubCourts: clubCourtsReducer,
    clubMembers: clubMembersReducer,
    clubTournaments: clubTournamentsReducer,
    clubMicrosite: clubMicrositeReducer,
    stateDashboard: stateDashboardReducer,
    stateManagement: stateManagementReducer,
    stateInbox: stateInboxReducer,
    stateMicrosite: stateMicrositeReducer,
    stateStatistics: stateStatisticsReducer,
    stateDocuments: stateDocumentsReducer,
    stateMemberManagement: stateMemberManagementReducer,
    partnerInbox: partnerInboxReducer,
    partnerMicrosite: partnerMicrositeReducer,
    partnerStatistics: partnerStatisticsReducer,
    partnerDocuments: partnerDocumentsReducer,
    partnerManagement: partnerManagementReducer,
    partnerDashboard: partnerDashboardReducer,
    adminUserManagement: adminUserManagementReducer,
    adminMessaging: adminMessagingReducer,
    adminRankings: adminRankingsReducer,
    adminCourts: adminCourtsReducer,
    adminTournaments: adminTournamentsReducer,
    adminMicrosites: adminMicrositesReducer,
    adminReports: adminReportsReducer,
    adminPayments: adminPaymentsReducer,
    adminDashboard: adminDashboardReducer
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