import React from 'react'
import { StateClub } from '../../../store/slices/stateMemberManagementSlice'

interface ClubsListProps {
  clubs: StateClub[]
  onUpdateStatus: (clubId: number, status: boolean) => void
  loading: boolean
}

const ClubsList: React.FC<ClubsListProps> = ({
  clubs,
  onUpdateStatus,
  loading
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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

  if (clubs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No clubs found</h3>
        <p className="mt-1 text-sm text-gray-500">No clubs match your current filters.</p>
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
                Club
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manager
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Courts
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clubs.map((club) => (
              <tr key={club.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{club.name}</div>
                    {club.rfc && (
                      <div className="text-sm text-gray-500">
                        RFC: {club.rfc}
                      </div>
                    )}
                    {club.website && (
                      <div className="text-xs text-blue-600 hover:text-blue-800">
                        <a href={club.website} target="_blank" rel="noopener noreferrer">
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    {club.manager_name && (
                      <div className="text-sm text-gray-900">{club.manager_name}</div>
                    )}
                    {club.manager_title && (
                      <div className="text-sm text-gray-500">{club.manager_title}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {club.club_type || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {club.has_courts ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    {club.user.email && (
                      <div className="text-sm text-gray-900">{club.user.email}</div>
                    )}
                    {club.user.phone && (
                      <div className="text-sm text-gray-500">{club.user.phone}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${club.membership_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {club.membership_status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(club.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {club.membership_status !== 'active' ? (
                      <button
                        onClick={() => onUpdateStatus(club.id, true)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateStatus(club.id, false)}
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

export default ClubsList