import React from 'react'
import { StatePartner } from '../../../store/slices/stateMemberManagementSlice'

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
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (partners.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No partners found</h3>
        <p className="mt-1 text-sm text-gray-500">No partners match your current filters.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Premium Expires
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Website
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {partners.map((partner) => (
              <tr key={partner.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{partner.business_name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPartnerTypeColor(partner.partner_type)}`}>
                    {partner.partner_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    {partner.contact_name && (
                      <div className="text-sm text-gray-900">{partner.contact_name}</div>
                    )}
                    {partner.contact_title && (
                      <div className="text-sm text-gray-500">{partner.contact_title}</div>
                    )}
                    {partner.user.email && (
                      <div className="text-xs text-gray-500">{partner.user.email}</div>
                    )}
                    {partner.user.phone && (
                      <div className="text-xs text-gray-500">{partner.user.phone}</div>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(partner.premium_expires_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {partner.website ? (
                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                      Visit
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {partner.membership_status === 'active' ? (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {partner.membership_status !== 'active' ? (
                      <button
                        onClick={() => onUpdateStatus(partner.id, true)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateStatus(partner.id, false)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Deactivate
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