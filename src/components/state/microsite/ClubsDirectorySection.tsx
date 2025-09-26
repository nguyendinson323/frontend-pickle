import React from 'react'
import { StateMicrositeClub } from '../../../store/slices/stateMicrositeSlice'
import { FiHome, FiMapPin, FiPhone, FiMail, FiGlobe, FiDollarSign, FiUsers, FiEye, FiArrowRight, FiExternalLink } from 'react-icons/fi'

interface ClubsDirectorySectionProps {
  clubs: StateMicrositeClub[]
}

const ClubsDirectorySection: React.FC<ClubsDirectorySectionProps> = ({ clubs }) => {
  return (
    <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-3xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-purple-500 p-3 rounded-2xl shadow-lg">
              <FiHome className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Clubs & Facilities</h2>
          </div>
          <p className="text-gray-600 text-lg">Find pickleball clubs and courts in your area</p>
        </div>
        <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-xl font-bold text-sm">
          {clubs.length} active club{clubs.length !== 1 ? 's' : ''}
        </div>
      </div>

      {clubs.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-100 to-purple-200 p-8 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg mb-6">
            <FiHome className="w-12 h-12 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No clubs found</h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">Check back later as new clubs join our network!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div key={club.id} className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{club.name}</h3>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-xl flex items-center space-x-1 font-bold text-sm">
                    <FiHome className="w-3 h-3" />
                    <span>{club.total_courts} court{club.total_courts !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                {club.description && (
                  <div className="bg-white/60 rounded-xl p-3 mb-4 backdrop-blur-sm">
                    <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                      {club.description}
                    </p>
                  </div>
                )}
                
                <div className="space-y-3">
                  {club.address && (
                    <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="bg-purple-100 p-1 rounded-lg">
                          <FiMapPin className="w-3 h-3 text-purple-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{club.address}</span>
                    </div>
                  )}

                  {club.contact_phone && (
                    <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="bg-blue-100 p-1 rounded-lg">
                          <FiPhone className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{club.contact_phone}</span>
                    </div>
                  )}

                  {club.contact_email && (
                    <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="bg-green-100 p-1 rounded-lg">
                          <FiMail className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{club.contact_email}</span>
                    </div>
                  )}

                  {club.website_url && (
                    <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="bg-indigo-100 p-1 rounded-lg">
                          <FiGlobe className="w-3 h-3 text-indigo-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Website</span>
                      </div>
                      <a
                        href={club.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 text-sm"
                      >
                        <FiExternalLink className="w-3 h-3" />
                        <span>Visit Website</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {(club.membership_fee !== null || club.amenities) && (
                <div className="mt-4 space-y-3">
                  {club.membership_fee !== null && (
                    <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="bg-green-100 p-1 rounded-lg">
                          <FiDollarSign className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Membership Fee</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {club.membership_fee === 0 ? 'Free' : `$${club.membership_fee.toFixed(2)}`}
                      </span>
                    </div>
                  )}

                  {club.amenities && (
                    <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="bg-orange-100 p-1 rounded-lg">
                          <FiUsers className="w-3 h-3 text-orange-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amenities</span>
                      </div>
                      <span className="text-sm text-gray-900 font-medium">{club.amenities}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2">
                  <FiEye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                {club.contact_email && (
                  <a
                    href={`mailto:${club.contact_email}`}
                    className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 text-center flex items-center justify-center space-x-2"
                  >
                    <FiMail className="w-4 h-4" />
                    <span>Contact</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {clubs.length > 0 && (
        <div className="mt-8 text-center">
          <button className="group bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2 mx-auto">
            <span>View All Clubs</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      )}
    </div>
  )
}

export default ClubsDirectorySection