import React from 'react'
import { StateClub } from '../../../store/slices/stateMemberManagementSlice'
import { FiHome, FiMail, FiPhone, FiCalendar, FiUser, FiCheckCircle, FiXCircle, FiGlobe, FiMapPin } from 'react-icons/fi'

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
      <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm">
        <div className="animate-pulse space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
          ))}
        </div>
      </div>
    )
  }

  if (clubs.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-xl border border-gray-200/50 p-12 text-center backdrop-blur-sm">
        <div className="bg-gradient-to-br from-purple-100 to-indigo-200 p-8 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg mb-6">
          <FiHome className="w-12 h-12 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No clubs found</h3>
        <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">No clubs match your current filters. Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/50">
          <thead className="bg-gradient-to-r from-gray-50 to-purple-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiHome className="w-4 h-4 mr-2 text-purple-600" />
                  Club
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiUser className="w-4 h-4 mr-2 text-blue-600" />
                  Manager
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiMapPin className="w-4 h-4 mr-2 text-green-600" />
                  Type
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiHome className="w-4 h-4 mr-2 text-orange-600" />
                  Courts
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
                  <FiCheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Status
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiCalendar className="w-4 h-4 mr-2 text-gray-600" />
                  Created
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/80 divide-y divide-gray-200/50">
            {clubs.map((club) => (
              <tr key={club.id} className="hover:bg-purple-50/30 transition-colors duration-200">
                <td className="px-6 py-6 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-bold text-gray-900 mb-1">{club.name}</div>
                    {club.rfc && (
                      <div className="text-sm text-gray-600 mb-1">
                        RFC: <span className="font-semibold">{club.rfc}</span>
                      </div>
                    )}
                    {club.website && (
                      <div className="text-xs">
                        <a
                          href={club.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold"
                        >
                          <FiGlobe className="w-3 h-3 mr-1" />
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
                <td className="px-6 py-6 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-2 text-sm font-bold rounded-xl shadow-sm ${club.membership_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {club.membership_status === 'active' ? <FiCheckCircle className="w-3 h-3 mr-1" /> : <FiXCircle className="w-3 h-3 mr-1" />}
                    {club.membership_status}
                  </span>
                </td>
                <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-600">
                  <div className="flex items-center">
                    <FiCalendar className="w-3 h-3 mr-1" />
                    {formatDate(club.created_at)}
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    {club.membership_status !== 'active' ? (
                      <button
                        onClick={() => onUpdateStatus(club.id, true)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-sm"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        <span>Activate</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateStatus(club.id, false)}
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

export default ClubsList