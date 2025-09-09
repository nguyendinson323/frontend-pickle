import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { UserListItem } from '../../types/admin'
import { fetchUsers } from '../../store/slices/adminUserManagementSlice'
import {
  UsersList,
  UserFilters,
  UserStats,
  BulkActions,
  UserDetail
} from '../../components/admin/user-management'

const AdminUserManagement: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { users, userFilter, error } = useSelector((state: RootState) => state.adminUserManagement)
  
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<UserListItem | null>(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }

    // Fetch users when component mounts or when filters change
    dispatch(fetchUsers(userFilter) as any)
  }, [dispatch, user, navigate, userFilter])

  const handleUserSelect = (user: UserListItem) => {
    setSelectedUserForDetail(user)
  }

  const handleUserDetailClose = () => {
    setSelectedUserForDetail(null)
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-2 text-gray-600">
                Manage all federation users, their profiles, and account settings
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Statistics */}
        <UserStats />

        {/* User Filters */}
        <UserFilters />

        {/* Bulk Actions */}
        <BulkActions />

        {/* Users List */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Users ({users.length})
            </h3>
          </div>
          <UsersList onUserSelect={handleUserSelect} />
        </div>

        {/* User Detail Modal */}
        {selectedUserForDetail && (
          <UserDetail
            user={selectedUserForDetail}
            onClose={handleUserDetailClose}
          />
        )}
      </div>
    </div>
  )
}

export default AdminUserManagement