import React, { useMemo, useCallback, useState } from 'react'
import { StateClub } from '../../../store/slices/stateManagementSlice'
import { FiUsers, FiEye, FiMapPin, FiPhone, FiMail, FiGlobe, FiCalendar, FiHome, FiAward, FiClock, FiShare2 } from 'react-icons/fi'

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
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-purple-100 to-indigo-200 p-8 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg">
            <FiUsers className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="mt-6 text-xl font-bold text-gray-900">No clubs registered</h3>
          <p className="mt-3 text-gray-600 max-w-sm mx-auto leading-relaxed">No clubs have been registered in your state yet. Encourage local communities to join!</p>
        </div>
      ) : (
        validClubs.map((club) => {
          const affiliationStatus = getAffiliationStatus(club.affiliation_expires_at)
          const premiumStatus = getPremiumStatus(club.premium_expires_at)
          
          return (
            <div key={club.id} className="border border-gray-200/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm transform hover:scale-[1.02] shadow-lg">
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
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center mr-4 shadow-lg">
                          <FiUsers className="h-6 w-6 text-purple-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {club.name || 'Unnamed Club'}
                        </h3>
                        {club.club_type && (
                          <p className="text-sm text-gray-600">{club.club_type}</p>
                        )}
                      </div>
                    </div>
                    <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-xl shadow-sm ${affiliationStatus.color}`}>
                      {affiliationStatus.status}
                    </span>
                    <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-xl shadow-sm ${premiumStatus.color}`}>
                      {premiumStatus.status}
                    </span>
                    {club.has_courts && (
                      <span className="inline-flex items-center px-3 py-2 text-sm font-bold rounded-xl shadow-sm bg-blue-100 text-blue-800">
                        <FiHome className="w-3 h-3 mr-1" />
                        Has Courts
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiUsers className="w-4 h-4 text-indigo-600" />
                    <div className="text-sm text-indigo-700 font-semibold">Manager</div>
                  </div>
                  <div className="font-bold text-gray-900">{club.manager_name || 'Not specified'}</div>
                  {club.manager_title && (
                    <div className="text-xs text-indigo-600 mt-1">{club.manager_title}</div>
                  )}
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiUsers className="w-4 h-4 text-green-600" />
                    <div className="text-sm text-green-700 font-semibold">Members</div>
                  </div>
                  <div className="font-bold text-gray-900">{club.members_count || 0}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiHome className="w-4 h-4 text-blue-600" />
                    <div className="text-sm text-blue-700 font-semibold">Courts</div>
                  </div>
                  <div className="font-bold text-gray-900">{club.courts_count || 0}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiAward className="w-4 h-4 text-purple-600" />
                    <div className="text-sm text-purple-700 font-semibold">Tournaments</div>
                  </div>
                  <div className="font-bold text-gray-900">{club.tournaments_count || 0}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-teal-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiMail className="w-4 h-4 text-teal-600" />
                    <div className="text-sm text-teal-700 font-semibold">Contact Information</div>
                  </div>
                  {club.user?.email ? (
                    <div className="font-bold text-gray-900 flex items-center">
                      <FiMail className="w-3 h-3 mr-2 text-teal-600" />
                      {club.user.email}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No contact email</div>
                  )}
                  {club.user?.phone && (
                    <div className="text-sm text-teal-600 mt-1 flex items-center">
                      <FiPhone className="w-3 h-3 mr-2" />
                      {club.user.phone}
                    </div>
                  )}
                </div>
                <div className="bg-orange-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiGlobe className="w-4 h-4 text-orange-600" />
                    <div className="text-sm text-orange-700 font-semibold">Online Presence</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {club.website && isValidUrl(club.website) && (
                      <a
                        href={club.website.startsWith('http') ? club.website : `https://${club.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 rounded-xl text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 font-semibold transition-colors duration-200"
                      >
                        <FiGlobe className="w-3 h-3 mr-1" />
                        Website
                      </a>
                    )}
                    {club.social_media && isValidUrl(club.social_media) && (
                      <a
                        href={club.social_media.startsWith('http') ? club.social_media : `https://${club.social_media}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 rounded-xl text-xs bg-purple-100 text-purple-800 hover:bg-purple-200 font-semibold transition-colors duration-200"
                      >
                        <FiShare2 className="w-3 h-3 mr-1" />
                        Social
                      </a>
                    )}
                    {(!club.website || !isValidUrl(club.website)) && (!club.social_media || !isValidUrl(club.social_media)) && (
                      <div className="text-sm text-gray-500">No online presence</div>
                    )}
                  </div>
                </div>
              </div>

              {(club.affiliation_expires_at || club.premium_expires_at) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {club.affiliation_expires_at && (
                    <div className="bg-yellow-50 p-4 rounded-xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <FiCalendar className="w-4 h-4 text-yellow-600" />
                        <div className="text-sm text-yellow-700 font-semibold">Affiliation Expires</div>
                      </div>
                      <div className="font-bold text-gray-900">{formatDate(club.affiliation_expires_at)}</div>
                    </div>
                  )}
                  {club.premium_expires_at && (
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <FiClock className="w-4 h-4 text-purple-600" />
                        <div className="text-sm text-purple-700 font-semibold">Premium Expires</div>
                      </div>
                      <div className="font-bold text-gray-900">{formatDate(club.premium_expires_at)}</div>
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
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 hover:scale-105"
                  >
                    <FiEye className="w-4 h-4" />
                    <span>View Details</span>
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