import React, { useState, useCallback } from 'react'
import { StatePartner } from '../../../store/slices/stateManagementSlice'
import { FiActivity, FiEye, FiUser, FiPhone, FiMail, FiGlobe, FiShare2, FiClock, FiHome, FiAward, FiFileText } from 'react-icons/fi'

interface PartnersTabProps {
  partners: StatePartner[]
  onViewPartner: (partner: StatePartner) => void
}

const PartnersTab: React.FC<PartnersTabProps> = ({
  partners,
  onViewPartner
}) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  // Handle image load errors
  const handleImageError = useCallback((partnerId: number) => {
    setImageErrors(prev => new Set(prev).add(partnerId))
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

  // Validate URL format
  const isValidUrl = useCallback((url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }, [])

  return (
    <div className="space-y-4">
      {partners.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-orange-100 to-amber-200 p-8 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg">
            <FiActivity className="w-12 h-12 text-orange-600" />
          </div>
          <h3 className="mt-6 text-xl font-bold text-gray-900">No partners registered</h3>
          <p className="mt-3 text-gray-600 max-w-sm mx-auto leading-relaxed">No business partners have been registered in your state yet. Reach out to local businesses!</p>
        </div>
      ) : (
        partners.map((partner) => {
          const premiumStatus = getPremiumStatus(partner.premium_expires_at)
          
          return (
            <div key={partner.id} className="border border-gray-200/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm transform hover:scale-[1.02] shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center">
                      {partner.logo_url && !imageErrors.has(partner.id) ? (
                        <img
                          src={partner.logo_url}
                          alt={`${partner.business_name || 'Partner'} logo`}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                          onError={() => handleImageError(partner.id)}
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center mr-4 shadow-lg">
                          <FiActivity className="h-6 w-6 text-orange-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {partner.business_name || 'Unnamed Business'}
                        </h3>
                        {partner.partner_type && (
                          <p className="text-sm text-gray-600">{partner.partner_type}</p>
                        )}
                      </div>
                    </div>
                    <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-xl shadow-sm ${premiumStatus.color}`}>
                      {premiumStatus.status}
                    </span>
                    {partner.has_courts && (
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
                    <FiUser className="w-4 h-4 text-indigo-600" />
                    <div className="text-sm text-indigo-700 font-semibold">Contact Person</div>
                  </div>
                  <div className="font-bold text-gray-900">{partner.contact_name || 'Not specified'}</div>
                  {partner.contact_title && (
                    <div className="text-xs text-indigo-600 mt-1">{partner.contact_title}</div>
                  )}
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiFileText className="w-4 h-4 text-purple-600" />
                    <div className="text-sm text-purple-700 font-semibold">RFC</div>
                  </div>
                  <div className="font-bold text-gray-900">{partner.rfc || 'Not provided'}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiHome className="w-4 h-4 text-blue-600" />
                    <div className="text-sm text-blue-700 font-semibold">Courts</div>
                  </div>
                  <div className="font-bold text-gray-900">{partner.courts_count || 0}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiAward className="w-4 h-4 text-green-600" />
                    <div className="text-sm text-green-700 font-semibold">Tournaments</div>
                  </div>
                  <div className="font-bold text-gray-900">{partner.tournaments_count || 0}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-teal-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiMail className="w-4 h-4 text-teal-600" />
                    <div className="text-sm text-teal-700 font-semibold">Contact Information</div>
                  </div>
                  {partner.user?.email ? (
                    <div className="font-bold text-gray-900 flex items-center">
                      <FiMail className="w-3 h-3 mr-2 text-teal-600" />
                      {partner.user.email}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No contact email</div>
                  )}
                  {partner.user?.phone && (
                    <div className="text-sm text-teal-600 mt-1 flex items-center">
                      <FiPhone className="w-3 h-3 mr-2" />
                      {partner.user.phone}
                    </div>
                  )}
                </div>
                <div className="bg-orange-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiGlobe className="w-4 h-4 text-orange-600" />
                    <div className="text-sm text-orange-700 font-semibold">Online Presence</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {partner.website && isValidUrl(partner.website) && (
                      <a
                        href={partner.website.startsWith('http') ? partner.website : `https://${partner.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 rounded-xl text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 font-semibold transition-colors duration-200"
                      >
                        <FiGlobe className="w-3 h-3 mr-1" />
                        Website
                      </a>
                    )}
                    {partner.social_media && isValidUrl(partner.social_media) && (
                      <a
                        href={partner.social_media.startsWith('http') ? partner.social_media : `https://${partner.social_media}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 rounded-xl text-xs bg-purple-100 text-purple-800 hover:bg-purple-200 font-semibold transition-colors duration-200"
                      >
                        <FiShare2 className="w-3 h-3 mr-1" />
                        Social
                      </a>
                    )}
                    {(!partner.website || !isValidUrl(partner.website)) && (!partner.social_media || !isValidUrl(partner.social_media)) && (
                      <div className="text-sm text-gray-500">No online presence</div>
                    )}
                  </div>
                </div>
              </div>

              {partner.premium_expires_at && (
                <div className="mb-6">
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiClock className="w-4 h-4 text-purple-600" />
                      <div className="text-sm text-purple-700 font-semibold">Premium Expires</div>
                    </div>
                    <div className="font-bold text-gray-900">{formatDate(partner.premium_expires_at)}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {partner.created_at ? (
                    `Registered on ${formatDate(partner.created_at)}`
                  ) : (
                    'Registration date unknown'
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewPartner(partner)}
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
}

export default PartnersTab