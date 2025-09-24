import React from 'react'
import { PartnerMicrositeInfo, MicrositeStats } from '../../../store/slices/partnerMicrositeSlice'
import {
  FiHome,
  FiAward,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiUser,
  FiGlobe,
  FiCheckCircle,
  FiEdit3,
  FiStar,
  FiMapPin
} from 'react-icons/fi'

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
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl mb-6">
        <div className="px-8 py-12 text-center">
          <div className="animate-pulse">
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-3/4 mx-auto mb-6 shadow-sm"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/2 mx-auto shadow-sm"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl mb-6 overflow-hidden">
      {micrositeInfo.banner_url && (
        <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 relative overflow-hidden">
          <img
            src={micrositeInfo.banner_url}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-purple/20"></div>
        </div>
      )}

      <div className="px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start space-x-6">
            {micrositeInfo.logo_url ? (
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex-shrink-0 overflow-hidden shadow-lg border border-gray-200">
                <img
                  src={micrositeInfo.logo_url}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-200 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg border border-purple-200">
                <FiHome className="w-12 h-12 text-purple-600" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-4xl font-bold text-gray-900">
                  {micrositeInfo.title}
                </h1>
                {!micrositeInfo.is_active && (
                  <span className="inline-flex px-3 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-red-100 to-pink-200 text-red-800 border border-red-300">
                    Inactive
                  </span>
                )}
              </div>

              <div className="text-xl text-gray-700 mb-3 flex items-center">
                <FiMapPin className="w-5 h-5 mr-2 text-gray-500" />
                {micrositeInfo.partner.business_name}
                {micrositeInfo.partner.partner_type && (
                  <span className="ml-3 inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-purple-100 to-indigo-200 text-purple-800 border border-purple-300">
                    {micrositeInfo.partner.partner_type}
                  </span>
                )}
              </div>

              {micrositeInfo.description && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-4">
                  <p className="text-blue-800 font-medium max-w-2xl">
                    {micrositeInfo.description}
                  </p>
                </div>
              )}

              {micrositeInfo.partner.contact_name && (
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm">
                    <FiUser className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-medium text-gray-900">{micrositeInfo.partner.contact_name}</span>
                    {micrositeInfo.partner.contact_title && (
                      <span className="ml-2 text-gray-600">({micrositeInfo.partner.contact_title})</span>
                    )}
                  </div>

                  {micrositeInfo.partner.website && (
                    <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm">
                      <FiGlobe className="w-4 h-4 mr-2 text-purple-600" />
                      <a href={micrositeInfo.partner.website} target="_blank" rel="noopener noreferrer" className="font-medium text-purple-600 hover:text-purple-800 transition-colors">
                        Website
                      </a>
                    </div>
                  )}

                  {micrositeInfo.partner.has_courts && (
                    <div className="flex items-center bg-gradient-to-r from-green-100 to-emerald-200 border border-green-300 rounded-2xl px-4 py-2 shadow-sm">
                      <FiCheckCircle className="w-4 h-4 mr-2 text-green-700" />
                      <span className="font-bold text-green-700">Has Courts</span>
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
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-2xl hover:from-purple-700 hover:to-pink-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold"
              >
                <FiEdit3 className="w-5 h-5 mr-2" />
                Edit Microsite
              </button>
            </div>
          )}
        </div>

        {stats && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FiHome className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">{stats.total_courts}</div>
                <div className="text-sm font-bold text-gray-600">Total Courts</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FiCheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">{stats.active_courts}</div>
                <div className="text-sm font-bold text-gray-600">Active Courts</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FiAward className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">{stats.total_tournaments}</div>
                <div className="text-sm font-bold text-gray-600">Tournaments</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FiStar className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.upcoming_tournaments}</div>
                <div className="text-sm font-bold text-gray-600">Upcoming</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FiUsers className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-indigo-600 mb-1">{stats.total_reservations}</div>
                <div className="text-sm font-bold text-gray-600">Reservations</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FiDollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  ${(stats.total_revenue / 1000).toFixed(1)}K
                </div>
                <div className="text-sm font-bold text-gray-600">Revenue</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MicrositeHeader