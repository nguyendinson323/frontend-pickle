import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const PlayerProfile: React.FC = () => {
  const { profile, loading } = useSelector((state: RootState) => state.player)

  if (loading) {
    return <div className="p-4">Loading profile...</div>
  }

  if (!profile) {
    return <div className="p-4">No profile data available</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Player Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="mt-1 text-sm text-gray-900">{profile.full_name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Birth Date</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.birth_date ? new Date(profile.birth_date).toLocaleDateString() : 'Not provided'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <p className="mt-1 text-sm text-gray-900">{profile.gender || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-sm text-gray-900">{profile.phone || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.state?.name || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Player Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Ranking</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.ranking_position ? `#${profile.ranking_position}` : 'Unranked'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Skill Level</label>
              <p className="mt-1 text-sm text-gray-900">{profile.skill_level || 'Not assessed'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Playing Style</label>
              <p className="mt-1 text-sm text-gray-900">{profile.playing_style || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Affiliation Status</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.affiliation_expires_at 
                  ? `Expires: ${new Date(profile.affiliation_expires_at).toLocaleDateString()}`
                  : 'No active affiliation'
                }
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Searchable Profile</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.is_searchable ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Edit Profile
        </button>
      </div>
    </div>
  )
}

export default PlayerProfile