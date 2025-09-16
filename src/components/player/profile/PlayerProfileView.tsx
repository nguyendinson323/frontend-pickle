import React, { useState, useEffect } from 'react'
import { Player, User } from '../../../types/auth'
import QRCode from 'qrcode'
import PlayerInbox from './PlayerInbox'

// Cache-busting utility to force image reload when URL changes
const addCacheBuster = (url: string | null, lastUpdated?: string) => {
  if (!url) return url
  const separator = url.includes('?') ? '&' : '?'
  // Use last updated time or current time for cache busting
  const cacheBuster = lastUpdated ? new Date(lastUpdated).getTime() : Date.now()
  return `${url}${separator}v=${cacheBuster}`
}

interface PlayerProfileViewProps {
  player: Player
  user: User
  onEdit: () => void
}

const PlayerProfileView: React.FC<PlayerProfileViewProps> = ({ player, user, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'credential' | 'account' | 'inbox' | 'connection'>('credential')
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrData = JSON.stringify({
          playerId: player.id,
          name: player.full_name,
          nrtpLevel: player.nrtp_level,
          state: player.state?.name,
          ranking: player.ranking_position,
          federation: 'Mexican Pickleball Federation'
        })
        const qrCode = await QRCode.toDataURL(qrData, {
          width: 80,
          margin: 1,
          color: {
            dark: '#ffffff',
            light: '#00000000'
          }
        })
        setQrCodeDataUrl(qrCode)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }

    generateQRCode()
  }, [player])

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-indigo-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-indigo-700 rounded-full flex items-center justify-center mr-6">
              {player.profile_photo_url ? (
                <img
                  key={`profile-header-${player.updated_at}`}
                  src={addCacheBuster(player.profile_photo_url, player.updated_at)}
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
            { key: 'credential', label: 'Credential', icon: '🏓' },
            { key: 'account', label: 'Account', icon: '👤' },
            { key: 'inbox', label: 'Inbox', icon: '📬' },
            { key: 'connection', label: 'Connection', icon: '🔗' }
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
        {/* Credential Tab - Official ID-style information */}
        {activeTab === 'credential' && (
          <div className="max-w-md mx-auto">
            {/* Official Player Card */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-xl p-6 text-white shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-semibold">MEXICAN PICKLEBALL FEDERATION</div>
                <div className="text-xs">🏓</div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-white bg-opacity-20">
                  {player.profile_photo_url ? (
                    <img
                      src={addCacheBuster(player.profile_photo_url, player.updated_at)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl">🏓</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{player.full_name}</h3>
                  <p className="text-sm text-indigo-100">NRTP Level {player.nrtp_level || 'N/A'}</p>
                  <p className="text-sm text-indigo-100">{player.state?.name || 'Mexico'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                <div>
                  <div className="text-indigo-200 uppercase tracking-wide">Ranking</div>
                  <div className="font-semibold">#{player.ranking_position || 'Unranked'}</div>
                </div>
                <div>
                  <div className="text-indigo-200 uppercase tracking-wide">Status</div>
                  <div className="font-semibold">
                    {player.affiliation_expires_at && new Date(player.affiliation_expires_at) > new Date() ? 
                      'Active' : 'Expired'}
                  </div>
                </div>
                <div>
                  <div className="text-indigo-200 uppercase tracking-wide">Club</div>
                  <div className="font-semibold">{player.club?.name || 'Independent'}</div>
                </div>
                <div>
                  <div className="text-indigo-200 uppercase tracking-wide">ID</div>
                  <div className="font-semibold">#{player.id.toString().padStart(6, '0')}</div>
                </div>
              </div>

              {player.nationality !== 'Mexico' && (
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xs text-indigo-200">Nationality:</span>
                  <span className="text-sm font-semibold">🌎 {player.nationality}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <div className="text-indigo-200">Valid until</div>
                  <div>{player.affiliation_expires_at ? 
                    new Date(player.affiliation_expires_at).toLocaleDateString() : 
                    'No expiration'}</div>
                </div>
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded flex items-center justify-center">
                  {qrCodeDataUrl ? (
                    <img src={qrCodeDataUrl} alt="QR Code" className="w-14 h-14" />
                  ) : (
                    <div className="text-xs text-center">
                      <div>📱</div>
                      <div className="text-[8px]">QR CODE</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              Official Player Credential • Mexican Pickleball Federation
            </div>
          </div>
        )}

        {/* Account Tab - Edit personal data */}
        {activeTab === 'account' && (
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile & Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Profile Photo</label>
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    {player.profile_photo_url ? (
                      <img
                        src={addCacheBuster(player.profile_photo_url, player.updated_at)}
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

            {/* Privacy Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Player Search Visibility</h4>
                    <p className="text-gray-600 text-sm">
                      Control whether other players can find you in search results.
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
            </div>
          </div>
        )}

        {/* Inbox Tab - Notification center */}
        {activeTab === 'inbox' && <PlayerInbox />}

        {/* Connection Tab - Player search (Premium feature) */}
        {activeTab === 'connection' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Find Players</h3>
            
            {!user.is_premium ? (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-8 text-center">
                <span className="text-4xl mb-4 block">🌟</span>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Premium Feature</h4>
                <p className="text-gray-600 mb-4">
                  Search for other players nearby and connect with them to play. This feature is available with a premium subscription.
                </p>
                <button
                  onClick={() => alert('Premium upgrade feature would open here')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Upgrade to Premium
                </button>
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="text-6xl text-gray-400 mb-4 block">🔗</span>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Player Connection</h4>
                <p className="text-gray-500 mb-6">
                  Search for players in your area and send them match requests.
                </p>
                <button
                  onClick={() => alert('Player finder feature would be implemented here')}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Search Players
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerProfileView