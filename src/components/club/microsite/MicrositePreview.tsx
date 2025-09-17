import React from 'react'
import { ClubMicrositeData } from '../../../store/slices/clubMicrositeSlice'
import {
  FiX,
  FiEye,
  FiMapPin,
  FiCalendar,
  FiExternalLink,
  FiShare2,
  FiMail,
  FiPhone,
  FiUser,
  FiUsers,
  FiMap,
  FiAward,
  FiInfo,
  FiGlobe
} from 'react-icons/fi'

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
    <div className="fixed inset-0 bg-black bg-opacity-70 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-7xl bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden mx-auto my-8">
        {/* Preview Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-6 border-b-4 border-indigo-800">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <FiEye className="h-7 w-7 mr-3" />
                Microsite Preview
              </h2>
              <p className="text-indigo-100 text-sm font-medium mt-1">This is how your public microsite will appear to visitors</p>
            </div>
            <button
              onClick={onClosePreview}
              className="p-3 text-white hover:text-gray-200 rounded-2xl hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 min-h-screen">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-white to-indigo-50 border border-indigo-200 rounded-3xl shadow-2xl mb-10">
            <div className="relative">
              {/* Cover Image Placeholder */}
              <div className="h-64 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 rounded-t-3xl"></div>

              {/* Club Logo and Info */}
              <div className="relative px-8 pb-8">
                <div className="flex items-end -mt-16 mb-6">
                  {micrositeData.logo_url ? (
                    <img
                      src={micrositeData.logo_url}
                      alt={`${micrositeData.name} logo`}
                      className="h-32 w-32 rounded-2xl border-4 border-white shadow-2xl object-cover bg-white"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-2xl border-4 border-white shadow-2xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <FiGlobe className="h-12 w-12 text-gray-600" />
                    </div>
                  )}
                  <div className="ml-6 pb-2">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{micrositeData.name}</h1>
                    <p className="text-xl text-gray-600 font-medium">{micrositeData.club_type || 'Pickleball Club'}</p>
                    <div className="flex items-center mt-3 text-sm text-gray-500 font-medium">
                      <FiMapPin className="w-5 h-5 mr-2 text-indigo-500" />
                      {micrositeData.state?.name || 'Location not specified'}
                      <span className="mx-3 text-gray-400">•</span>
                      <FiCalendar className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>Established {formatEstablished(micrositeData.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Contact and Social Links */}
                <div className="flex flex-wrap gap-4 mt-6">
                  {micrositeData.website && (
                    <a
                      href={micrositeData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-100 text-blue-700 rounded-2xl hover:from-blue-100 hover:to-indigo-200 font-bold shadow-md hover:shadow-lg transition-all duration-200 border border-blue-200"
                    >
                      <FiExternalLink className="w-5 h-5 mr-2" />
                      Visit Website
                    </a>
                  )}
                  {micrositeData.social_media && (
                    <a
                      href={micrositeData.social_media}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-100 text-purple-700 rounded-2xl hover:from-purple-100 hover:to-pink-200 font-bold shadow-md hover:shadow-lg transition-all duration-200 border border-purple-200"
                    >
                      <FiShare2 className="w-5 h-5 mr-2" />
                      Follow Us
                    </a>
                  )}
                  {micrositeData.user.email && (
                    <a
                      href={`mailto:${micrositeData.user.email}`}
                      className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-100 text-green-700 rounded-2xl hover:from-green-100 hover:to-emerald-200 font-bold shadow-md hover:shadow-lg transition-all duration-200 border border-green-200"
                    >
                      <FiMail className="w-5 h-5 mr-2" />
                      Contact Us
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Club Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* About Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-3xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiInfo className="h-6 w-6 mr-3 text-blue-600" />
                  About Our Club
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg font-medium">
                  Welcome to {micrositeData.name}, your premier destination for pickleball in {micrositeData.state?.name || 'our area'}.
                  {micrositeData.club_type && ` As a ${micrositeData.club_type.toLowerCase()}, we`} We pride ourselves on providing excellent facilities
                  and fostering a welcoming community for players of all skill levels.
                </p>

                {micrositeData.manager_name && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <FiUser className="h-5 w-5 mr-2 text-indigo-600" />
                      Club Management
                    </h3>
                    <div className="flex items-center">
                      <div className="h-14 w-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-lg font-bold text-white">
                          {micrositeData.manager_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-bold text-gray-900">{micrositeData.manager_name}</p>
                        {micrositeData.manager_title && (
                          <p className="text-sm text-gray-600 font-medium">{micrositeData.manager_title}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Club Stats Sidebar */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-white to-green-50 border border-green-200 rounded-3xl shadow-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiMap className="h-6 w-6 mr-3 text-green-600" />
                  Club Statistics
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-white border border-blue-200 rounded-2xl shadow-sm">
                    <div className="flex items-center">
                      <FiMap className="h-5 w-5 mr-3 text-blue-500" />
                      <span className="text-gray-700 font-bold">Courts Available</span>
                    </div>
                    <span className="font-bold text-blue-600 text-lg">{micrositeData.courts_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white border border-green-200 rounded-2xl shadow-sm">
                    <div className="flex items-center">
                      <FiUsers className="h-5 w-5 mr-3 text-green-500" />
                      <span className="text-gray-700 font-bold">Active Members</span>
                    </div>
                    <span className="font-bold text-green-600 text-lg">{micrositeData.members_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white border border-purple-200 rounded-2xl shadow-sm">
                    <div className="flex items-center">
                      <FiAward className="h-5 w-5 mr-3 text-purple-500" />
                      <span className="text-gray-700 font-bold">Tournaments Hosted</span>
                    </div>
                    <span className="font-bold text-purple-600 text-lg">{micrositeData.tournaments_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white border border-indigo-200 rounded-2xl shadow-sm">
                    <div className="flex items-center">
                      <FiCalendar className="h-5 w-5 mr-3 text-indigo-500" />
                      <span className="text-gray-700 font-bold">Established</span>
                    </div>
                    <span className="font-bold text-indigo-600 text-lg">{formatEstablished(micrositeData.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-gradient-to-br from-white to-orange-50 border border-orange-200 rounded-3xl shadow-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiMail className="h-6 w-6 mr-3 text-orange-600" />
                  Get In Touch
                </h3>
                <div className="space-y-4">
                  {micrositeData.user.email && (
                    <div className="flex items-center p-4 bg-white border border-blue-200 rounded-2xl shadow-sm">
                      <FiMail className="w-5 h-5 text-blue-500 mr-4 flex-shrink-0" />
                      <span className="text-gray-700 font-medium break-all">{micrositeData.user.email}</span>
                    </div>
                  )}
                  {micrositeData.user.phone && (
                    <div className="flex items-center p-4 bg-white border border-green-200 rounded-2xl shadow-sm">
                      <FiPhone className="w-5 h-5 text-green-500 mr-4 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{micrositeData.user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center p-6 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 rounded-2xl shadow-lg">
            <p className="text-indigo-700 font-bold text-lg flex items-center justify-center">
              <FiEye className="h-5 w-5 mr-2" />
              This is a preview of your public microsite. Make changes in the editor above.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MicrositePreview