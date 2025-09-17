import React, { useState } from 'react'
import { CoachProfile } from '../../../store/slices/coachDashboardSlice'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import api from '../../../services/api'

interface CoachDashboardHeaderProps {
  profile: CoachProfile
}

const CoachDashboardHeader: React.FC<CoachDashboardHeaderProps> = ({ profile }) => {
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(profile.profile_photo_url || '')

  const handlePhotoUpdate = async (newPhotoUrl: string) => {
    try {
      // Update the photo on the backend
      await api.put('/api/coach/profile/photo', { profile_photo_url: newPhotoUrl })

      // Update local state
      setCurrentPhotoUrl(newPhotoUrl)
      setShowImageUpload(false)

      // Optionally refresh dashboard data
      // dispatch(fetchCoachDashboard())
    } catch (error) {
      console.error('Failed to update profile photo:', error)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative w-16 h-16 mr-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              {currentPhotoUrl ? (
                <img src={currentPhotoUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <span className="text-2xl text-white">👨‍🏫</span>
              )}
            </div>
            <button
              onClick={() => setShowImageUpload(true)}
              className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 shadow-lg transition-colors duration-200"
              title="Update profile photo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, Coach {profile.full_name}</h1>
            <p className="text-gray-600">
              Certified Pickleball Coach
              {profile.nrtp_level && ` • NRTP Level ${profile.nrtp_level}`}
              {profile.state_name && ` • ${profile.state_name}`}
            </p>
            <p className="text-sm text-blue-600 font-medium">
              ${profile.hourly_rate}/hour
            </p>
          </div>
        </div>

        <div className="text-right">
          {profile.affiliation_expires_at && (
            <p className="text-sm text-gray-600">
              Affiliation expires: {new Date(profile.affiliation_expires_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Update Profile Photo</h3>
              <button
                onClick={() => setShowImageUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <SimpleImageUpload
              fieldName="profile_photo_url"
              fileType="image"
              value={currentPhotoUrl}
              onChange={handlePhotoUpdate}
              className="bg-gray-50"
              title="Profile Photo"
              enableCropping={true}
              aspectRatio={1}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CoachDashboardHeader