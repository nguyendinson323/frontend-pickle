import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { PlayerDetail, CoachDetail, ClubDetail, PartnerDetail, StateDetail, UserListItem } from '../../../types/admin'
import { fetchUserDetails, resetUserPassword } from '../../../store/slices/adminUserManagementSlice'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiUsers,
  FiTarget,
  FiAward,
  FiHome,
  FiLink,
  FiMap,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiLoader,
  FiX,
  FiKey,
  FiInfo,
  FiEdit,
  FiEye
} from 'react-icons/fi'

interface UserDetailProps {
  user: UserListItem
  onClose: () => void
}

const UserDetail: React.FC<UserDetailProps> = ({ user, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedUser, loading } = useSelector((state: RootState) => state.adminUserManagement)

  useEffect(() => {
    dispatch(fetchUserDetails(user.id))
  }, [dispatch, user.id])

  const handleResetPassword = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to reset the password for ${user.username}? A new password will be sent to their email.`
    )
    if (confirmed) {
      try {
        await dispatch(resetUserPassword(user.id))
        alert('Password reset successfully. New password sent to user\'s email.')
      } catch (error) {
        console.error('Failed to reset password:', error)
      }
    }
  }

  const renderUserSpecificDetails = () => {
    if (!selectedUser) return null

    switch (selectedUser.role) {
      case 'player':
        const playerData = selectedUser as PlayerDetail
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Player Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Full Name:</span> {playerData.profile.full_name}</p>
                <p><span className="font-medium">Birth Date:</span> {new Date(playerData.profile.birth_date).toLocaleDateString()}</p>
                <p><span className="font-medium">Gender:</span> {playerData.profile.gender}</p>
                <p><span className="font-medium">Nationality:</span> {playerData.profile.nationality}</p>
                <p><span className="font-medium">State:</span> {playerData.profile.state_name}</p>
                <p><span className="font-medium">Club:</span> {playerData.profile.club_name || 'None'}</p>
              </div>
              <div>
                <p><span className="font-medium">NRTP Level:</span> {playerData.profile.nrtp_level}</p>
                <p><span className="font-medium">Ranking Points:</span> {playerData.profile.ranking_points}</p>
                <p><span className="font-medium">Ranking Position:</span> {playerData.profile.ranking_position}</p>
                <p><span className="font-medium">Tournaments Played:</span> {playerData.profile.tournaments_played}</p>
              </div>
            </div>
          </div>
        )
      case 'coach':
        const coachData = selectedUser as CoachDetail
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Coach Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Full Name:</span> {coachData.profile.full_name}</p>
                <p><span className="font-medium">Birth Date:</span> {new Date(coachData.profile.birth_date).toLocaleDateString()}</p>
                <p><span className="font-medium">Hourly Rate:</span> ${coachData.profile.hourly_rate}</p>
                <p><span className="font-medium">Total Students:</span> {coachData.profile.total_students}</p>
              </div>
              <div>
                <p><span className="font-medium">Sessions Conducted:</span> {coachData.profile.sessions_conducted}</p>
                <p><span className="font-medium">Referee Matches:</span> {coachData.profile.referee_matches}</p>
                <p><span className="font-medium">Specializations:</span> {coachData.profile.specializations.join(', ')}</p>
                <p><span className="font-medium">Certifications:</span> {coachData.profile.certifications.join(', ')}</p>
              </div>
            </div>
          </div>
        )
      case 'club':
        const clubData = selectedUser as ClubDetail
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Club Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Club Name:</span> {clubData.profile.name}</p>
                <p><span className="font-medium">Manager:</span> {clubData.profile.manager_name}</p>
                <p><span className="font-medium">State:</span> {clubData.profile.state_name}</p>
                <p><span className="font-medium">Website:</span> {clubData.profile.website || 'None'}</p>
              </div>
              <div>
                <p><span className="font-medium">Total Members:</span> {clubData.profile.total_members}</p>
                <p><span className="font-medium">Total Courts:</span> {clubData.profile.total_courts}</p>
                <p><span className="font-medium">Total Tournaments:</span> {clubData.profile.total_tournaments}</p>
                <p><span className="font-medium">Monthly Revenue:</span> ${clubData.profile.monthly_revenue}</p>
              </div>
            </div>
          </div>
        )
      case 'partner':
        const partnerData = selectedUser as PartnerDetail
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Partner Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Business Name:</span> {partnerData.profile.business_name}</p>
                <p><span className="font-medium">Contact Name:</span> {partnerData.profile.contact_name}</p>
                <p><span className="font-medium">Partner Type:</span> {partnerData.profile.partner_type}</p>
                <p><span className="font-medium">Website:</span> {partnerData.profile.website || 'None'}</p>
              </div>
              <div>
                <p><span className="font-medium">Total Courts:</span> {partnerData.profile.total_courts}</p>
                <p><span className="font-medium">Total Events:</span> {partnerData.profile.total_events}</p>
                <p><span className="font-medium">Monthly Revenue:</span> ${partnerData.profile.monthly_revenue}</p>
              </div>
            </div>
          </div>
        )
      case 'state':
        const stateData = selectedUser as StateDetail
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">State Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">State Name:</span> {stateData.profile.name}</p>
                <p><span className="font-medium">Representative:</span> {stateData.profile.representative_name}</p>
                <p><span className="font-medium">State Ranking:</span> {stateData.profile.state_ranking}</p>
              </div>
              <div>
                <p><span className="font-medium">Total Players:</span> {stateData.profile.total_players}</p>
                <p><span className="font-medium">Total Clubs:</span> {stateData.profile.total_clubs}</p>
                <p><span className="font-medium">Total Partners:</span> {stateData.profile.total_partners}</p>
                <p><span className="font-medium">Total Tournaments:</span> {stateData.profile.total_tournaments}</p>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active': return {
        className: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
        icon: FiCheckCircle
      }
      case 'inactive': return {
        className: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-200',
        icon: FiXCircle
      }
      case 'suspended': return {
        className: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-200',
        icon: FiShield
      }
      default: return {
        className: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-200',
        icon: FiXCircle
      }
    }
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'player': return {
        className: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200',
        icon: FiTarget
      }
      case 'coach': return {
        className: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-200',
        icon: FiAward
      }
      case 'club': return {
        className: 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-200',
        icon: FiHome
      }
      case 'partner': return {
        className: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200',
        icon: FiLink
      }
      case 'state': return {
        className: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
        icon: FiMap
      }
      case 'admin': return {
        className: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-200',
        icon: FiShield
      }
      default: return {
        className: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-200',
        icon: FiUser
      }
    }
  }

  const statusInfo = getStatusInfo(user.status)
  const roleInfo = getRoleInfo(user.role)
  const StatusIcon = statusInfo.icon
  const RoleIcon = roleInfo.icon

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-0 w-full max-w-6xl min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden w-full m-4 animate-modal-scale max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-white mr-6">
                  <FiUser className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">User Profile</h3>
                  <p className="text-indigo-100 font-medium">Detailed information for {user.username}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="p-8">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                    <FiLoader className="animate-spin h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Loading User Details</h3>
                  <p className="text-gray-600 font-medium">Please wait while we fetch detailed information</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4">
                      <FiInfo className="h-6 w-6" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">Basic Information</h4>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <FiUser className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-bold text-gray-700">Username:</span>
                          <span className="ml-2 text-lg font-bold text-gray-900">{user.username}</span>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <FiMail className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-bold text-gray-700">Email:</span>
                          <span className="ml-2 text-lg font-bold text-gray-900">{user.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <FiPhone className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-bold text-gray-700">Phone:</span>
                          <span className="ml-2 text-lg font-bold text-gray-900">{user.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <FiCalendar className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-bold text-gray-700">Created:</span>
                          <span className="ml-2 text-lg font-bold text-gray-900">{new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <FiClock className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-bold text-gray-700">Last Login:</span>
                          <span className="ml-2 text-lg font-bold text-gray-900">{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <span className="text-sm font-bold text-gray-700 block mb-2">Role:</span>
                        <div className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl border-2 ${roleInfo.className} shadow-sm`}>
                          <RoleIcon className="h-4 w-4 mr-2" />
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <span className="text-sm font-bold text-gray-700 block mb-2">Status:</span>
                        <div className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl border-2 ${statusInfo.className} shadow-sm`}>
                          <StatusIcon className="h-4 w-4 mr-2" />
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <span className="text-sm font-bold text-gray-700 block mb-2">Verification:</span>
                        <div className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl border-2 shadow-sm ${
                          user.is_verified
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200'
                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-200'
                        }`}>
                          {user.is_verified ? <FiCheckCircle className="h-4 w-4 mr-2" /> : <FiXCircle className="h-4 w-4 mr-2" />}
                          {user.is_verified ? 'Verified' : 'Unverified'}
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <span className="text-sm font-bold text-gray-700 block mb-2">Premium Status:</span>
                        <div className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl border-2 shadow-sm ${
                          user.is_premium
                            ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200'
                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-200'
                        }`}>
                          <FiStar className="h-4 w-4 mr-2" />
                          {user.is_premium ? 'Premium' : 'Regular'}
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <span className="text-sm font-bold text-gray-700 block mb-2">Affiliation:</span>
                        <div className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl border-2 shadow-sm ${
                          user.affiliation_status === 'active'
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200'
                            : user.affiliation_status === 'expired'
                            ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-200'
                            : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200'
                        }`}>
                          <FiLink className="h-4 w-4 mr-2" />
                          {user.affiliation_status.charAt(0).toUpperCase() + user.affiliation_status.slice(1)}
                        </div>
                        {user.affiliation_expires_at && (
                          <div className="mt-3 flex items-center text-gray-600">
                            <FiCalendar className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">Expires: {new Date(user.affiliation_expires_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Role-specific Details */}
                {selectedUser && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-100 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4">
                        <RoleIcon className="h-6 w-6" />
                      </div>
                      <h4 className="text-2xl font-bold text-gray-900">Role-Specific Details</h4>
                    </div>
                    {renderUserSpecificDetails()}
                  </div>
                )}
                
                <div className="flex justify-end space-x-4 mt-8 bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t border-gray-200">
                  <button
                    onClick={handleResetPassword}
                    className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-yellow-600 to-orange-700 hover:from-yellow-700 hover:to-orange-800 border-2 border-transparent rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    <FiKey className="mr-2 h-5 w-5" />
                    Reset Password
                  </button>
                  <button
                    onClick={onClose}
                    className="inline-flex items-center px-8 py-4 text-lg font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <FiX className="mr-2 h-5 w-5" />
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetail