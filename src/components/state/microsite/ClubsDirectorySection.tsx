import React from 'react'
import { StateMicrositeClub } from '../../../store/slices/stateMicrositeSlice'

interface ClubsDirectorySectionProps {
  clubs: StateMicrositeClub[]
}

const ClubsDirectorySection: React.FC<ClubsDirectorySectionProps> = ({ clubs }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clubs & Facilities</h2>
          <p className="text-gray-600 mt-1">Find pickleball clubs and courts in your area</p>
        </div>
        <div className="text-sm text-gray-500">
          {clubs.length} active club{clubs.length !== 1 ? 's' : ''}
        </div>
      </div>

      {clubs.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No clubs found</h3>
          <p className="mt-1 text-sm text-gray-500">Check back later as new clubs join our network!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div key={club.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="mb-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{club.name}</h3>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm font-medium text-green-600">{club.total_courts} court{club.total_courts !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                {club.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {club.description}
                  </p>
                )}
                
                <div className="space-y-2 text-sm">
                  {club.address && (
                    <div className="flex items-start text-gray-600">
                      <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{club.address}</span>
                    </div>
                  )}

                  {club.contact_phone && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{club.contact_phone}</span>
                    </div>
                  )}

                  {club.contact_email && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{club.contact_email}</span>
                    </div>
                  )}

                  {club.website_url && (
                    <div className="flex items-center">
                      <a
                        href={club.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {(club.membership_fee !== null || club.amenities) && (
                <div className="pt-3 border-t border-gray-100">
                  {club.membership_fee !== null && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">Membership Fee: </span>
                      <span className="text-sm font-medium text-green-600">
                        {club.membership_fee === 0 ? 'Free' : `$${club.membership_fee.toFixed(2)}`}
                      </span>
                    </div>
                  )}

                  {club.amenities && (
                    <div>
                      <span className="text-sm text-gray-500">Amenities: </span>
                      <span className="text-sm text-gray-600">{club.amenities}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors">
                  View Details
                </button>
                {club.contact_email && (
                  <a
                    href={`mailto:${club.contact_email}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors text-center"
                  >
                    Contact
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {clubs.length > 0 && (
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            View All Clubs →
          </button>
        </div>
      )}
    </div>
  )
}

export default ClubsDirectorySection