import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '../../../types'

interface PlayerProfile {
  fullName: string
  nrtpLevel: string
  profilePhotoUrl?: string
}

interface PlayerData {
  currentRanking: number
}

interface PlayerCredentialPreviewProps {
  profile: PlayerProfile
  playerData: PlayerData
  user: User
}

const PlayerCredentialPreview: React.FC<PlayerCredentialPreviewProps> = ({ 
  profile, 
  playerData, 
  user 
}) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Digital Credential</h3>
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
            {profile.profilePhotoUrl ? (
              <img src={profile.profilePhotoUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <span className="text-2xl">🏓</span>
            )}
          </div>
          <div>
            <h4 className="text-xl font-bold">{profile.fullName}</h4>
            <p className="text-indigo-200">NRTP Level {profile.nrtpLevel}</p>
            <p className="text-indigo-200">Ranking: {playerData.currentRanking > 0 ? `#${playerData.currentRanking}` : 'Unranked'}</p>
            <p className="text-indigo-200">Member since {user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear()}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mb-2">
            <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs text-gray-600">QR Code</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/player/profile')}
            className="text-xs text-indigo-200 hover:text-white transition-colors duration-200"
          >
            View Full Credential
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayerCredentialPreview