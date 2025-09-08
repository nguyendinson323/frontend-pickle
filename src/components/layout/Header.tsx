import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { RootState } from '../../store'
import { logout } from '../../store/slices/authSlice'
import { NavigationItem, UserRole } from '../../types'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { unreadCount: unreadNotifications } = useSelector((state: RootState) => state.notifications)
  const { unreadCount: unreadMessages } = useSelector((state: RootState) => state.messages)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = () => {
      setIsMenuOpen(false)
      setIsUserMenuOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const publicNavItems: NavigationItem[] = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Tournaments', path: '/tournaments' },
    { label: 'Courts', path: '/courts' }
  ]

  const getPrivateNavItems = (role: UserRole): NavigationItem[] => {
    const baseItems: NavigationItem[] = [
      { label: 'Dashboard', path: '/dashboard', roles: ['admin', 'player', 'coach', 'club', 'partner', 'state'] },
      { label: 'Profile', path: '/profile', roles: ['admin', 'player', 'coach', 'club', 'partner', 'state'] },
      { label: 'Tournaments', path: '/tournaments', roles: ['admin', 'player', 'coach', 'club', 'partner', 'state'] },
      { label: 'Courts', path: '/courts', roles: ['admin', 'player', 'coach', 'club', 'partner', 'state'] }
    ]

    const roleSpecificItems: Record<UserRole, NavigationItem[]> = {
      admin: [
        { label: 'User Management', path: '/admin/users', roles: ['admin'] },
        { label: 'System Reports', path: '/admin/reports', roles: ['admin'] },
        { label: 'Settings', path: '/admin/settings', roles: ['admin'] }
      ],
      player: [
        { label: 'Find Players', path: '/player/connections', roles: ['player'] },
        { label: 'My Matches', path: '/player/matches', roles: ['player'] },
        { label: 'Rankings', path: '/player/rankings', roles: ['player'] }
      ],
      coach: [
        { label: 'My Sessions', path: '/coach/sessions', roles: ['coach'] },
        { label: 'Certifications', path: '/coach/certifications', roles: ['coach'] },
        { label: 'Students', path: '/coach/students', roles: ['coach'] }
      ],
      club: [
        { label: 'My Courts', path: '/club/courts', roles: ['club'] },
        { label: 'Members', path: '/club/members', roles: ['club'] },
        { label: 'My Tournaments', path: '/club/tournaments', roles: ['club'] },
        { label: 'Microsite', path: '/club/microsite', roles: ['club'] }
      ],
      partner: [
        { label: 'My Courts', path: '/partner/courts', roles: ['partner'] },
        { label: 'My Tournaments', path: '/partner/tournaments', roles: ['partner'] },
        { label: 'Microsite', path: '/partner/microsite', roles: ['partner'] },
        { label: 'Analytics', path: '/partner/analytics', roles: ['partner'] }
      ],
      state: [
        { label: 'State Management', path: '/state/management', roles: ['state'] },
        { label: 'State Tournaments', path: '/state/tournaments', roles: ['state'] },
        { label: 'Microsite', path: '/state/microsite', roles: ['state'] },
        { label: 'Reports', path: '/state/reports', roles: ['state'] }
      ]
    }

    return [...baseItems, ...roleSpecificItems[role]]
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setIsUserMenuOpen(false)
  }

  const navItems = isAuthenticated && user 
    ? getPrivateNavItems(user.role)
    : publicNavItems

  const isActivePath = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path))
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => handleNavigation('/')}
              className="flex items-center space-x-2 text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PF</span>
              </div>
              <span>Pickleball Federation</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActivePath(item.path)
                    ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Side - Auth & Notifications */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button
                  onClick={() => handleNavigation('/notifications')}
                  className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200 hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5h5m-5-5v5M7 7h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" />
                  </svg>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadNotifications > 99 ? '99+' : unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Messages */}
                <button
                  onClick={() => handleNavigation('/messages')}
                  className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200 hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadMessages > 99 ? '99+' : unreadMessages}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsUserMenuOpen(!isUserMenuOpen)
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user?.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden md:block font-medium">{user?.username}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm text-gray-600">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                      
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile Settings
                      </button>
                      
                      <button
                        onClick={() => handleNavigation('/membership')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Membership
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleNavigation('/login')}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMenuOpen(!isMenuOpen)
              }}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActivePath(item.path)
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header