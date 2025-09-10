import React, { useState, useEffect } from 'react'
import { Player, User } from '../../../types/auth'
import api from '../../../services/api'

interface PlayerProfileViewProps {
  player: Player
  user: User
  onEdit: () => void
}

interface DigitalCredential {
  id: number
  credential_type: string
  title: string
  description: string
  issue_date: string
  expiry_date: string | null
  qr_code_data: string
  qr_code_url: string | null
  is_active: boolean
}

const PlayerProfileView: React.FC<PlayerProfileViewProps> = ({ player, user, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'credentials' | 'privacy'>('profile')
  const [credentials, setCredentials] = useState<DigitalCredential[]>([])
  const [loadingCredentials, setLoadingCredentials] = useState(false)

  useEffect(() => {
    if (activeTab === 'credentials') {
      fetchDigitalCredentials()
    }
  }, [activeTab])

  const fetchDigitalCredentials = async () => {
    try {
      setLoadingCredentials(true)
      const response = await api.get('/api/player/credentials')
      setCredentials(response.data)
    } catch (error) {
      console.error('Failed to fetch digital credentials:', error)
    } finally {
      setLoadingCredentials(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-indigo-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-indigo-700 rounded-full flex items-center justify-center mr-6">
              {player.profile_photo_url ? (
                <img 
                  src={player.profile_photo_url} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover" 
                />
              ) : (
                <span className="text-3xl text-white">🏓</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{player.full_name}</h1>
              <p className="text-indigo-100">
                NRTP Level {player.nrtp_level || 'N/A'} • {player.state?.name || 'Unknown State'}
              </p>
              <p className="text-indigo-100">
                Ranking: #{player.ranking_position || 'Unranked'}
              </p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-8">
          {[
            { key: 'profile', label: 'Profile Information', icon: '👤' },
            { key: 'credentials', label: 'Digital Credentials', icon: '🏆' },
            { key: 'privacy', label: 'Privacy Settings', icon: '🔒' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.key
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-8">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Account Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
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
                  <label className="block text-sm font-medium text-gray-500 mb-1">Premium Status</label>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_premium ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.is_premium ? 'Premium' : 'Standard'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Player Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Player Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-gray-900">{player.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Birth Date</label>
                  <p className="text-gray-900">{new Date(player.birth_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                  <p className="text-gray-900">{player.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Nationality</label>
                  <p className="text-gray-900">{player.nationality}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
                  <p className="text-gray-900">{player.state?.name || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">CURP</label>
                  <p className="text-gray-900">{player.curp || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">NRTP Level</label>
                  <p className="text-gray-900">{player.nrtp_level || 'Not assigned'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Ranking Position</label>
                  <p className="text-gray-900">#{player.ranking_position || 'Unranked'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Club</label>
                  <p className="text-gray-900">{player.club?.name || 'No club assigned'}</p>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Identity Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Profile Photo</label>
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    {player.profile_photo_url ? (
                      <img 
                        src={player.profile_photo_url} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-lg object-cover" 
                      />
                    ) : (
                      <span className="text-4xl text-gray-400">📷</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">ID Document</label>
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    {player.id_document_url ? (
                      <a 
                        href={player.id_document_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-32 h-32 rounded-lg flex items-center justify-center bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <span className="text-4xl text-blue-600">📄</span>
                      </a>
                    ) : (
                      <span className="text-4xl text-gray-400">📄</span>
                    )}
                  </div>
                  {player.id_document_url && (
                    <p className="text-xs text-gray-500 mt-1">Click to view</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Affiliation Expires</label>
                  <p className="text-gray-900">
                    {player.affiliation_expires_at ? 
                      new Date(player.affiliation_expires_at).toLocaleDateString() : 
                      'No expiration date'
                    }
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                  <p className="text-gray-900">{new Date(player.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                  <p className="text-gray-900">{new Date(player.updated_at).toLocaleDateString()}</p>
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
          </div>
        )}

        {/* Digital Credentials Tab */}
        {activeTab === 'credentials' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Digital Credentials</h3>
              <button
                onClick={fetchDigitalCredentials}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
              >
                Refresh
              </button>
            </div>

            {loadingCredentials ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : credentials.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl text-gray-400 mb-4 block">🏆</span>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Digital Credentials</h4>
                <p className="text-gray-500">Your digital credentials will appear here once issued.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {credentials.map(credential => (
                  <div key={credential.id} className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <span className="text-xl">
                          {credential.credential_type === 'player_card' ? '🏓' : 
                           credential.credential_type === 'tournament_badge' ? '🏆' : 
                           credential.credential_type === 'certification' ? '📜' : '🎖️'}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        credential.is_active ? 'bg-green-500 bg-opacity-20 text-green-100' : 'bg-red-500 bg-opacity-20 text-red-100'
                      }`}>
                        {credential.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold mb-2">{credential.title}</h4>
                    <p className="text-indigo-100 text-sm mb-4">{credential.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-indigo-200">
                        Issued: {new Date(credential.issue_date).toLocaleDateString()}
                      </span>
                      {credential.qr_code_url && (
                        <button 
                          onClick={() => window.open(credential.qr_code_url!, '_blank')}
                          className="bg-white bg-opacity-20 px-3 py-1 rounded-md hover:bg-opacity-30 transition-colors"
                        >
                          View QR
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Privacy Settings Tab */}
        {activeTab === 'privacy' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Privacy Settings</h3>
            
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Player Search Visibility</h4>
                    <p className="text-gray-600 text-sm">
                      Control whether other players can find you in search results. When disabled, 
                      you will not appear in player search results and other players cannot send you match requests.
                    </p>
                  </div>
                  <div className="ml-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="searchable"
                        checked={user.is_searchable}
                        disabled
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <label htmlFor="searchable" className="ml-2 block text-sm text-gray-900">
                        {user.is_searchable ? 'Visible in searches' : 'Hidden from searches'}
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Use the edit profile form to change this setting
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Data Privacy Information</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Your profile information is only visible to other registered players</p>
                  <p>• Tournament results and rankings are public information</p>
                  <p>• Personal contact information (email, phone) is never shared with other users</p>
                  <p>• You can request data deletion by contacting support</p>
                  <p>• All data is stored securely and encrypted</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Account Security</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Two-Factor Authentication</span>
                    <span className="text-sm text-orange-600 font-medium">Coming Soon</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Login Notifications</span>
                    <span className="text-sm text-green-600 font-medium">Enabled</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Password Last Changed</span>
                    <span className="text-sm text-gray-600">N/A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerProfileView