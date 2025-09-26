import React from 'react'
import { StateMicrositeInfo, StateMicrositeStats } from '../../../store/slices/stateMicrositeSlice'
import { FiEdit, FiMail, FiPhone, FiMapPin, FiGlobe, FiExternalLink, FiAward, FiUsers, FiHome, FiCalendar } from 'react-icons/fi'

interface MicrositeHeaderProps {
  micrositeInfo: StateMicrositeInfo | null
  stats: StateMicrositeStats | null
  isOwner?: boolean
  onEdit?: () => void
}

const MicrositeHeader: React.FC<MicrositeHeaderProps> = ({ micrositeInfo, stats, isOwner, onEdit }) => {
  if (!micrositeInfo) return null

  return (
    <div className="relative">
      {/* Banner Image */}
      {micrositeInfo.banner_image_url && (
        <div className="h-48 md:h-64 bg-gradient-to-r from-gray-300 to-gray-400 rounded-t-3xl overflow-hidden relative">
          <img
            src={micrositeInfo.banner_image_url}
            alt="State Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      )}
      
      <div className={`bg-gradient-to-br from-white to-blue-50/30 ${micrositeInfo.banner_image_url ? 'rounded-b-3xl' : 'rounded-3xl'} shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm`}>
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8 space-y-6 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Logo */}
            {micrositeInfo.logo_url && (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 shadow-lg ring-4 ring-white">
                <img
                  src={micrositeInfo.logo_url}
                  alt="State Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Title and Description */}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">{micrositeInfo.title}</h1>
              <p className="text-lg md:text-xl text-gray-600 mb-4 leading-relaxed">{micrositeInfo.description}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <FiHome className="w-4 h-4 mr-2" />
                  {micrositeInfo.state_committee.state_name}
                </span>
                {micrositeInfo.established_year && (
                  <span className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl shadow-sm bg-gradient-to-r from-green-100 to-green-200 text-green-800">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    Est. {micrositeInfo.established_year}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Edit Button for Owners */}
          {isOwner && onEdit && (
            <button
              onClick={onEdit}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <FiEdit className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Mission Statement */}
        {micrositeInfo.mission_statement && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-500 p-2 rounded-xl">
                <FiAward className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-900">Our Mission</h3>
            </div>
            <p className="text-blue-800 leading-relaxed text-lg">{micrositeInfo.mission_statement}</p>
          </div>
        )}

        {/* Statistics Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            <div className="group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl text-center shadow-xl transform transition-all duration-300 hover:scale-105">
                <div className="bg-white/20 p-2 rounded-xl w-fit mx-auto mb-2">
                  <FiAward className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stats.total_tournaments}</div>
                <div className="text-xs text-blue-100 font-semibold">Tournaments</div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl text-center shadow-xl transform transition-all duration-300 hover:scale-105">
                <div className="bg-white/20 p-2 rounded-xl w-fit mx-auto mb-2">
                  <FiHome className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stats.total_clubs}</div>
                <div className="text-xs text-green-100 font-semibold">Clubs</div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl text-center shadow-xl transform transition-all duration-300 hover:scale-105">
                <div className="bg-white/20 p-2 rounded-xl w-fit mx-auto mb-2">
                  <FiHome className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stats.total_courts}</div>
                <div className="text-xs text-purple-100 font-semibold">Courts</div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl text-center shadow-xl transform transition-all duration-300 hover:scale-105">
                <div className="bg-white/20 p-2 rounded-xl w-fit mx-auto mb-2">
                  <FiUsers className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stats.total_players}</div>
                <div className="text-xs text-orange-100 font-semibold">Players</div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-2xl text-center shadow-xl transform transition-all duration-300 hover:scale-105">
                <div className="bg-white/20 p-2 rounded-xl w-fit mx-auto mb-2">
                  <FiCalendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stats.upcoming_tournaments}</div>
                <div className="text-xs text-indigo-100 font-semibold">Upcoming</div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl text-center shadow-xl transform transition-all duration-300 hover:scale-105">
                <div className="bg-white/20 p-2 rounded-xl w-fit mx-auto mb-2">
                  <FiAward className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stats.active_tournaments}</div>
                <div className="text-xs text-red-100 font-semibold">Active</div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-4 rounded-2xl text-center shadow-xl transform transition-all duration-300 hover:scale-105">
                <div className="bg-white/20 p-2 rounded-xl w-fit mx-auto mb-2">
                  <FiUsers className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stats.total_partners}</div>
                <div className="text-xs text-teal-100 font-semibold">Partners</div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-4 rounded-2xl text-center shadow-xl transform transition-all duration-300 hover:scale-105">
                <div className="bg-white/20 p-2 rounded-xl w-fit mx-auto mb-2">
                  <FiUsers className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stats.total_coaches}</div>
                <div className="text-xs text-pink-100 font-semibold">Coaches</div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contact Details */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-xl">
                <FiMail className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 text-lg">Contact Information</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FiMail className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-sm text-gray-900 font-semibold">{micrositeInfo.contact_email}</p>
                </div>
              </div>
              {micrositeInfo.contact_phone && (
                <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FiPhone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                    <p className="text-sm text-gray-900 font-semibold">{micrositeInfo.contact_phone}</p>
                  </div>
                </div>
              )}
              {micrositeInfo.address && (
                <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FiMapPin className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">Address</p>
                    <p className="text-sm text-gray-900 font-semibold">{micrositeInfo.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Website Link */}
          {micrositeInfo.website_url && (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-indigo-100 p-2 rounded-xl">
                  <FiGlobe className="w-5 h-5 text-indigo-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg">Website</h4>
              </div>
              <a
                href={micrositeInfo.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2 w-fit"
              >
                <FiExternalLink className="w-5 h-5" />
                <span>Visit Website</span>
              </a>
            </div>
          )}

          {/* Social Media Links */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-pink-100 p-2 rounded-xl">
                <FiUsers className="w-5 h-5 text-pink-600" />
              </div>
              <h4 className="font-bold text-gray-900 text-lg">Follow Us</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {micrositeInfo.facebook_url && (
                <a
                  href={micrositeInfo.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all duration-200 hover:scale-110 shadow-lg"
                  title="Follow on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {micrositeInfo.twitter_url && (
                <a
                  href={micrositeInfo.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-blue-400 hover:bg-blue-500 text-white p-3 rounded-xl transition-all duration-200 hover:scale-110 shadow-lg"
                  title="Follow on Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              )}
              {micrositeInfo.instagram_url && (
                <a
                  href={micrositeInfo.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-xl transition-all duration-200 hover:scale-110 shadow-lg"
                  title="Follow on Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.71 13.743 3.71 12.446s.487-2.449 1.416-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.874 1.416 2.026 1.416 3.323s-.488 2.449-1.416 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.518 0c-1.297 0-2.448-.49-3.323-1.297-.928-.874-1.416-2.026-1.416-3.323s.488-2.449 1.416-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.874 1.416 2.026 1.416 3.323s-.488 2.449-1.416 3.323c-.875.807-2.026 1.297-3.323 1.297z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MicrositeHeader