import React from 'react'

interface DigitalCredentialCardProps {
  name: string
  role: 'player' | 'coach' | 'club' | 'partner' | 'state'
  nrtpLevel?: number
  ranking?: number
  memberSince: string
  profilePhoto?: string
  qrCodeData: string
  affiliationStatus: 'active' | 'pending' | 'expired'
  onDownload?: () => void
  onShare?: () => void
}

export const DigitalCredentialCard: React.FC<DigitalCredentialCardProps> = ({
  name,
  role,
  nrtpLevel,
  ranking,
  memberSince,
  profilePhoto,
  qrCodeData,
  affiliationStatus,
  onDownload,
  onShare
}) => {
  const getRoleIcon = () => {
    switch (role) {
      case 'player': return '🏓'
      case 'coach': return '👨‍🏫'
      case 'club': return '🏢'
      case 'partner': return '🏨'
      case 'state': return '🏛️'
      default: return '🎫'
    }
  }

  const getRoleColor = () => {
    switch (role) {
      case 'player': return 'from-green-600 to-blue-600'
      case 'coach': return 'from-blue-600 to-purple-600'
      case 'club': return 'from-purple-600 to-pink-600'
      case 'partner': return 'from-orange-600 to-red-600'
      case 'state': return 'from-red-600 to-pink-600'
      default: return 'from-gray-600 to-gray-800'
    }
  }

  const getStatusColor = () => {
    switch (affiliationStatus) {
      case 'active': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'expired': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusText = () => {
    switch (affiliationStatus) {
      case 'active': return 'Active Member'
      case 'pending': return 'Pending Approval'
      case 'expired': return 'Membership Expired'
      default: return 'Unknown Status'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-sm mx-auto">
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${getRoleColor()} p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl">{getRoleIcon()}</div>
          <div className="text-right">
            <h3 className="text-lg font-bold">Digital Credential</h3>
            <p className="text-sm opacity-90">Mexican Pickleball Federation</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
            {profilePhoto ? (
              <img src={profilePhoto} alt={name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-sm opacity-90 capitalize">{role}</p>
            <p className={`text-sm font-medium ${getStatusColor()}`}>
              ● {getStatusText()}
            </p>
          </div>
        </div>
      </div>

      {/* Credential Details */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {nrtpLevel && (
            <div className="text-center p-3  rounded-lg">
              <p className="text-sm text-gray-600">NRTP Level</p>
              <p className="text-lg font-bold text-gray-900">{nrtpLevel}</p>
            </div>
          )}
          {ranking && (
            <div className="text-center p-3  rounded-lg">
              <p className="text-sm text-gray-600">Ranking</p>
              <p className="text-lg font-bold text-gray-900">#{ranking}</p>
            </div>
          )}
          <div className="text-center p-3  rounded-lg col-span-2">
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="text-lg font-bold text-gray-900">{memberSince}</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="text-center mb-4">
          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
            {qrCodeData ? (
              <img src={qrCodeData} alt="QR Code" className="w-28 h-28 rounded object-contain" />
            ) : (
              <div className="w-28 h-28 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs text-gray-600">QR Code</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">Scan for verification</p>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {onDownload && (
            <button
              onClick={onDownload}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Download
            </button>
          )}
          {onShare && (
            <button
              onClick={onShare}
              className="flex-1 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Share
            </button>
          )}
        </div>

        {/* Federation Logo/Text */}
        <div className="text-center mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Official credential issued by the Mexican Pickleball Federation
          </p>
        </div>
      </div>
    </div>
  )
}