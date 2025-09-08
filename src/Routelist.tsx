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
import PlayerDashboardPage from './pages/player/PlayerDashboard'
import CoachDashboardPage from './pages/coach/CoachDashboard'
import ClubDashboardPage from './pages/club/ClubDashboard'
import PartnerDashboardPage from './pages/partner/PartnerDashboard'
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
        path: "/coach/dashboard",
        key: "coach-dashboard",
        public: false,
        element: <CoachDashboardPage />,
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