import React, { useState, useEffect } from 'react'
import { Player, User } from '../../../types/auth'
import QRCode from 'qrcode'
import PlayerInbox from './PlayerInbox'
import {
  FiEdit3,
  FiUser,
  FiClock,
  FiMapPin,
  FiAward,
  FiShield,
  FiStar,
  FiSettings,
  FiInbox,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiImage,
  FiFileText,
  FiLock,
  FiUnlock,
  FiInfo,
  FiTrendingUp
} from 'react-icons/fi'

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
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-6 shadow-lg">
                {player.profile_photo_url ? (
                  <img
                    key={`profile-header-${player.updated_at}`}
                    src={addCacheBuster(player.profile_photo_url, player.updated_at)}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="w-12 h-12 text-white" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <FiCheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{player.full_name}</h1>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <FiAward className="w-4 h-4 mr-2" />
                  <span className="font-medium">NRTP Level {player.nrtp_level || 'N/A'}</span>
                </div>
                <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <FiMapPin className="w-4 h-4 mr-2" />
                  <span className="font-medium">{player.state?.name || 'Unknown State'}</span>
                </div>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full inline-flex">
                <FiTrendingUp className="w-4 h-4 mr-2" />
                <span className="font-medium">Ranking: #{player.ranking_position || 'Unranked'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="bg-white text-indigo-600 px-6 py-3 rounded-2xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
          >
            <FiEdit3 className="w-5 h-5 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-indigo-50">
        <nav className="flex space-x-2 px-8 py-2">
          {[
            { key: 'credential', label: 'Credential', icon: FiShield },
            { key: 'account', label: 'Account', icon: FiSettings },
            { key: 'inbox', label: 'Inbox', icon: FiInbox },
            { key: 'connection', label: 'Connection', icon: FiUsers }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 px-6 rounded-2xl font-bold text-sm flex items-center space-x-3 transition-all duration-300 hover:transform hover:scale-105 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-white hover:shadow-lg'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-8 bg-gradient-to-br from-white to-gray-50">
        {/* Credential Tab - Official ID-style information */}
        {activeTab === 'credential' && (
          <div className="max-w-md mx-auto">
            {/* Official Player Card */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-8 text-white shadow-2xl border-4 border-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FiShield className="w-5 h-5 mr-2" />
                  <div className="text-sm font-bold">MEXICAN PICKLEBALL FEDERATION</div>
                </div>
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FiAward className="w-4 h-4" />
                </div>
              </div>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white bg-opacity-20 shadow-lg">
                  {player.profile_photo_url ? (
                    <img
                      src={addCacheBuster(player.profile_photo_url, player.updated_at)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiUser className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{player.full_name}</h3>
                  <div className="flex items-center mb-1">
                    <FiAward className="w-4 h-4 mr-2" />
                    <p className="text-sm text-indigo-100 font-medium">NRTP Level {player.nrtp_level || 'N/A'}</p>
                  </div>
                  <div className="flex items-center">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    <p className="text-sm text-indigo-100 font-medium">{player.state?.name || 'Mexico'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div className="bg-white bg-opacity-10 rounded-xl p-3">
                  <div className="flex items-center mb-1">
                    <FiTrendingUp className="w-3 h-3 mr-1" />
                    <div className="text-indigo-200 uppercase tracking-wide text-xs font-bold">Ranking</div>
                  </div>
                  <div className="font-bold text-lg">#{player.ranking_position || 'Unranked'}</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-xl p-3">
                  <div className="flex items-center mb-1">
                    <FiCheckCircle className="w-3 h-3 mr-1" />
                    <div className="text-indigo-200 uppercase tracking-wide text-xs font-bold">Status</div>
                  </div>
                  <div className="font-bold text-lg">
                    {player.affiliation_expires_at && new Date(player.affiliation_expires_at) > new Date() ?
                      'Active' : 'Expired'}
                  </div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-xl p-3">
                  <div className="flex items-center mb-1">
                    <FiUsers className="w-3 h-3 mr-1" />
                    <div className="text-indigo-200 uppercase tracking-wide text-xs font-bold">Club</div>
                  </div>
                  <div className="font-bold">{player.club?.name || 'Independent'}</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-xl p-3">
                  <div className="flex items-center mb-1">
                    <FiFileText className="w-3 h-3 mr-1" />
                    <div className="text-indigo-200 uppercase tracking-wide text-xs font-bold">ID</div>
                  </div>
                  <div className="font-bold text-lg">#{player.id.toString().padStart(6, '0')}</div>
                </div>
              </div>

              {player.nationality !== 'Mexico' && (
                <div className="bg-white bg-opacity-10 rounded-xl p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="w-4 h-4 text-indigo-200" />
                    <span className="text-sm text-indigo-200 font-bold">Nationality:</span>
                    <span className="text-sm font-bold text-white">{player.nationality}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="bg-white bg-opacity-10 rounded-xl p-3">
                  <div className="flex items-center mb-1">
                    <FiClock className="w-3 h-3 mr-1" />
                    <div className="text-indigo-200 text-xs font-bold">Valid until</div>
                  </div>
                  <div className="font-bold">{player.affiliation_expires_at ?
                    new Date(player.affiliation_expires_at).toLocaleDateString() :
                    'No expiration'}</div>
                </div>
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center shadow-lg">
                  {qrCodeDataUrl ? (
                    <img src={qrCodeDataUrl} alt="QR Code" className="w-16 h-16 rounded-xl" />
                  ) : (
                    <div className="text-center">
                      <FiImage className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-[8px] font-bold">QR CODE</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-2xl shadow-lg">
                <FiShield className="w-4 h-4 mr-2 text-indigo-600" />
                <span className="text-sm font-bold text-indigo-800">Official Player Credential • Mexican Pickleball Federation</span>
              </div>
            </div>
          </div>
        )}

        {/* Account Tab - Edit personal data */}
        {activeTab === 'account' && (
          <div className="space-y-8">
            {/* Account Information */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <FiUser className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Account Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border-2 border-blue-100">
                  <label className="block text-sm font-bold text-blue-700 mb-2 flex items-center">
                    <FiUser className="w-4 h-4 mr-2" />
                    Username
                  </label>
                  <p className="text-gray-900 font-medium">{user.username}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-100">
                  <label className="block text-sm font-bold text-green-700 mb-2 flex items-center">
                    <FiSettings className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-100">
                  <label className="block text-sm font-bold text-purple-700 mb-2 flex items-center">
                    <FiSettings className="w-4 h-4 mr-2" />
                    Phone
                  </label>
                  <p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-100">
                  <label className="block text-sm font-bold text-green-700 mb-2 flex items-center">
                    {user.is_active ? <FiCheckCircle className="w-4 h-4 mr-2" /> : <FiXCircle className="w-4 h-4 mr-2" />}
                    Account Status
                  </label>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                      user.is_active ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border-2 border-blue-100">
                  <label className="block text-sm font-bold text-blue-700 mb-2 flex items-center">
                    {user.is_verified ? <FiShield className="w-4 h-4 mr-2" /> : <FiClock className="w-4 h-4 mr-2" />}
                    Verification Status
                  </label>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                      user.is_verified ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                    }`}>
                      {user.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-100">
                  <label className="block text-sm font-bold text-purple-700 mb-2 flex items-center">
                    {user.is_premium ? <FiStar className="w-4 h-4 mr-2" /> : <FiUser className="w-4 h-4 mr-2" />}
                    Premium Status
                  </label>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                      user.is_premium ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                    }`}>
                      {user.is_premium ? 'Premium' : 'Standard'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Player Information */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <FiAward className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Player Information</h3>
              </div>
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
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <FiFileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Profile & Documents</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border-2 border-blue-100">
                  <label className="block text-lg font-bold text-blue-700 mb-4 flex items-center">
                    <FiImage className="w-5 h-5 mr-2" />
                    Profile Photo
                  </label>
                  <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                    {player.profile_photo_url ? (
                      <img
                        src={addCacheBuster(player.profile_photo_url, player.updated_at)}
                        alt="Profile"
                        className="w-40 h-40 rounded-2xl object-cover shadow-lg"
                      />
                    ) : (
                      <FiUser className="w-20 h-20 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-3xl border-2 border-green-100">
                  <label className="block text-lg font-bold text-green-700 mb-4 flex items-center">
                    <FiFileText className="w-5 h-5 mr-2" />
                    ID Document
                  </label>
                  <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                    {player.id_document_url ? (
                      <a
                        href={player.id_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-40 h-40 rounded-2xl flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
                      >
                        <FiFileText className="w-20 h-20 text-blue-600" />
                      </a>
                    ) : (
                      <FiFileText className="w-20 h-20 text-gray-400" />
                    )}
                  </div>
                  {player.id_document_url && (
                    <p className="text-sm text-green-600 font-bold mt-2 text-center">Click to view document</p>
                  )}
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  {user.is_searchable ? <FiUnlock className="w-6 h-6 text-white" /> : <FiLock className="w-6 h-6 text-white" />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Privacy Settings</h3>
              </div>
              <div className={`bg-gradient-to-br p-8 rounded-3xl border-2 ${
                user.is_searchable
                  ? 'from-green-50 to-emerald-50 border-green-200'
                  : 'from-yellow-50 to-orange-50 border-yellow-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      {user.is_searchable ? (
                        <FiUnlock className="w-8 h-8 text-green-600 mr-4" />
                      ) : (
                        <FiLock className="w-8 h-8 text-yellow-600 mr-4" />
                      )}
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Player Search Visibility</h4>
                        <p className="text-gray-700 font-medium">
                          Control whether other players can find you in search results.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-8">
                    <div className="text-center">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg mb-4 ${
                        user.is_searchable
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                          : 'bg-gradient-to-r from-yellow-500 to-orange-600'
                      }`}>
                        {user.is_searchable ? (
                          <FiUnlock className="w-8 h-8 text-white" />
                        ) : (
                          <FiLock className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <div className={`px-4 py-2 rounded-full font-bold text-sm shadow-lg ${
                        user.is_searchable
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                          : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                      }`}>
                        {user.is_searchable ? 'Visible in searches' : 'Hidden from searches'}
                      </div>
                      <div className="bg-blue-100 border-2 border-blue-200 rounded-2xl p-3 mt-4">
                        <div className="flex items-center">
                          <FiInfo className="w-4 h-4 text-blue-600 mr-2" />
                          <p className="text-xs text-blue-800 font-bold">
                            Use the edit profile form to change this setting
                          </p>
                        </div>
                      </div>
                    </div>
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
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Find Players</h3>
            </div>

            {!user.is_premium ? (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-12 text-center shadow-xl">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FiStar className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Premium Feature</h4>
                <p className="text-gray-700 mb-8 text-lg font-medium max-w-2xl mx-auto">
                  Search for other players nearby and connect with them to play. This feature is available with a premium subscription.
                </p>
                <button
                  onClick={() => alert('Premium upgrade feature would open here')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:transform hover:scale-105"
                >
                  <FiStar className="w-5 h-5 mr-2 inline" />
                  Upgrade to Premium
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-3xl p-12 text-center shadow-xl">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FiUsers className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Player Connection</h4>
                <p className="text-gray-700 mb-8 text-lg font-medium max-w-2xl mx-auto">
                  Search for players in your area and send them match requests.
                </p>
                <button
                  onClick={() => alert('Player finder feature would be implemented here')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:transform hover:scale-105"
                >
                  <FiUsers className="w-5 h-5 mr-2 inline" />
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