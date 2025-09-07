import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store/index'

const Footer: React.FC = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  const handleRegisterClick = (userType: string) => {
    navigate(`/register/${userType}`)
  }

  // Quick Links for all users
  const publicLinks = [
    { label: 'Home', path: '/' },
    { label: 'Tournaments', path: '/tournaments' },
    { label: 'National Ranking', path: '/ranking' },
    { label: 'Courts', path: '/courts' },
    { label: 'Rules', path: '/rules' },
    { label: 'States', path: '/states' }
  ]

  // Registration links for non-authenticated users
  const registrationLinks = [
    { label: 'Player Registration', userType: 'player' },
    { label: 'Coach Registration', userType: 'coach' },
    { label: 'Club Registration', userType: 'club' },
    { label: 'Partner Registration', userType: 'partner' },
    { label: 'State Committee', userType: 'state' }
  ]

  // Private links for authenticated users based on role
  const getPrivateLinks = () => {
    if (!user) return []

    const baseLinks = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Profile', path: '/profile' },
      { label: 'Messages', path: '/messages' },
      { label: 'Settings', path: '/settings' }
    ]

    switch (user.role) {
      case 'admin':
        return [
          ...baseLinks,
          { label: 'Admin Panel', path: '/admin' },
          { label: 'User Management', path: '/admin/users' },
          { label: 'Reports', path: '/admin/reports' }
        ]
      case 'player':
        return [
          ...baseLinks,
          { label: 'My Tournaments', path: '/player/tournaments' },
          { label: 'Reservations', path: '/player/reservations' },
          { label: 'Find Players', path: '/player/find' }
        ]
      case 'coach':
        return [
          ...baseLinks,
          { label: 'My Students', path: '/coach/students' },
          { label: 'Certifications', path: '/coach/certifications' },
          { label: 'Schedule', path: '/coach/schedule' }
        ]
      case 'club':
        return [
          ...baseLinks,
          { label: 'Manage Courts', path: '/club/courts' },
          { label: 'Club Tournaments', path: '/club/tournaments' },
          { label: 'Members', path: '/club/members' },
          { label: 'Microsite', path: '/club/microsite' }
        ]
      case 'partner':
        return [
          ...baseLinks,
          { label: 'Manage Courts', path: '/partner/courts' },
          { label: 'Partner Tournaments', path: '/partner/tournaments' },
          { label: 'Reservations', path: '/partner/reservations' },
          { label: 'Microsite', path: '/partner/microsite' }
        ]
      case 'state':
        return [
          ...baseLinks,
          { label: 'State Management', path: '/state/management' },
          { label: 'State Tournaments', path: '/state/tournaments' },
          { label: 'Affiliates', path: '/state/affiliates' },
          { label: 'Microsite', path: '/state/microsite' }
        ]
      default:
        return baseLinks
    }
  }

  const privateLinks = getPrivateLinks()

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

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Mexican Pickleball Federation
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              The official authority for pickleball in Mexico. Promoting the sport, 
              organizing competitions and connecting players from across the country.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => window.open('https://facebook.com/pickleballmexico', '_blank')}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button
                onClick={() => window.open('https://instagram.com/pickleballmexico', '_blank')}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348 0-1.297 1.051-2.348 2.348-2.348 1.297 0 2.348 1.051 2.348 2.348 0 1.297-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348 0-1.297 1.051-2.348 2.348-2.348 1.297 0 2.348 1.051 2.348 2.348 0 1.297-1.051 2.348-2.348 2.348z"/>
                </svg>
              </button>
              <button
                onClick={() => window.open('https://twitter.com/pickleballmexico', '_blank')}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {publicLinks.map((link) => (
                <li key={link.path}>
                  <button 
                    onClick={() => handleNavigation(link.path)}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Registration or User Menu */}
          <div>
            {isAuthenticated ? (
              <div>
                <h4 className="font-semibold mb-4">
                  {getRoleDisplayName(user?.role || '')} Menu
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  {privateLinks.slice(0, 6).map((link) => (
                    <li key={link.path}>
                      <button 
                        onClick={() => handleNavigation(link.path)}
                        className="hover:text-white transition-colors"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                  {privateLinks.length > 6 && (
                    <li>
                      <button 
                        onClick={() => handleNavigation('/dashboard')}
                        className="hover:text-white transition-colors text-green-400"
                      >
                        View All →
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ) : (
              <div>
                <h4 className="font-semibold mb-4">Registration</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  {registrationLinks.map((link) => (
                    <li key={link.userType}>
                      <button 
                        onClick={() => handleRegisterClick(link.userType)}
                        className="hover:text-white transition-colors"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="text-sm text-gray-300 space-y-2">
              <div className="flex items-start space-x-2">
                <span>📧</span>
                <div>
                  <a 
                    href="mailto:info@pickleballmexico.org"
                    className="hover:text-white transition-colors"
                  >
                    info@pickleballmexico.org
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span>📱</span>
                <div>
                  <a 
                    href="tel:+525512345678"
                    className="hover:text-white transition-colors"
                  >
                    +52 55 1234 5678
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span>📍</span>
                <div>
                  <address className="not-italic">
                    Mexico City, Mexico
                  </address>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => handleNavigation('/contact')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Links */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold mb-3 text-gray-300">Resources</h5>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <button 
                  onClick={() => handleNavigation('/about')}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
                <button 
                  onClick={() => handleNavigation('/news')}
                  className="hover:text-white transition-colors"
                >
                  News
                </button>
                <button 
                  onClick={() => handleNavigation('/events')}
                  className="hover:text-white transition-colors"
                >
                  Events
                </button>
                <button 
                  onClick={() => handleNavigation('/sponsors')}
                  className="hover:text-white transition-colors"
                >
                  Sponsors
                </button>
                <button 
                  onClick={() => handleNavigation('/careers')}
                  className="hover:text-white transition-colors"
                >
                  Careers
                </button>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-3 text-gray-300">Legal</h5>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <button 
                  onClick={() => handleNavigation('/privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => handleNavigation('/terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
                <button 
                  onClick={() => handleNavigation('/cookies')}
                  className="hover:text-white transition-colors"
                >
                  Cookie Policy
                </button>
                <button 
                  onClick={() => handleNavigation('/accessibility')}
                  className="hover:text-white transition-colors"
                >
                  Accessibility
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-400">
            <p>
              © {currentYear} Mexican Pickleball Federation. All rights reserved.
            </p>
            <p className="mt-1">
              Official governing body for pickleball in Mexico | 
              <button 
                onClick={() => handleNavigation('/sitemap')}
                className="ml-1 hover:text-white transition-colors"
              >
                Sitemap
              </button>
            </p>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer