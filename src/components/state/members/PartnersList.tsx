import React from 'react'
import { StatePartner } from '../../../store/slices/stateMemberManagementSlice'
import { FiActivity, FiMail, FiPhone, FiCalendar, FiUser, FiCheckCircle, FiXCircle, FiGlobe, FiTag, FiHome, FiClock } from 'react-icons/fi'

interface PartnersListProps {
  partners: StatePartner[]
  onUpdateStatus: (partnerId: number, status: boolean) => void
  loading: boolean
}

const PartnersList: React.FC<PartnersListProps> = ({
  partners,
  onUpdateStatus,
  loading
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }


  const getPartnerTypeColor = (type: string | null) => {
    const colors = {
      sponsor: 'bg-purple-100 text-purple-800',
      vendor: 'bg-blue-100 text-blue-800',
      facility: 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[(type as keyof typeof colors) || 'other']
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm">
        <div className="animate-pulse space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
          ))}
        </div>
      </div>
    )
  }

  if (partners.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl shadow-xl border border-gray-200/50 p-12 text-center backdrop-blur-sm">
        <div className="bg-gradient-to-br from-orange-100 to-amber-200 p-8 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg mb-6">
          <FiActivity className="w-12 h-12 text-orange-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No partners found</h3>
        <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">No partners match your current filters. Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/50">
          <thead className="bg-gradient-to-r from-gray-50 to-orange-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiActivity className="w-4 h-4 mr-2 text-orange-600" />
                  Partner
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiTag className="w-4 h-4 mr-2 text-purple-600" />
                  Type
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiMail className="w-4 h-4 mr-2 text-teal-600" />
                  Contact
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiHome className="w-4 h-4 mr-2 text-blue-600" />
                  Details
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiClock className="w-4 h-4 mr-2 text-indigo-600" />
                  Premium Expires
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiGlobe className="w-4 h-4 mr-2 text-green-600" />
                  Website
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiCheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Status
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/80 divide-y divide-gray-200/50">
            {partners.map((partner) => (
              <tr key={partner.id} className="hover:bg-orange-50/30 transition-colors duration-200">
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="font-bold text-gray-900">
                    {partner.business_name}
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-2 text-sm font-bold rounded-xl shadow-sm ${getPartnerTypeColor(partner.partner_type)}`}>
                    <FiTag className="w-3 h-3 mr-1" />
                    {partner.partner_type}
                  </span>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="space-y-1">
                    {partner.contact_name && (
                      <div className="text-sm font-semibold text-gray-900 flex items-center">
                        <FiUser className="w-3 h-3 mr-1 text-blue-600" />
                        {partner.contact_name}
                      </div>
                    )}
                    {partner.contact_title && (
                      <div className="text-xs text-gray-600 font-medium">{partner.contact_title}</div>
                    )}
                    {partner.user.email && (
                      <div className="text-xs text-gray-600 flex items-center">
                        <FiMail className="w-3 h-3 mr-1 text-teal-600" />
                        {partner.user.email}
                      </div>
                    )}
                    {partner.user.phone && (
                      <div className="text-xs text-gray-600 flex items-center">
                        <FiPhone className="w-3 h-3 mr-1 text-green-600" />
                        {partner.user.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {partner.partner_type || '-'}
                  </div>
                  {partner.has_courts && (
                    <div className="text-xs text-gray-500">
                      Has Courts
                    </div>
                  )}
                </td>
                <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-600">
                  {partner.premium_expires_at ? (
                    <div className="flex items-center">
                      <FiClock className="w-3 h-3 mr-1 text-indigo-600" />
                      {formatDate(partner.premium_expires_at)}
                    </div>
                  ) : (
                    <span className="text-gray-500">No expiry</span>
                  )}
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  {partner.website ? (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-semibold text-sm"
                    >
                      <FiGlobe className="w-3 h-3 mr-1" />
                      Visit
                    </a>
                  ) : (
                    <span className="text-gray-500">No website</span>
                  )}
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  {partner.membership_status === 'active' ? (
                    <span className="inline-flex items-center px-3 py-2 text-sm font-bold rounded-xl shadow-sm bg-green-100 text-green-800">
                      <FiCheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-2 text-sm font-bold rounded-xl shadow-sm bg-gray-100 text-gray-800">
                      <FiXCircle className="w-3 h-3 mr-1" />
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    {partner.membership_status !== 'active' ? (
                      <button
                        onClick={() => onUpdateStatus(partner.id, true)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-sm"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        <span>Activate</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateStatus(partner.id, false)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-sm"
                      >
                        <FiXCircle className="w-4 h-4" />
                        <span>Deactivate</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PartnersList