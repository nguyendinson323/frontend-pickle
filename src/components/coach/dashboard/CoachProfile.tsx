import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const CoachProfile: React.FC = () => {
  const { profile, loading } = useSelector((state: RootState) => state.coach)

  if (loading) {
    return <div className="p-4">Loading profile...</div>
  }

  if (!profile) {
    return <div className="p-4">No profile data available</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Coach Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="mt-1 text-sm text-gray-900">{profile.full_name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.hourly_rate ? `$${profile.hourly_rate}/hour` : 'Not set'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <p className="mt-1 text-sm text-gray-900">{profile.specialization || 'General coaching'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <p className="mt-1 text-sm text-gray-900">{profile.years_experience || 'Not specified'}</p>
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact & Availability</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-sm text-gray-900">{profile.phone || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.bio || 'No bio provided'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Available for Sessions</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.available_for_sessions ? 'Yes' : 'No'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Available for Refereeing</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.available_for_refereeing ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Certifications</h3>
        {profile.certifications && profile.certifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.certifications.map((cert: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{cert.name}</h4>
                <p className="text-sm text-gray-600">{cert.issuing_organization}</p>
                <p className="text-sm text-gray-500">
                  Issued: {new Date(cert.issued_date).toLocaleDateString()}
                </p>
                {cert.expiry_date && (
                  <p className="text-sm text-gray-500">
                    Expires: {new Date(cert.expiry_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No certifications added</p>
        )}
      </div>
      
      <div className="mt-6 flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Edit Profile
        </button>
      </div>
    </div>
  )
}

export default CoachProfile