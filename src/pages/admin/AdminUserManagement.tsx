import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { UserListItem } from '../../types/admin'
import { fetchUsers } from '../../store/slices/adminUserManagementSlice'
import {
  UsersList,
  UserFilters,
  UserStats,
  BulkActions,
  UserDetail,
  Pagination
} from '../../components/admin/user-management'
import {
  FiUsers,
  FiArrowLeft,
  FiAlertCircle,
  FiLoader,
  FiSettings
} from 'react-icons/fi'

const AdminUserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { users, userFilter, error } = useSelector((state: RootState) => state.adminUserManagement)
  
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<UserListItem | null>(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }

    // Fetch users when component mounts
    dispatch(fetchUsers(userFilter))
  }, [dispatch, user, navigate])

  // Fetch users when filters change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user && user.role === 'admin') {
        dispatch(fetchUsers(userFilter))
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [dispatch, user, userFilter])

  const handleUserSelect = (user: UserListItem) => {
    setSelectedUserForDetail(user)
  }

  const handleUserDetailClose = () => {
    setSelectedUserForDetail(null)
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
            <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading User Management</h3>
          <p className="text-gray-600 font-medium">Please wait while we prepare your dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mr-6 shadow-lg">
                  <FiUsers className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">User Management</h1>
                  <p className="mt-3 text-lg text-gray-600 font-medium">
                    Manage all federation users, their profiles, and account settings
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="inline-flex items-center px-6 py-3 text-lg font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <FiArrowLeft className="mr-2 h-5 w-5" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white mr-4">
                  <FiAlertCircle className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
                  <FiAlertCircle className="h-5 w-5 mr-2" />
                  System Error
                </h3>
                <div className="text-lg font-medium text-red-700 bg-white rounded-xl p-4 border border-red-200">
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
        <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-4">
                <FiUsers className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Users ({users.length})
                </h3>
                <p className="text-gray-600 font-medium">Manage user accounts and permissions</p>
              </div>
            </div>
          </div>
          <UsersList onUserSelect={handleUserSelect} />
          <Pagination />
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