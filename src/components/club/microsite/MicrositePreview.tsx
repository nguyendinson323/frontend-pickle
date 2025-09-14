import React from 'react'
import { ClubMicrositeData } from '../../../store/slices/clubMicrositeSlice'

interface MicrositePreviewProps {
  micrositeData: ClubMicrositeData | null
  isPreviewMode: boolean
  onClosePreview: () => void
}

const MicrositePreview: React.FC<MicrositePreviewProps> = ({
  micrositeData,
  isPreviewMode,
  onClosePreview
}) => {
  if (!isPreviewMode || !micrositeData) {
    return null
  }

  const formatEstablished = (dateString: string) => {
    return new Date(dateString).getFullYear()
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-0 border w-full max-w-6xl shadow-lg rounded-md bg-white mb-8">
        {/* Preview Header */}
        <div className="px-6 py-4 bg-blue-600 text-white rounded-t-md">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Microsite Preview</h2>
              <p className="text-blue-100 text-sm">This is how your public microsite will appear</p>
            </div>
            <button
              onClick={onClosePreview}
              className="text-blue-100 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="bg-gray-50 p-6 min-h-screen">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="relative">
              {/* Cover Image Placeholder */}
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>
              
              {/* Club Logo and Info */}
              <div className="relative px-6 pb-6">
                <div className="flex items-end -mt-12 mb-4">
                  {micrositeData.logo_url ? (
                    <img
                      src={micrositeData.logo_url}
                      alt={`${micrositeData.name} logo`}
                      className="h-24 w-24 rounded-lg border-4 border-white shadow-lg object-cover bg-white"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-lg border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center">
                      <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                  <div className="ml-4 pb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{micrositeData.name}</h1>
                    <p className="text-lg text-gray-600">{micrositeData.club_type || 'Pickleball Club'}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {micrositeData.state?.name || 'Location not specified'}
                      <span className="mx-2">•</span>
                      <span>Established {formatEstablished(micrositeData.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Contact and Social Links */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {micrositeData.website && (
                    <a
                      href={micrositeData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit Website
                    </a>
                  )}
                  {micrositeData.social_media && (
                    <a
                      href={micrositeData.social_media}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 text-sm"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 9V9a1 1 0 011-1h8a1 1 0 011 1v6M7 15a2 2 0 11-4 0 2 2 0 014 0zM15 15a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Follow Us
                    </a>
                  )}
                  {micrositeData.user.email && (
                    <a
                      href={`mailto:${micrositeData.user.email}`}
                      className="inline-flex items-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact Us
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Club Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* About Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About Our Club</h2>
                <p className="text-gray-600 leading-relaxed">
                  Welcome to {micrositeData.name}, your premier destination for pickleball in {micrositeData.state?.name || 'our area'}. 
                  {micrositeData.club_type && ` As a ${micrositeData.club_type.toLowerCase()}, we`} We pride ourselves on providing excellent facilities 
                  and fostering a welcoming community for players of all skill levels.
                </p>

                {micrositeData.manager_name && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Club Management</h3>
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {micrositeData.manager_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{micrositeData.manager_name}</p>
                        {micrositeData.manager_title && (
                          <p className="text-sm text-gray-500">{micrositeData.manager_title}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Club Stats Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Club Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Courts Available</span>
                    <span className="font-semibold text-gray-900">{micrositeData.courts_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Members</span>
                    <span className="font-semibold text-gray-900">{micrositeData.members_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tournaments Hosted</span>
                    <span className="font-semibold text-gray-900">{micrositeData.tournaments_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Established</span>
                    <span className="font-semibold text-gray-900">{formatEstablished(micrositeData.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Get In Touch</h3>
                <div className="space-y-3">
                  {micrositeData.user.email && (
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">{micrositeData.user.email}</span>
                    </div>
                  )}
                  {micrositeData.user.phone && (
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-600">{micrositeData.user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>This is a preview of your public microsite. Make changes in the editor above.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MicrositePreview