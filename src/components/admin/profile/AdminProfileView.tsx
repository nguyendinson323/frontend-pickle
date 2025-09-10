import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { fetchAdminActivityLog } from '../../../store/slices/adminProfileSlice'
import { User } from '../../../types/auth'

interface AdminProfileViewProps {
  user: User
  onEdit: () => void
}

const AdminProfileView: React.FC<AdminProfileViewProps> = ({ user, onEdit }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [activeTab, setActiveTab] = useState('overview')
  const { activityLog, isLoading } = useSelector((state: RootState) => state.adminProfile)

  useEffect(() => {
    if (activeTab === 'activity') {
      dispatch(fetchAdminActivityLog(1, 10))
    }
  }, [activeTab, dispatch])

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-gray-800 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mr-6">
              <span className="text-3xl text-white">🛡️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-gray-300">
                System Administrator
              </p>
              <p className="text-gray-300">
                Full system access and management
              </p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="bg-white text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-gray-500 text-gray-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile Overview
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'permissions'
                ? 'border-gray-500 text-gray-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            System Access
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'activity'
                ? 'border-gray-500 text-gray-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Activity Log
          </button>
        </nav>
      </div>

      <div className="p-8">
        {/* Profile Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Account Information */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Administrator Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                  <p className="text-gray-900">{user.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                  <p className="text-gray-900 capitalize font-medium text-red-600">Administrator</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Account Status</label>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Verification Status</label>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Profile Searchable</label>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_searchable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.is_searchable ? 'Searchable' : 'Private'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account History */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Account Created</label>
                  <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                  <p className="text-gray-900">{new Date(user.updated_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Login</label>
                  <p className="text-gray-900">
                    {user.last_login ? 
                      new Date(user.last_login).toLocaleDateString() : 
                      'Never logged in'
                    }
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* System Access Tab */}
        {activeTab === 'permissions' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Access & Permissions</h3>
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Administrator Privileges
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        This account has full system access including user management, system configuration, 
                        data management, and all platform features. Use these privileges responsibly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Granted Permissions</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• User Management & Administration</li>
                    <li>• System Configuration & Settings</li>
                    <li>• Data Export & Reporting</li>
                    <li>• Payment & Transaction Management</li>
                    <li>• Content & Microsite Management</li>
                    <li>• Tournament & Event Oversight</li>
                    <li>• Messaging & Communication Tools</li>
                    <li>• Court & Reservation Management</li>
                    <li>• Ranking System Administration</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Security Features</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Encrypted Password Storage</li>
                    <li>• Session Management</li>
                    <li>• Activity Logging</li>
                    <li>• Role-Based Access Control</li>
                    <li>• Secure API Endpoints</li>
                    <li>• Profile Privacy Controls</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Log Tab */}
        {activeTab === 'activity' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                <span className="ml-2 text-gray-600">Loading activity log...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {activityLog.length > 0 ? (
                  activityLog.map((activity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{activity.action}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {activity.ip_address}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4a9.971 9.971 0 01.712-3.714M28 20a4 4 0 11-8 0 4 4 0 018 0zm-8 4a9 9 0 00-9 9v3h18v-3a9 9 0 00-9-9z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                    <p className="mt-1 text-sm text-gray-500">Activity will appear here when you interact with the system.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProfileView