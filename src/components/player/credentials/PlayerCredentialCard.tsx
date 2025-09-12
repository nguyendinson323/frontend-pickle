import React from 'react'
import { DigitalCredential, PlayerProfile } from '../../../store/slices/digitalCredentialsSlice'

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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading player profile...</p>
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
    <div className="max-w-2xl mx-auto">
      {/* Federation Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Mexican Pickleball Federation</h1>
            <p className="text-sm opacity-90">Official Player Credential</p>
          </div>
          <div className="text-4xl">🏓</div>
        </div>
      </div>

      {/* Main Credential Content */}
      <div className="bg-white border border-gray-200 p-8 rounded-b-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Player Photo and Basic Info */}
          <div className="md:col-span-2">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                {playerProfile.profile_photo_url ? (
                  <img 
                    src={playerProfile.profile_photo_url} 
                    alt={playerProfile.full_name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {playerProfile.full_name}
                </h2>
                <div className="space-y-1">
                  <p className="text-lg text-gray-700">
                    <span className="font-medium">State:</span> {playerProfile.state?.name || 'Not specified'}
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-medium">NRTP Level:</span> {playerProfile.nrtp_level || 'Unrated'}
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-medium">Ranking:</span> {playerProfile.ranking_position ? `#${playerProfile.ranking_position}` : 'Unranked'}
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-medium">Club:</span> {playerProfile.club?.name || 'Independent'}
                  </p>
                </div>
              </div>
            </div>

            {/* Status and ID */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Affiliation Status</p>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  getAffiliationStatus() === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {getAffiliationStatus() === 'active' ? 'Active Member' : 'Expired'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Player ID</p>
                <p className="text-lg font-mono font-bold text-gray-900">
                  {playerProfile.id.toString().padStart(6, '0')}
                </p>
              </div>
            </div>

            {/* Nationality */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Nationality</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">
                  {playerProfile.nationality === 'Mexico' ? '🇲🇽' : '🏴‍☠️'}
                </span>
                <span className="text-lg text-gray-900">{playerProfile.nationality}</span>
                {playerProfile.nationality !== 'Mexico' && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Foreign Player</span>
                )}
              </div>
            </div>
          </div>

          {/* QR Code and Verification */}
          <div className="text-center">
            <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              {credential?.qr_code_url ? (
                <img 
                  src={credential.qr_code_url} 
                  alt="Player QR Code"
                  className="w-36 h-36 rounded object-contain"
                />
              ) : (
                <div className="text-gray-400">
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-xs">QR Code</p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-2">Scan for verification</p>
            
            {credential && (
              <div className="text-xs text-gray-600">
                <p>Issued: {formatDate(credential.issue_date)}</p>
                {credential.expiry_date && (
                  <p>Expires: {formatDate(credential.expiry_date)}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            This is an official digital credential issued by the Mexican Pickleball Federation
          </p>
          {playerProfile.affiliation_expires_at && (
            <p className="text-xs text-gray-500 mt-1">
              Membership valid until: {formatDate(playerProfile.affiliation_expires_at)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlayerCredentialCard