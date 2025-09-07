import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const ClubProfile: React.FC = () => {
  const { profile, loading } = useSelector((state: RootState) => state.club)

  if (loading) {
    return <div className="p-4">Loading profile...</div>
  }

  if (!profile) {
    return <div className="p-4">No profile data available</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Club Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Club Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Club Name</label>
              <p className="mt-1 text-sm text-gray-900">{profile.club_name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">RFC</label>
              <p className="mt-1 text-sm text-gray-900">{profile.rfc || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-sm text-gray-900">{profile.address || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.state?.name || 'Not specified'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Has Courts</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.has_courts ? 'Yes' : 'No'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Member Count</label>
              <p className="mt-1 text-sm text-gray-900">{profile.member_count || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Management & Contact</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Manager Name</label>
              <p className="mt-1 text-sm text-gray-900">{profile.manager_name || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Manager Title</label>
              <p className="mt-1 text-sm text-gray-900">{profile.manager_title || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-sm text-gray-900">{profile.phone || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.website ? (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    {profile.website}
                  </a>
                ) : (
                  'Not provided'
                )}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Social Media</label>
              <p className="mt-1 text-sm text-gray-900">{profile.social_media || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Premium Status</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.premium_expires_at 
                  ? `Premium until: ${new Date(profile.premium_expires_at).toLocaleDateString()}`
                  : 'No premium subscription'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {profile.logo_url && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Club Logo</h3>
          <img 
            src={profile.logo_url} 
            alt="Club Logo" 
            className="h-32 w-32 object-contain border rounded-lg"
          />
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Edit Profile
        </button>
      </div>
    </div>
  )
}

export default ClubProfile