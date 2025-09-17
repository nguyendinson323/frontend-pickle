import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../../store'
import { UserListItem } from '../../../types/admin'
import {
  addSelectedUser,
  removeSelectedUser,
  setSelectedUsers,
  updateUserStatusAction,
  updateUserVerificationAction,
  updateUserPremiumAction
} from '../../../store/slices/adminUserManagementSlice'
import {
  FiUser,
  FiUsers,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiEye,
  FiEdit2,
  FiMail,
  FiPhone,
  FiCalendar,
  FiLoader,
  FiTarget,
  FiAward,
  FiHome,
  FiLink,
  FiMap
} from 'react-icons/fi'

interface UsersListProps {
  onUserSelect: (user: UserListItem) => void
}

const UsersList: React.FC<UsersListProps> = ({ onUserSelect }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { users, selectedUsers, loading } = useSelector((state: RootState) => state.adminUserManagement)

  const handleCheckboxChange = (userId: number, checked: boolean) => {
    if (checked) {
      dispatch(addSelectedUser(userId))
    } else {
      dispatch(removeSelectedUser(userId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allUserIds = users.map(user => user.id)
      dispatch(setSelectedUsers(allUserIds))
    } else {
      dispatch(setSelectedUsers([]))
    }
  }

  const isAllSelected = users.length > 0 && users.every(user => selectedUsers.includes(user.id))
  const isIndeterminate = selectedUsers.length > 0 && !isAllSelected

  const handleStatusChange = async (userId: number, status: 'active' | 'inactive' | 'suspended') => {
    try {
      await dispatch(updateUserStatusAction(userId, status))
    } catch (error) {
      console.error('Failed to update user status:', error)
    }
  }

  const handleVerificationToggle = async (userId: number, verified: boolean) => {
    try {
      await dispatch(updateUserVerificationAction(userId, verified))
    } catch (error) {
      console.error('Failed to update user verification:', error)
    }
  }

  const handlePremiumToggle = async (userId: number, premium: boolean) => {
    try {
      await dispatch(updateUserPremiumAction(userId, premium))
    } catch (error) {
      console.error('Failed to update user premium status:', error)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
            <FiLoader className="animate-spin h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Users</h3>
          <p className="text-gray-600 font-medium">Please wait while we fetch user data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-5 w-5 rounded border-2 border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiUser className="h-4 w-4 mr-2" />
                  User
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiUsers className="h-4 w-4 mr-2" />
                  Role
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiShield className="h-4 w-4 mr-2" />
                  Status
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiCheckCircle className="h-4 w-4 mr-2" />
                  Verified
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiStar className="h-4 w-4 mr-2" />
                  Premium
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                <div className="flex items-center">
                  <FiCalendar className="h-4 w-4 mr-2" />
                  Last Login
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.map((user, index) => {
              const statusInfo = getStatusInfo(user.status)
              const roleInfo = getRoleInfo(user.role)
              const StatusIcon = statusInfo.icon
              const RoleIcon = roleInfo.icon

              return (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 animate-table-row"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-6">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => handleCheckboxChange(user.id, e.target.checked)}
                      className="h-5 w-5 rounded border-2 border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-4 flex-shrink-0">
                        <FiUser className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900 mb-1">{user.username}</div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <FiMail className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm font-medium">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center text-gray-600">
                            <FiPhone className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-sm font-medium">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl border-2 ${roleInfo.className} shadow-sm hover:shadow-md transition-all duration-200`}>
                      <RoleIcon className="h-4 w-4 mr-2" />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl border-2 ${statusInfo.className} shadow-sm hover:shadow-md transition-all duration-200`}>
                      <StatusIcon className="h-4 w-4 mr-2" />
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value as 'active' | 'inactive' | 'suspended')}
                        className="bg-transparent border-none outline-none font-bold text-sm cursor-pointer"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <button
                      onClick={() => handleVerificationToggle(user.id, !user.is_verified)}
                      className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl border-2 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 ${
                        user.is_verified
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 hover:from-green-200 hover:to-emerald-200'
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                      }`}
                    >
                      {user.is_verified ? (
                        <>
                          <FiCheckCircle className="h-4 w-4 mr-2" />
                          Verified
                        </>
                      ) : (
                        <>
                          <FiXCircle className="h-4 w-4 mr-2" />
                          Unverified
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-6">
                    <button
                      onClick={() => handlePremiumToggle(user.id, !user.is_premium)}
                      className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl border-2 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 ${
                        user.is_premium
                          ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200 hover:from-yellow-200 hover:to-orange-200'
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                      }`}
                    >
                      <FiStar className="h-4 w-4 mr-2" />
                      {user.is_premium ? 'Premium' : 'Regular'}
                    </button>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center text-gray-600">
                      <FiCalendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onUserSelect(user)}
                        className="inline-flex items-center px-4 py-2 text-sm font-bold text-indigo-700 bg-gradient-to-r from-indigo-100 to-indigo-200 border-2 border-indigo-200 rounded-xl hover:from-indigo-200 hover:to-indigo-300 hover:border-indigo-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FiEye className="h-4 w-4 mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                        className="inline-flex items-center px-4 py-2 text-sm font-bold text-green-700 bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-200 rounded-xl hover:from-green-200 hover:to-green-300 hover:border-green-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <FiEdit2 className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiUsers className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">No Users Found</h3>
          <p className="text-gray-600 font-medium mb-6">No users match your current search criteria.</p>
          <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 inline-block">
            Try adjusting your filters or search terms
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersList