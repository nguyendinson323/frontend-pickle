import React from 'react'
import { Player, User } from '../../../types/auth'

interface PlayerProfileViewProps {
  player: Player
  user: User
  onEdit: () => void
}

const PlayerProfileView: React.FC<PlayerProfileViewProps> = ({ player, user, onEdit }) => {
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

      <div className="p-8">
        {/* Account Information */}
        <div className="mb-8">
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
        <div className="mb-8">
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
    </div>
  )
}

export default PlayerProfileView