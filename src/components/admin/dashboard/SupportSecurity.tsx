import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

interface SecurityAction {
  user_id: number
  action_type: 'suspend' | 'activate' | 'reset_password' | 'verify' | 'delete'
  reason: string
  duration?: number // for suspensions
}

const SupportSecurity: React.FC = () => {
  const { users, securityLogs, loading } = useSelector((state: RootState) => state.admin)
  const [activeTab, setActiveTab] = useState<'security' | 'support' | 'logs' | 'admins'>('security')
  const [showActionModal, setShowActionModal] = useState(false)
  const [securityForm, setSecurityForm] = useState<SecurityAction>({
    user_id: 0,
    action_type: 'suspend',
    reason: '',
    duration: undefined
  })
  const [selectedUser, setSelectedUser] = useState<any>(null)

  if (loading) {
    return <div className="p-4">Loading security controls...</div>
  }

  const securityStats = {
    totalUsers: users?.length || 0,
    activeUsers: users?.filter(u => u.is_active).length || 0,
    suspendedUsers: users?.filter(u => !u.is_active).length || 0,
    unverifiedUsers: users?.filter(u => !u.is_verified).length || 0,
    premiumUsers: users?.filter(u => u.is_premium).length || 0,
    recentSuspensions: securityLogs?.filter(log => 
      log.action === 'user_suspended' && 
      new Date(log.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length || 0
  }

  const handleSecurityAction = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement security action
    console.log('Security action:', securityForm)
    setShowActionModal(false)
    setSecurityForm({
      user_id: 0,
      action_type: 'suspend',
      reason: '',
      duration: undefined
    })
    setSelectedUser(null)
  }

  const handlePasswordReset = (userId: number) => {
    // TODO: Implement password reset
    console.log('Resetting password for user:', userId)
  }

  const handleCreateAdmin = () => {
    // TODO: Implement create admin functionality
    console.log('Creating new admin...')
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Support & Security</h2>
          <p className="text-gray-600">Administrative controls and security management</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleCreateAdmin}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <span>👑</span>
            <span>Create Admin</span>
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <span>🚨</span>
            <span>Emergency Actions</span>
          </button>
        </div>
      </div>

      {/* Security Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-blue-600">👥</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{securityStats.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-green-600">✅</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-900">{securityStats.activeUsers}</div>
              <div className="text-sm text-green-700">Active</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-red-600">🚫</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-red-900">{securityStats.suspendedUsers}</div>
              <div className="text-sm text-red-700">Suspended</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-yellow-600">⚠️</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-yellow-900">{securityStats.unverifiedUsers}</div>
              <div className="text-sm text-yellow-700">Unverified</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-purple-600">💎</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-purple-900">{securityStats.premiumUsers}</div>
              <div className="text-sm text-purple-700">Premium</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-orange-600">📅</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-orange-900">{securityStats.recentSuspensions}</div>
              <div className="text-sm text-orange-700">This Week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'security', name: 'User Security', icon: '🛡️' },
              { id: 'support', name: 'Support Tools', icon: '🔧' },
              { id: 'logs', name: 'Security Logs', icon: '📝' },
              { id: 'admins', name: 'Admin Management', icon: '👑' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* User Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">User Security Management</h3>
            <p className="text-gray-600">Suspend accounts, reset passwords, and manage user verification</p>
          </div>
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Security Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(users || []).length > 0 ? (users || []).map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800'
                        : user.role === 'state'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.is_verified 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handlePasswordReset(user.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Reset Password
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedUser(user)
                        setSecurityForm({
                          ...securityForm,
                          user_id: user.id,
                          action_type: user.is_active ? 'suspend' : 'activate'
                        })
                        setShowActionModal(true)
                      }}
                      className={`${user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} mr-3`}
                    >
                      {user.is_active ? 'Suspend' : 'Activate'}
                    </button>
                    {!user.is_verified && (
                      <button 
                        onClick={() => {
                          setSelectedUser(user)
                          setSecurityForm({
                            ...securityForm,
                            user_id: user.id,
                            action_type: 'verify'
                          })
                          setShowActionModal(true)
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Support Tools Tab */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-left">
                📊 Generate User Report
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-left">
                📧 Send System Announcement
              </button>
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg text-left">
                🔄 Backup Database
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-left">
                🧹 Clean Inactive Accounts
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Database Status</span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Healthy
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Storage Usage</span>
                <span className="text-gray-900">65% (2.3GB / 3.5GB)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Active Sessions</span>
                <span className="text-gray-900">{securityStats.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">API Response Time</span>
                <span className="text-green-600">< 200ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Security Action</h3>
                <button
                  onClick={() => setShowActionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <form onSubmit={handleSecurityAction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target User
                  </label>
                  <input
                    type="text"
                    value={selectedUser?.username || ''}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action Type
                  </label>
                  <select
                    value={securityForm.action_type}
                    onChange={(e) => setSecurityForm({...securityForm, action_type: e.target.value as any})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="suspend">Suspend Account</option>
                    <option value="activate">Activate Account</option>
                    <option value="reset_password">Reset Password</option>
                    <option value="verify">Verify Account</option>
                    <option value="delete">Delete Account</option>
                  </select>
                </div>

                {securityForm.action_type === 'suspend' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Suspension Duration (days)
                    </label>
                    <input
                      type="number"
                      value={securityForm.duration || ''}
                      onChange={(e) => setSecurityForm({...securityForm, duration: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Leave empty for permanent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    value={securityForm.reason}
                    onChange={(e) => setSecurityForm({...securityForm, reason: e.target.value})}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Explain the reason for this action..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowActionModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white rounded-lg ${
                      securityForm.action_type === 'delete' 
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Apply Action
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupportSecurity