import React, { useMemo, useCallback, useState } from 'react'
import { StateClub } from '../../../store/slices/stateManagementSlice'

interface ClubsTabProps {
  clubs: StateClub[]
  onViewClub: (club: StateClub) => void
}

const ClubsTab: React.FC<ClubsTabProps> = React.memo(({
  clubs,
  onViewClub
}) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  // Memoized status calculation functions with timezone fixes
  const getAffiliationStatus = useCallback((expiryDate: string | null) => {
    if (!expiryDate) return { status: 'No Expiry', color: 'bg-blue-100 text-blue-800' }

    try {
      const expiry = new Date(expiryDate + 'T23:59:59.999Z') // Set to end of day UTC
      const now = new Date()
      const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays < 0) {
        return { status: 'Expired', color: 'bg-red-100 text-red-800' }
      } else if (diffDays <= 30) {
        return { status: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800' }
      }
      return { status: 'Active', color: 'bg-green-100 text-green-800' }
    } catch (error) {
      console.error('Invalid affiliation expiry date:', expiryDate)
      return { status: 'Invalid Date', color: 'bg-gray-100 text-gray-800' }
    }
  }, [])

  const getPremiumStatus = useCallback((expiryDate: string | null) => {
    if (!expiryDate) return { status: 'Basic', color: 'bg-gray-100 text-gray-800' }

    try {
      const expiry = new Date(expiryDate + 'T23:59:59.999Z')
      const now = new Date()
      const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays < 0) {
        return { status: 'Expired', color: 'bg-red-100 text-red-800' }
      } else if (diffDays <= 30) {
        return { status: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800' }
      }
      return { status: 'Premium', color: 'bg-purple-100 text-purple-800' }
    } catch (error) {
      console.error('Invalid premium expiry date:', expiryDate)
      return { status: 'Invalid Date', color: 'bg-gray-100 text-gray-800' }
    }
  }, [])

  // Safe date formatting
  const formatDate = useCallback((dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (error) {
      console.error('Invalid date string:', dateString)
      return 'Invalid Date'
    }
  }, [])

  // Handle image load errors
  const handleImageError = useCallback((clubId: number) => {
    setImageErrors(prev => new Set(prev).add(clubId))
  }, [])

  // Validate URL format
  const isValidUrl = useCallback((url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }, [])

  // Memoize valid clubs list
  const validClubs = useMemo(() => {
    return Array.isArray(clubs) ? clubs.filter(c => c && c.id) : []
  }, [clubs])

  return (
    <div className="space-y-4">
      {clubs.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No clubs registered</h3>
          <p className="mt-1 text-sm text-gray-500">No clubs have been registered in your state yet.</p>
        </div>
      ) : (
        validClubs.map((club) => {
          const affiliationStatus = getAffiliationStatus(club.affiliation_expires_at)
          const premiumStatus = getPremiumStatus(club.premium_expires_at)
          
          return (
            <div key={club.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center">
                      {club.logo_url && !imageErrors.has(club.id) ? (
                        <img
                          src={club.logo_url}
                          alt={`${club.name || 'Club'} logo`}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                          onError={() => handleImageError(club.id)}
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-300 flex items-center justify-center mr-3">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {club.name || 'Unnamed Club'}
                        </h3>
                        {club.club_type && (
                          <p className="text-sm text-gray-600">{club.club_type}</p>
                        )}
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${affiliationStatus.color}`}>
                      {affiliationStatus.status}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${premiumStatus.color}`}>
                      {premiumStatus.status}
                    </span>
                    {club.has_courts && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Has Courts
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Manager</div>
                  <div className="font-medium">{club.manager_name || 'Not specified'}</div>
                  {club.manager_title && (
                    <div className="text-xs text-gray-500">{club.manager_title}</div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-gray-500">Members</div>
                  <div className="font-medium">{club.members_count || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Courts</div>
                  <div className="font-medium">{club.courts_count || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Tournaments</div>
                  <div className="font-medium">{club.tournaments_count || 0}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Contact Information</div>
                  {club.user?.email ? (
                    <div className="font-medium">{club.user.email}</div>
                  ) : (
                    <div className="text-sm text-gray-400">No contact email</div>
                  )}
                  {club.user?.phone && (
                    <div className="text-sm text-gray-600">{club.user.phone}</div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-gray-500">Online Presence</div>
                  <div className="flex items-center space-x-2">
                    {club.website && isValidUrl(club.website) && (
                      <a
                        href={club.website.startsWith('http') ? club.website : `https://${club.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Website
                      </a>
                    )}
                    {club.social_media && isValidUrl(club.social_media) && (
                      <a
                        href={club.social_media.startsWith('http') ? club.social_media : `https://${club.social_media}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800 hover:bg-purple-200"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 9V9a1 1 0 011-1h8a1 1 0 011 1v6M7 15a2 2 0 11-4 0 2 2 0 014 0zM15 15a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Social
                      </a>
                    )}
                    {(!club.website || !isValidUrl(club.website)) && (!club.social_media || !isValidUrl(club.social_media)) && (
                      <div className="text-sm text-gray-400">No online presence</div>
                    )}
                  </div>
                </div>
              </div>

              {(club.affiliation_expires_at || club.premium_expires_at) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  {club.affiliation_expires_at && (
                    <div>
                      <div className="text-sm text-gray-500">Affiliation Expires</div>
                      <div className="font-medium">{formatDate(club.affiliation_expires_at)}</div>
                    </div>
                  )}
                  {club.premium_expires_at && (
                    <div>
                      <div className="text-sm text-gray-500">Premium Expires</div>
                      <div className="font-medium">{formatDate(club.premium_expires_at)}</div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {club.created_at ? (
                    `Registered on ${formatDate(club.created_at)}`
                  ) : (
                    'Registration date unknown'
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewClub(club)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
})

export default ClubsTab