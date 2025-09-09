import React from 'react'
import { StateMicrositeInfo, StateMicrositeStats } from '../../../store/slices/stateMicrositeSlice'

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
        <div className="h-48 md:h-64 bg-gray-300 rounded-t-lg overflow-hidden">
          <img
            src={micrositeInfo.banner_image_url}
            alt="State Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-6">
            {/* Logo */}
            {micrositeInfo.logo_url && (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={micrositeInfo.logo_url}
                  alt="State Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Title and Description */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{micrositeInfo.title}</h1>
              <p className="text-lg text-gray-600 mt-2">{micrositeInfo.description}</p>
              <div className="flex items-center space-x-4 mt-3">
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                  {micrositeInfo.state_committee.state_name}
                </span>
                {micrositeInfo.established_year && (
                  <span className="text-sm text-gray-500">
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>

        {/* Mission Statement */}
        {micrositeInfo.mission_statement && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Our Mission</h3>
            <p className="text-blue-800">{micrositeInfo.mission_statement}</p>
          </div>
        )}

        {/* Statistics Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total_tournaments}</div>
              <div className="text-sm text-gray-600">Tournaments</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{stats.total_clubs}</div>
              <div className="text-sm text-gray-600">Clubs</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.total_courts}</div>
              <div className="text-sm text-gray-600">Courts</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.total_players}</div>
              <div className="text-sm text-gray-600">Players</div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.upcoming_tournaments}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{stats.active_tournaments}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            
            <div className="bg-teal-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-teal-600">{stats.total_partners}</div>
              <div className="text-sm text-gray-600">Partners</div>
            </div>
            
            <div className="bg-pink-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-pink-600">{stats.total_coaches}</div>
              <div className="text-sm text-gray-600">Coaches</div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contact Details */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {micrositeInfo.contact_email}
              </div>
              {micrositeInfo.contact_phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {micrositeInfo.contact_phone}
                </div>
              )}
              {micrositeInfo.address && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {micrositeInfo.address}
                </div>
              )}
            </div>
          </div>

          {/* Website Link */}
          {micrositeInfo.website_url && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Website</h4>
              <a
                href={micrositeInfo.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Visit Website
              </a>
            </div>
          )}

          {/* Social Media Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Follow Us</h4>
            <div className="flex space-x-3">
              {micrositeInfo.facebook_url && (
                <a
                  href={micrositeInfo.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
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
                  className="text-blue-400 hover:text-blue-600"
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
                  className="text-pink-600 hover:text-pink-800"
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