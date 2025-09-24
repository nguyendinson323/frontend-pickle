import React from 'react'
import { DigitalCredential, PlayerProfile } from '../../../store/slices/digitalCredentialsSlice'
import {
  FiUser,
  FiMapPin,
  FiAward,
  FiShield,
  FiStar,
  FiCalendar
} from 'react-icons/fi'

interface PlayerCredentialCardProps {
  credential?: DigitalCredential
  playerProfile: PlayerProfile | null
}

const PlayerCredentialCard: React.FC<PlayerCredentialCardProps> = ({
  credential,
  playerProfile
}) => {
  if (!playerProfile) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <FiUser className="w-8 h-8 text-white animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Profile</h3>
        <p className="text-gray-600">Please wait while we load your player profile...</p>
      </div>
    )
  }

  // Check if credential is expired for future use
  // const isExpired = credential?.expiry_date && new Date(credential.expiry_date) < new Date()

  // Get affiliation status based on expiry
  const getAffiliationStatus = () => {
    if (!playerProfile.affiliation_expires_at) return 'active'
    const expiryDate = new Date(playerProfile.affiliation_expires_at)
    const today = new Date()
    return expiryDate < today ? 'expired' : 'active'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Federation Header */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center mr-6">
                <FiAward className="w-8 h-8 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">Mexican Pickleball Federation</h1>
                <p className="text-green-100 text-lg font-medium">Official Player Credential</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl px-6 py-3">
              <div className="flex items-center">
                <FiShield className="w-6 h-6 text-white mr-3" />
                <span className="font-bold text-white text-lg">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Credential Content */}
        <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Player Photo and Basic Info */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg border-4 border-white">
                {playerProfile.profile_photo_url ? (
                  <img
                    src={playerProfile.profile_photo_url}
                    alt={playerProfile.full_name}
                    className="w-full h-full rounded-3xl object-cover"
                  />
                ) : (
                  <FiUser className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {playerProfile.full_name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                    <div className="flex items-center">
                      <FiMapPin className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-blue-700">State</p>
                        <p className="text-lg font-bold text-blue-800">{playerProfile.state?.name || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                    <div className="flex items-center">
                      <FiAward className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-green-700">NRTP Level</p>
                        <p className="text-lg font-bold text-green-800">{playerProfile.nrtp_level || 'Unrated'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
                    <div className="flex items-center">
                      <FiStar className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-purple-700">Ranking</p>
                        <p className="text-lg font-bold text-purple-800">{playerProfile.ranking_position ? `#${playerProfile.ranking_position}` : 'Unranked'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
                    <div className="flex items-center">
                      <FiUser className="w-5 h-5 text-orange-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-orange-700">Club</p>
                        <p className="text-lg font-bold text-orange-800">{playerProfile.club?.name || 'Independent'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status and ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center">
                  <FiShield className="w-6 h-6 text-green-600 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-2">Affiliation Status</p>
                    <span className={`px-4 py-2 text-sm font-bold rounded-2xl ${
                      getAffiliationStatus() === 'active'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                    }`}>
                      {getAffiliationStatus() === 'active' ? 'Active Member' : 'Expired'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center">
                  <FiUser className="w-6 h-6 text-blue-600 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-blue-700 mb-2">Player ID</p>
                    <p className="text-2xl font-mono font-bold text-blue-800">
                      #{playerProfile.id.toString().padStart(6, '0')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nationality */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 mb-8">
              <div className="flex items-center">
                <FiMapPin className="w-6 h-6 text-purple-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-2">Nationality</p>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">
                      {playerProfile.nationality === 'Mexico' ? '🇲🇽' : '🏴‍☠️'}
                    </span>
                    <div>
                      <p className="text-xl font-bold text-purple-800">{playerProfile.nationality}</p>
                      {playerProfile.nationality !== 'Mexico' && (
                        <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">Foreign Player</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code and Verification */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-200 p-6 mb-6">
              <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                {credential?.qr_code_url ? (
                  <img
                    src={credential.qr_code_url}
                    alt="Player QR Code"
                    className="w-44 h-44 rounded-2xl object-contain shadow-lg"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <FiShield className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm font-medium">QR Code</p>
                    <p className="text-xs">Will appear here</p>
                  </div>
                )}
              </div>
              <div className="bg-blue-100 rounded-2xl px-4 py-3 mb-4">
                <p className="text-sm font-bold text-blue-800">🔍 Scan for Verification</p>
              </div>

              {credential && (
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                    <div className="flex items-center justify-center">
                      <FiCalendar className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-green-700">Issued</p>
                        <p className="text-lg font-bold text-green-800">{formatDate(credential.issue_date)}</p>
                      </div>
                    </div>
                  </div>
                  {credential.expiry_date && (
                    <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
                      <div className="flex items-center justify-center">
                        <FiCalendar className="w-5 h-5 text-orange-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-orange-700">Expires</p>
                          <p className="text-lg font-bold text-orange-800">{formatDate(credential.expiry_date)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200 text-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-center mb-4">
            <FiShield className="w-6 h-6 text-green-600 mr-3" />
            <p className="text-lg font-bold text-gray-900">
              Official Digital Credential
            </p>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            This is an official digital credential issued by the Mexican Pickleball Federation
          </p>
          {playerProfile.affiliation_expires_at && (
            <div className="bg-blue-100 rounded-2xl px-4 py-3 inline-block">
              <div className="flex items-center">
                <FiCalendar className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-sm font-bold text-blue-800">
                  Membership valid until: {formatDate(playerProfile.affiliation_expires_at)}
                </p>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerCredentialCard