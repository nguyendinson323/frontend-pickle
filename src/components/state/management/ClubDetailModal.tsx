import React from 'react'
import { StateClub } from '../../../store/slices/stateManagementSlice'

interface ClubDetailModalProps {
  isOpen: boolean
  onClose: () => void
  club: StateClub | null
}

const ClubDetailModal: React.FC<ClubDetailModalProps> = ({
  isOpen,
  onClose,
  club
}) => {
  if (!isOpen || !club) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getAffiliationStatus = (expiryDate: string | null) => {
    if (!expiryDate) return { status: 'Not Affiliated', color: 'bg-gray-100 text-gray-800' }

    const expiry = new Date(expiryDate)
    const now = new Date()

    if (expiry < now) {
      return { status: 'Expired', color: 'bg-red-100 text-red-800' }
    } else if ((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 30) {
      return { status: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800' }
    }
    return { status: 'Active', color: 'bg-green-100 text-green-800' }
  }

  const affiliationStatus = getAffiliationStatus(club.affiliation_expires_at)

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Club Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {club.logo_url ? (
                  <img
                    src={club.logo_url}
                    alt={`${club.name} logo`}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-gray-300 flex items-center justify-center">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{club.name}</h2>
                  {club.club_type && (
                    <p className="text-gray-600">{club.club_type} Club</p>
                  )}
                </div>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${affiliationStatus.color}`}>
                {affiliationStatus.status}
              </span>
            </div>


            {/* Club Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Club Information</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Total Members</div>
                    <div className="font-medium">{club.members_count || 0}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Owned Courts</div>
                    <div className="font-medium">{club.courts_count || 0}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Tournaments Organized</div>
                    <div className="font-medium">{club.tournaments_count || 0}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{club.user.email}</div>
                  </div>
                  {club.user.phone && (
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium">{club.user.phone}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Online Presence */}
            {(club.website || club.social_media) && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Online Presence</h4>
                <div className="flex items-center space-x-4">
                  {club.website && (
                    <a
                      href={club.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 rounded-md text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Website
                    </a>
                  )}
                  {club.social_media && (
                    <a
                      href={club.social_media}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 rounded-md text-sm bg-purple-100 text-purple-800 hover:bg-purple-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 9V9a1 1 0 011-1h8a1 1 0 011 1v6M7 15a2 2 0 11-4 0 2 2 0 014 0zM15 15a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Social Media
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Affiliation Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Affiliation Status</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Current Status</div>
                    <div className="font-medium">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${affiliationStatus.color}`}>
                        {affiliationStatus.status}
                      </span>
                    </div>
                  </div>
                  {club.affiliation_expires_at && (
                    <div>
                      <div className="text-sm text-gray-500">Expires On</div>
                      <div className="font-medium">{formatDate(club.affiliation_expires_at)}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-500">Member Since</div>
                    <div className="font-medium">{formatDate(club.created_at)}</div>
                  </div>
                </div>
              </div>
            </div>



          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClubDetailModal