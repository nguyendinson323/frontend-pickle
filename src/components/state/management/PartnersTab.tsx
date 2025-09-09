import React from 'react'
import { StatePartner } from '../../../store/slices/stateManagementSlice'

interface PartnersTabProps {
  partners: StatePartner[]
  onViewPartner: (partner: StatePartner) => void
}

const PartnersTab: React.FC<PartnersTabProps> = ({
  partners,
  onViewPartner
}) => {
  const getPremiumStatus = (expiryDate: string | null) => {
    if (!expiryDate) return { status: 'Basic', color: 'bg-gray-100 text-gray-800' }
    
    const expiry = new Date(expiryDate)
    const now = new Date()
    
    if (expiry < now) {
      return { status: 'Expired', color: 'bg-red-100 text-red-800' }
    } else if ((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 30) {
      return { status: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800' }
    }
    return { status: 'Premium', color: 'bg-purple-100 text-purple-800' }
  }

  return (
    <div className="space-y-4">
      {partners.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No partners registered</h3>
          <p className="mt-1 text-sm text-gray-500">No business partners have been registered in your state yet.</p>
        </div>
      ) : (
        partners.map((partner) => {
          const premiumStatus = getPremiumStatus(partner.premium_expires_at)
          
          return (
            <div key={partner.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center">
                      {partner.logo_url ? (
                        <img
                          src={partner.logo_url}
                          alt={`${partner.business_name} logo`}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-300 flex items-center justify-center mr-3">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{partner.business_name}</h3>
                        {partner.partner_type && (
                          <p className="text-sm text-gray-600">{partner.partner_type}</p>
                        )}
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${premiumStatus.color}`}>
                      {premiumStatus.status}
                    </span>
                    {partner.has_courts && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Has Courts
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Contact Person</div>
                  <div className="font-medium">{partner.contact_name || 'Not specified'}</div>
                  {partner.contact_title && (
                    <div className="text-xs text-gray-500">{partner.contact_title}</div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-gray-500">RFC</div>
                  <div className="font-medium">{partner.rfc || 'Not provided'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Courts</div>
                  <div className="font-medium">{partner.courts_count || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Tournaments</div>
                  <div className="font-medium">{partner.tournaments_count || 0}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Contact Information</div>
                  <div className="font-medium">{partner.user.email}</div>
                  {partner.user.phone && (
                    <div className="text-sm text-gray-600">{partner.user.phone}</div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-gray-500">Online Presence</div>
                  <div className="flex items-center space-x-2">
                    {partner.website && (
                      <a
                        href={partner.website}
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
                    {partner.social_media && (
                      <a
                        href={partner.social_media}
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
                  </div>
                </div>
              </div>

              {partner.premium_expires_at && (
                <div className="mb-4 p-3  rounded-lg">
                  <div>
                    <div className="text-sm text-gray-500">Premium Expires</div>
                    <div className="font-medium">{new Date(partner.premium_expires_at).toLocaleDateString()}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Registered on {new Date(partner.created_at).toLocaleDateString()}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewPartner(partner)}
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
}

export default PartnersTab