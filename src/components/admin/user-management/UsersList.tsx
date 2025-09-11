import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../../store'
import { UserListItem } from '../../../types/admin'
import { 
  addSelectedUser, 
  removeSelectedUser, 
  updateUserStatusAction, 
  updateUserVerificationAction,
  updateUserPremiumAction
} from '../../../store/slices/adminUserManagementSlice'

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  onChange={() => {
                    // Toggle all users selection logic could be added here
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => handleCheckboxChange(user.id, e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.phone && <div className="text-sm text-gray-500">{user.phone}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value as 'active' | 'inactive' | 'suspended')}
                    className={`text-xs font-semibold rounded-full px-2 py-1 border-none focus:ring-2 focus:ring-indigo-200 ${getStatusColor(user.status)}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleVerificationToggle(user.id, !user.is_verified)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                      user.is_verified 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {user.is_verified ? 'Verified' : 'Unverified'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handlePremiumToggle(user.id, !user.is_premium)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                      user.is_premium 
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {user.is_premium ? 'Premium' : 'Regular'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onUserSelect(user)}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    className="text-green-600 hover:text-green-900 transition-colors"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default UsersList