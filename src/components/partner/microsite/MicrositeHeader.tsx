import React from 'react'
import { PartnerMicrositeInfo, MicrositeStats } from '../../../store/slices/partnerMicrositeSlice'

interface MicrositeHeaderProps {
  micrositeInfo: PartnerMicrositeInfo | null
  stats: MicrositeStats | null
  isOwner: boolean
  onEdit: () => void
}

const MicrositeHeader: React.FC<MicrositeHeaderProps> = ({
  micrositeInfo,
  stats,
  isOwner,
  onEdit
}) => {
  if (!micrositeInfo) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
        <div className="px-6 py-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6 overflow-hidden">
      {micrositeInfo.banner_url && (
        <div className="h-48 bg-gray-200 relative">
          <img
            src={micrositeInfo.banner_url}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
      )}
      
      <div className="px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start space-x-4">
            {micrositeInfo.logo_url ? (
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  src={micrositeInfo.logo_url}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-purple-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {micrositeInfo.title}
                </h1>
                {!micrositeInfo.is_active && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
              </div>
              
              <div className="text-lg text-gray-600 mb-2">
                {micrositeInfo.partner.business_name}
                {micrositeInfo.partner.partner_type && (
                  <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    {micrositeInfo.partner.partner_type}
                  </span>
                )}
              </div>
              
              {micrositeInfo.description && (
                <p className="text-gray-700 mb-4 max-w-2xl">
                  {micrositeInfo.description}
                </p>
              )}

              {micrositeInfo.partner.contact_name && (
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{micrositeInfo.partner.contact_name}</span>
                    {micrositeInfo.partner.contact_title && (
                      <span className="ml-1 text-gray-500">({micrositeInfo.partner.contact_title})</span>
                    )}
                  </div>

                  {micrositeInfo.partner.website && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <a href={micrositeInfo.partner.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                        Website
                      </a>
                    </div>
                  )}

                  {micrositeInfo.partner.has_courts && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-600">Has Courts</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="mt-6 lg:mt-0 lg:ml-6 flex-shrink-0">
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Edit Microsite
              </button>
            </div>
          )}
        </div>

        {stats && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total_courts}</div>
                <div className="text-sm text-gray-600">Total Courts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.active_courts}</div>
                <div className="text-sm text-gray-600">Active Courts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.total_tournaments}</div>
                <div className="text-sm text-gray-600">Tournaments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.upcoming_tournaments}</div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.total_reservations}</div>
                <div className="text-sm text-gray-600">Reservations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${(stats.total_revenue / 1000).toFixed(1)}K
                </div>
                <div className="text-sm text-gray-600">Revenue</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MicrositeHeader