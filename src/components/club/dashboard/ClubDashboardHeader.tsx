import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AppDispatch } from '../../../store'
import { updateClubLogoAPI } from '../../../store/slices/clubDashboardSlice'
import SimpleImageUpload from '../../common/SimpleImageUpload'

interface ClubProfile {
  id: number
  user_id: number
  name: string
  rfc: string | null
  manager_name: string
  manager_title: string
  state_id: number
  club_type: string
  website: string | null
  social_media: string | null
  logo_url: string | null
  has_courts: boolean
  premium_expires_at: string | null
  affiliation_expires_at: string | null
  created_at: string
  updated_at: string
  state: {
    id: number
    name: string
    short_code: string
  }
}

interface ClubDashboardHeaderProps {
  profile: ClubProfile
}

const ClubDashboardHeader: React.FC<ClubDashboardHeaderProps> = ({ profile }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [isEditingLogo, setIsEditingLogo] = useState(false)

  const handleLogoUpdate = async (logoUrl: string) => {
    try {
      await dispatch(updateClubLogoAPI(logoUrl))
      setIsEditingLogo(false)
    } catch (error) {
      console.error('Failed to update logo:', error)
      // The error will be handled by the Redux slice and shown in the UI
    }
  }

  const getStatusBadges = () => {
    const badges = []

    if (profile.premium_expires_at && new Date(profile.premium_expires_at) > new Date()) {
      badges.push(
        <span key="premium" className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
          Premium
        </span>
      )
    }

    if (profile.affiliation_expires_at && new Date(profile.affiliation_expires_at) > new Date()) {
      badges.push(
        <span key="affiliated" className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
          Affiliated
        </span>
      )
    }

    if (profile.has_courts) {
      badges.push(
        <span key="courts" className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
          Courts Available
        </span>
      )
    }

    return badges
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mr-4 group cursor-pointer">
              {profile.logo_url ? (
                <img
                  src={profile.logo_url}
                  alt="Club Logo"
                  className="w-16 h-16 rounded-full object-cover"
                  onClick={() => setIsEditingLogo(true)}
                />
              ) : (
                <span
                  className="text-2xl text-white"
                  onClick={() => setIsEditingLogo(true)}
                >
                  🏢
                </span>
              )}
              <div
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                onClick={() => setIsEditingLogo(true)}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            {isEditingLogo && (
              <div className="absolute top-0 left-0 z-50">
                <SimpleImageUpload
                  fieldName="logo_url"
                  fileType="image"
                  value={profile.logo_url || ''}
                  onChange={handleLogoUpdate}
                  title="Upload Club Logo"
                  enableCropping={true}
                  aspectRatio={1}
                />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center mb-1">
              <h1 className="text-3xl font-bold text-gray-900 mr-3">{profile.name}</h1>
              {getStatusBadges()}
            </div>
            <p className="text-gray-600">{profile.club_type} Club{profile.state?.name && ` • ${profile.state.name}`}</p>
            <p className="text-sm text-gray-500">Manager: {profile.manager_name || 'Not specified'}</p>
            {profile.website && (
              <p className="text-sm text-blue-600">
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {profile.website}
                </a>
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/club/profile')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Profile
          </button>
          <button
            onClick={() => navigate('/club/membership')}
            className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClubDashboardHeader