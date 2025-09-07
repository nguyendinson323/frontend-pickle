import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const StateProfile: React.FC = () => {
  const { profile, loading } = useSelector((state: RootState) => state.state)

  if (loading) {
    return <div className="p-4">Loading profile...</div>
  }

  if (!profile) {
    return <div className="p-4">No profile data available</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">State Committee Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Committee Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Committee Name</label>
              <p className="mt-1 text-sm text-gray-900">{profile.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.state?.name || 'Not specified'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">RFC</label>
              <p className="mt-1 text-sm text-gray-900">{profile.rfc || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-sm text-gray-900">{profile.phone || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Institutional Email</label>
              <p className="mt-1 text-sm text-gray-900">{profile.institutional_email || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Leadership</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">President Name</label>
              <p className="mt-1 text-sm text-gray-900">{profile.president_name || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">President Title</label>
              <p className="mt-1 text-sm text-gray-900">{profile.president_title || 'President'}</p>
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
              <label className="block text-sm font-medium text-gray-700">Affiliation Status</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.affiliation_expires_at 
                  ? `Expires: ${new Date(profile.affiliation_expires_at).toLocaleDateString()}`
                  : 'No expiration date'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {profile.logo_url && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">State Committee Logo</h3>
          <img 
            src={profile.logo_url} 
            alt="State Committee Logo" 
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

export default StateProfile