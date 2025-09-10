import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { PlayerDetail, CoachDetail, ClubDetail, PartnerDetail, StateDetail, UserListItem } from '../../../types/admin'
import { fetchUserDetails, resetUserPassword } from '../../../store/slices/adminUserManagementSlice'

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'player': return 'bg-blue-100 text-blue-800'
      case 'coach': return 'bg-purple-100 text-purple-800'
      case 'club': return 'bg-indigo-100 text-indigo-800'
      case 'partner': return 'bg-yellow-100 text-yellow-800'
      case 'state': return 'bg-green-100 text-green-800'
      case 'admin': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">User Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className=" rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-medium">Username:</span> {user.username}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Phone:</span> {user.phone}</p>
                  <p><span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleDateString()}</p>
                  <p><span className="font-medium">Last Login:</span> {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</p>
                </div>
                <div>
                  <div className="mb-2">
                    <span className="font-medium">Role: </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Status: </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Verified: </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.is_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Premium: </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.is_premium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.is_premium ? 'Premium' : 'Regular'}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Affiliation: </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.affiliation_status === 'active' ? 'bg-green-100 text-green-800' : user.affiliation_status === 'expired' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {user.affiliation_status.charAt(0).toUpperCase() + user.affiliation_status.slice(1)}
                    </span>
                  </div>
                  {user.affiliation_expires_at && (
                    <p><span className="font-medium">Affiliation Expires:</span> {new Date(user.affiliation_expires_at).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Role-specific Details */}
            {selectedUser && (
              <div className=" rounded-lg p-6">
                {renderUserSpecificDetails()}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                Reset Password
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDetail