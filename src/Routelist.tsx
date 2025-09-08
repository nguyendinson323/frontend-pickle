import React from 'react'
// import { Navigate } from 'react-router-dom'
import { UserRole } from './types'

// Route components
import { DashboardRedirect } from './routes/DashboardRedirect'

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

// Player pages
import PlayerFinderPage from './pages/player/PlayerFinder'

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
    }
]

export default routes;