import React from 'react'
import { StateCoach } from '../../../store/slices/stateMemberManagementSlice'
import { FiUserCheck, FiMail, FiCalendar, FiAward, FiDollarSign, FiCheckCircle, FiXCircle, FiUser, FiClock } from 'react-icons/fi'

interface CoachesListProps {
  coaches: StateCoach[]
  onUpdateVerification: (coachId: number, verified: boolean) => void
  loading: boolean
}

const CoachesList: React.FC<CoachesListProps> = ({
  coaches,
  onUpdateVerification,
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

  const getNRTPLevelColor = (level: number | null) => {
    if (!level) return 'bg-gray-100 text-gray-800'
    
    const colors = {
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-green-100 text-green-800', 
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-orange-100 text-orange-800',
      5: 'bg-purple-100 text-purple-800'
    }
    const roundedLevel = Math.floor(level)
    return colors[roundedLevel as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || colors.inactive
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm">
        <div className="animate-pulse space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
          ))}
        </div>
      </div>
    )
  }

  if (coaches.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl shadow-xl border border-gray-200/50 p-12 text-center backdrop-blur-sm">
        <div className="bg-gradient-to-br from-green-100 to-emerald-200 p-8 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg mb-6">
          <FiUserCheck className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No coaches found</h3>
        <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">No coaches match your current filters. Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/50">
          <thead className="bg-gradient-to-r from-gray-50 to-green-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
                <FiUser className="w-4 h-4 mr-2 text-green-600" />
                Coach
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiAward className="w-4 h-4 mr-2 text-purple-600" />
                  NRTP Level
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiClock className="w-4 h-4 mr-2 text-blue-600" />
                  Age
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiDollarSign className="w-4 h-4 mr-2 text-yellow-600" />
                  Hourly Rate
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
                  Joined
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/80 divide-y divide-gray-200/50">
            {coaches.map((coach) => (
              <tr key={coach.id} className="hover:bg-green-50/30 transition-colors duration-200">
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center shadow-lg">
                        <span className="text-lg font-bold text-green-600">
                          {coach.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-gray-900">
                        {coach.full_name}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center mt-1">
                        <FiMail className="w-3 h-3 mr-1" />
                        {coach.user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-xl shadow-sm ${getNRTPLevelColor(coach.nrtp_level)}`}>
                    NRTP {coach.nrtp_level || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                  {coach.age ? (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold">
                      {coach.age} years
                    </span>
                  ) : (
                    <span className="text-gray-500">Not specified</span>
                  )}
                </td>
                <td className="px-6 py-6 whitespace-nowrap text-sm font-bold text-gray-900">
                  {coach.hourly_rate ? (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg font-bold flex items-center w-fit">
                      <FiDollarSign className="w-3 h-3 mr-1" />
                      {formatCurrency(coach.hourly_rate)}
                    </span>
                  ) : (
                    <span className="text-gray-500">Not set</span>
                  )}
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-2 text-sm font-bold rounded-xl shadow-sm ${getStatusColor(coach.membership_status)}`}>
                    {coach.membership_status === 'active' ? <FiCheckCircle className="w-3 h-3 mr-1" /> : <FiXCircle className="w-3 h-3 mr-1" />}
                    {coach.membership_status}
                  </span>
                </td>
                <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-600">
                  <div className="flex items-center">
                    <FiCalendar className="w-3 h-3 mr-1" />
                    {formatDate(coach.created_at)}
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    {coach.membership_status !== 'active' ? (
                      <button
                        onClick={() => onUpdateVerification(coach.id, true)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-sm"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        <span>Activate</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateVerification(coach.id, false)}
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

export default CoachesList