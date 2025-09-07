import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store/index'
import { logoutUser, getCurrentUser } from '../../store/slices/authSlice'

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth)
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !isAuthenticated && !loading) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, isAuthenticated, loading])

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
    setIsProfileOpen(false)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path)
  }

  // Common navigation items for all visitors
  const commonNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Tournaments', path: '/tournaments' },
    { label: 'Courts', path: '/courts' },
    { label: 'National Ranking', path: '/ranking' },
    { label: 'States', path: '/states' },
    { label: 'Rules', path: '/rules' }
  ]

  // Private navigation items for logged-in users based on role (without duplicates from user menu)
  const getPrivateNavItems = () => {
    if (!user) return []

    // Only return role-specific items, Dashboard will be in user menu
    switch (user.role) {
      case 'admin':
        return [
          { label: 'Admin Panel', path: '/admin' },
          { label: 'User Management', path: '/admin/users' },
          { label: 'Reports', path: '/admin/reports' }
        ]
      case 'player':
        return [
          { label: 'My Tournaments', path: '/player/tournaments' },
          { label: 'Court Reservations', path: '/player/reservations' },
          { label: 'Find Players', path: '/player/find' }
        ]
      case 'coach':
        return [
          { label: 'My Students', path: '/coach/students' },
          { label: 'Certifications', path: '/coach/certifications' },
          { label: 'Schedule', path: '/coach/schedule' }
        ]
      case 'club':
        return [
          { label: 'Manage Courts', path: '/club/courts' },
          { label: 'Club Tournaments', path: '/club/tournaments' },
          { label: 'Members', path: '/club/members' },
          { label: 'Microsite', path: '/club/microsite' }
        ]
      case 'partner':
        return [
          { label: 'Manage Courts', path: '/partner/courts' },
          { label: 'Partner Tournaments', path: '/partner/tournaments' },
          { label: 'Reservations', path: '/partner/reservations' },
          { label: 'Microsite', path: '/partner/microsite' }
        ]
      case 'state':
        return [
          { label: 'State Management', path: '/state/management' },
          { label: 'State Tournaments', path: '/state/tournaments' },
          { label: 'Affiliates', path: '/state/affiliates' },
          { label: 'Microsite', path: '/state/microsite' }
        ]
      default:
        return []
    }
  }

  const privateNavItems = getPrivateNavItems()

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: 'Administrator',
      player: 'Player',
      coach: 'Coach',
      club: 'Club',
      partner: 'Partner', 
      state: 'State Committee'
    }
    return roleNames[role as keyof typeof roleNames] || role
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleNavigation('/')}
              className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors"
            >
              MPF
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Common Navigation */}
            <div className="flex space-x-6">
              {commonNavItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-xs text-gray-500">{getRoleDisplayName(user?.role || '')}</div>
                      <div>{user?.username}</div>
                    </div>
                    <span>▼</span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 border z-50">
                      {/* Main Actions */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleNavigation('/dashboard')
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left transition-colors duration-150"
                      >
                        Dashboard
                      </button>
                      
                      {/* Role-specific navigation items */}
                      {privateNavItems.length > 0 && (
                        <>
                          <hr className="my-1 border-gray-200" />
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {getRoleDisplayName(user?.role || '')} Menu
                          </div>
                          {privateNavItems.map((item) => (
                            <button
                              key={item.path}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleNavigation(item.path)
                              }}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left transition-colors duration-150"
                            >
                              {item.label}
                            </button>
                          ))}
                        </>
                      )}
                      
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleNavigation('/settings')
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left transition-colors duration-150"
                      >
                        Settings
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleLogout()
                        }}
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 w-full text-left transition-colors duration-150"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation('/register')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 transition-colors"
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
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {/* Common Navigation */}
            <div className="pb-2">
              {commonNavItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Private Navigation */}
            {isAuthenticated && (
              <div className="border-t border-gray-200 pt-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  {getRoleDisplayName(user?.role || '')} Menu
                </div>
                {privateNavItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`block w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                      isActivePath(item.path)
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* Auth Section */}
            <div className="border-t border-gray-200 pt-2">
              {isAuthenticated ? (
                <div>
                  <div className="px-3 py-2 text-xs text-gray-500">
                    Logged in as {user?.username}
                  </div>
                  <button
                    onClick={() => handleNavigation('/dashboard')}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation('/register')}
                    className="block w-full text-left px-3 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 rounded-lg mx-3"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false)
            setIsMenuOpen(false)
          }}
        />
      )}
    </header>
  )
}

export default Header