import React from 'react'
// import { Navigate } from 'react-router-dom'
import { UserRole } from './types'

// Route components
import { DashboardRedirect } from './routes/DashboardRedirect'
import { ProfileRedirect } from './routes/ProfileRedirect'

// Common pages
import HomePage from './pages/common/Home'
import AboutPage from './pages/common/About'
import LoginPage from './pages/common/Login'
import UserSelectPage from './pages/common/UserSelect'
import TournamentsPage from './pages/common/Tournaments'
import CourtsPage from './pages/common/Courts'

// Registration pages
import PlayerRegisterPage from './pages/common/register/PlayerRegister'
import CoachRegisterPage from './pages/common/register/CoachRegister'
import ClubRegisterPage from './pages/common/register/ClubRegister'
import PartnerRegisterPage from './pages/common/register/PartnerRegister'
import StateRegisterPage from './pages/common/register/StateRegister'

// Dashboard pages
import AdminDashboardPage from './pages/admin/AdminDashboard'
import AdminUserManagementPage from './pages/admin/AdminUserManagement'
import AdminMessagingPage from './pages/admin/AdminMessaging'
import AdminRankingsPage from './pages/admin/AdminRankings'
import AdminCourtsPage from './pages/admin/AdminCourts'
import AdminTournamentsPage from './pages/admin/AdminTournaments'
import AdminMicrositesPage from './pages/admin/AdminMicrosites'
import AdminReportsPage from './pages/admin/AdminReports'
import AdminPaymentsPage from './pages/admin/AdminPayments'
import PlayerDashboardPage from './pages/player/PlayerDashboard'
import CoachDashboardPage from './pages/coach/CoachDashboard'
import CoachSessionsPage from './pages/coach/CoachSessions'
import CoachCertificationsPage from './pages/coach/CoachCertifications'
import CoachStudentsPage from './pages/coach/CoachStudents'
import CoachMembershipPage from './pages/coach/CoachMembership'
import ClubDashboardPage from './pages/club/ClubDashboard'
import ClubCourtsPage from './pages/club/ClubCourts'
import ClubMembersPage from './pages/club/ClubMembers'
import ClubTournamentsPage from './pages/club/ClubTournaments'
import ClubMicrositePage from './pages/club/ClubMicrosite'
import StateManagementPage from './pages/state/StateManagement'
import StateInboxPage from './pages/state/StateInbox'
import StateMicrositePage from './pages/state/StateMicrosite'
import StateStatisticsPage from './pages/state/StateStatistics'
import StateDocumentsPage from './pages/state/StateDocuments'
import StateMemberManagementPage from './pages/state/StateMemberManagement'
import PartnerDashboardPage from './pages/partner/PartnerDashboard'
import PartnerInboxPage from './pages/partner/PartnerInbox'
import PartnerMicrositePage from './pages/partner/PartnerMicrosite'
import PartnerStatisticsPage from './pages/partner/PartnerStatistics'
import PartnerDocumentsPage from './pages/partner/PartnerDocuments'
import PartnerManagementPage from './pages/partner/PartnerManagement'
import StateDashboardPage from './pages/state/StateDashboard'

// Profile pages
import AdminProfilePage from './pages/admin/AdminProfile'
import PlayerProfilePage from './pages/player/PlayerProfile'
import CoachProfilePage from './pages/coach/CoachProfile'
import ClubProfilePage from './pages/club/ClubProfile'
import PartnerProfilePage from './pages/partner/PartnerProfile'
import StateProfilePage from './pages/state/StateProfile'

// Player pages
import PlayerFinderPage from './pages/player/PlayerFinder'
import TournamentBrowsePage from './pages/player/TournamentBrowse'
import CourtReservationsPage from './pages/player/CourtReservations'
import DigitalCredentialsPage from './pages/player/DigitalCredentials'
import CoachingSessionsPage from './pages/player/CoachingSessions'
import PlayerMessagesPage from './pages/player/PlayerMessages'
import PlayerRankingsPage from './pages/player/PlayerRankings'
import PlayerMembershipPage from './pages/player/PlayerMembership'

// Types
export interface RouteConfig {
  path: string
  key: string
  public: boolean
  element: React.ReactElement
  requiredRoles?: UserRole[]
}


const routes: RouteConfig[] = [
    // ==================== PUBLIC ROUTES ====================
    {
        path: "/",
        key: "home",
        public: true,
        element: <HomePage />
    },
    {
        path: "/about",
        key: "about",
        public: true,
        element: <AboutPage />
    },
    {
        path: "/login",
        key: "login",
        public: true,
        element: <LoginPage />
    },
    {
        path: "/register",
        key: "register",
        public: true,
        element: <UserSelectPage />
    },
    {
        path: "/tournaments",
        key: "tournaments",
        public: true,
        element: <TournamentsPage />
    },
    {
        path: "/courts",
        key: "courts",
        public: true,
        element: <CourtsPage />
    },
    {
        path: "/state/:stateId",
        key: "public-state-microsite",
        public: true,
        element: <StateMicrositePage />
    },
    
    // ==================== REGISTRATION ROUTES ====================
    {
        path: "/register/player",
        key: "register-player",
        public: true,
        element: <PlayerRegisterPage />
    },
    {
        path: "/register/coach",
        key: "register-coach", 
        public: true,
        element: <CoachRegisterPage />
    },
    {
        path: "/register/club",
        key: "register-club",
        public: true,
        element: <ClubRegisterPage />
    },
    {
        path: "/register/partner",
        key: "register-partner",
        public: true,
        element: <PartnerRegisterPage />
    },
    {
        path: "/register/state",
        key: "register-state",
        public: true,
        element: <StateRegisterPage />
    },
    
    // ==================== PROTECTED DASHBOARD ROUTES ====================
    {
        path: "/admin/dashboard",
        key: "admin-dashboard",
        public: false,
        element: <AdminDashboardPage />,
        requiredRoles: ['admin']
    },
    {
        path: "/admin/users",
        key: "admin-users",
        public: false,
        element: <AdminUserManagementPage />,
        requiredRoles: ['admin']
    },
    {
        path: "/admin/messaging",
        key: "admin-messaging",
        public: false,
        element: <AdminMessagingPage />,
        requiredRoles: ['admin']
    },
    {
        path: "/admin/rankings",
        key: "admin-rankings",
        public: false,
        element: <AdminRankingsPage />,
        requiredRoles: ['admin']
    },
    {
        path: "/admin/courts",
        key: "admin-courts",
        public: false,
        element: <AdminCourtsPage />,
        requiredRoles: ['admin']
    },
    {
        path: "/admin/tournaments",
        key: "admin-tournaments",
        public: false,
        element: <AdminTournamentsPage />,
        requiredRoles: ['admin']
    },
    {
        path: "/admin/microsites",
        key: "admin-microsites",
        public: false,
        element: <AdminMicrositesPage />,
        requiredRoles: ['admin']
    },
    {
        path: "/admin/reports",
        key: "admin-reports",
        public: false,
        element: <AdminReportsPage />,
        requiredRoles: ['admin']
    },
    {
        path: "/admin/payments",
        key: "admin-payments",
        public: false,
        element: <AdminPaymentsPage />,
        requiredRoles: ['admin']
    },
    {
        path: "/player/dashboard",
        key: "player-dashboard", 
        public: false,
        element: <PlayerDashboardPage />,
        requiredRoles: ['player']
    },
    {
        path: "/player/finder",
        key: "player-finder", 
        public: false,
        element: <PlayerFinderPage />,
        requiredRoles: ['player']
    },
    {
        path: "/player/tournaments",
        key: "player-tournaments", 
        public: false,
        element: <TournamentBrowsePage />,
        requiredRoles: ['player']
    },
    {
        path: "/player/courts",
        key: "player-courts", 
        public: false,
        element: <CourtReservationsPage />,
        requiredRoles: ['player']
    },
    {
        path: "/player/credentials",
        key: "player-credentials", 
        public: false,
        element: <DigitalCredentialsPage />,
        requiredRoles: ['player']
    },
    {
        path: "/player/coaching",
        key: "player-coaching", 
        public: false,
        element: <CoachingSessionsPage />,
        requiredRoles: ['player']
    },
    {
        path: "/player/messages",
        key: "player-messages", 
        public: false,
        element: <PlayerMessagesPage />,
        requiredRoles: ['player']
    },
    {
        path: "/player/rankings",
        key: "player-rankings", 
        public: false,
        element: <PlayerRankingsPage />,
        requiredRoles: ['player']
    },
    {
        path: "/player/membership",
        key: "player-membership", 
        public: false,
        element: <PlayerMembershipPage />,
        requiredRoles: ['player']
    },
    {
        path: "/coach/dashboard",
        key: "coach-dashboard",
        public: false,
        element: <CoachDashboardPage />,
        requiredRoles: ['coach']
    },
    {
        path: "/coach/sessions",
        key: "coach-sessions",
        public: false,
        element: <CoachSessionsPage />,
        requiredRoles: ['coach']
    },
    {
        path: "/coach/certifications",
        key: "coach-certifications",
        public: false,
        element: <CoachCertificationsPage />,
        requiredRoles: ['coach']
    },
    {
        path: "/coach/students",
        key: "coach-students",
        public: false,
        element: <CoachStudentsPage />,
        requiredRoles: ['coach']
    },
    {
        path: "/coach/membership",
        key: "coach-membership",
        public: false,
        element: <CoachMembershipPage />,
        requiredRoles: ['coach']
    },
    {
        path: "/club/dashboard",
        key: "club-dashboard",
        public: false,
        element: <ClubDashboardPage />,
        requiredRoles: ['club']
    },
    {
        path: "/club/courts",
        key: "club-courts",
        public: false,
        element: <ClubCourtsPage />,
        requiredRoles: ['club']
    },
    {
        path: "/club/members",
        key: "club-members",
        public: false,
        element: <ClubMembersPage />,
        requiredRoles: ['club']
    },
    {
        path: "/club/tournaments",
        key: "club-tournaments",
        public: false,
        element: <ClubTournamentsPage />,
        requiredRoles: ['club']
    },
    {
        path: "/club/microsite",
        key: "club-microsite",
        public: false,
        element: <ClubMicrositePage />,
        requiredRoles: ['club']
    },
    {
        path: "/partner/dashboard", 
        key: "partner-dashboard",
        public: false,
        element: <PartnerDashboardPage />,
        requiredRoles: ['partner']
    },
    {
        path: "/state/dashboard",
        key: "state-dashboard",
        public: false,
        element: <StateDashboardPage />,
        requiredRoles: ['state']
    },
    {
        path: "/state/management",
        key: "state-management",
        public: false,
        element: <StateManagementPage />,
        requiredRoles: ['state']
    },
    {
        path: "/state/inbox",
        key: "state-inbox",
        public: false,
        element: <StateInboxPage />,
        requiredRoles: ['state']
    },
    {
        path: "/state/microsite",
        key: "state-microsite",
        public: false,
        element: <StateMicrositePage />,
        requiredRoles: ['state']
    },
    {
        path: "/state/statistics",
        key: "state-statistics",
        public: false,
        element: <StateStatisticsPage />,
        requiredRoles: ['state']
    },
    {
        path: "/state/documents",
        key: "state-documents",
        public: false,
        element: <StateDocumentsPage />,
        requiredRoles: ['state']
    },
    {
        path: "/state/members",
        key: "state-members",
        public: false,
        element: <StateMemberManagementPage />,
        requiredRoles: ['state']
    },
    {
        path: "/dashboard",
        key: "dashboard-redirect",
        public: false,
        element: <DashboardRedirect />,
        requiredRoles: ['player', 'coach', 'admin', 'state', 'club', 'partner']
    },
    
    // ==================== PROFILE ROUTES ====================
    {
        path: "/admin/profile",
        key: "admin-profile",
        public: false,
        element: <AdminProfilePage />,
        requiredRoles: ['admin']
    },
    {
        path: "/player/profile",
        key: "player-profile",
        public: false,
        element: <PlayerProfilePage />,
        requiredRoles: ['player']
    },
    {
        path: "/coach/profile",
        key: "coach-profile",
        public: false,
        element: <CoachProfilePage />,
        requiredRoles: ['coach']
    },
    {
        path: "/club/profile",
        key: "club-profile",
        public: false,
        element: <ClubProfilePage />,
        requiredRoles: ['club']
    },
    {
        path: "/partner/profile",
        key: "partner-profile",
        public: false,
        element: <PartnerProfilePage />,
        requiredRoles: ['partner']
    },
    {
        path: "/partner/inbox",
        key: "partner-inbox",
        public: false,
        element: <PartnerInboxPage />,
        requiredRoles: ['partner']
    },
    {
        path: "/partner/microsite",
        key: "partner-microsite",
        public: false,
        element: <PartnerMicrositePage />,
        requiredRoles: ['partner']
    },
    {
        path: "/partner/microsite/:partnerId",
        key: "partner-microsite-public",
        public: true,
        element: <PartnerMicrositePage />
    },
    {
        path: "/partner/statistics",
        key: "partner-statistics",
        public: false,
        element: <PartnerStatisticsPage />,
        requiredRoles: ['partner']
    },
    {
        path: "/partner/documents",
        key: "partner-documents",
        public: false,
        element: <PartnerDocumentsPage />,
        requiredRoles: ['partner']
    },
    {
        path: "/partner/management",
        key: "partner-management",
        public: false,
        element: <PartnerManagementPage />,
        requiredRoles: ['partner']
    },
    {
        path: "/state/profile",
        key: "state-profile",
        public: false,
        element: <StateProfilePage />,
        requiredRoles: ['state']
    },
    
    // ==================== LEGACY PROFILE ROUTE ====================
    {
        path: "/profile",
        key: "profile-redirect",
        public: false,
        element: <ProfileRedirect />,
        requiredRoles: ['player', 'coach', 'admin', 'state', 'club', 'partner']
    }
]

export default routes;