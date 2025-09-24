import React from 'react'
import { User } from '../../../types/auth'
import { CoachProfileData } from '../../../store/slices/coachProfileSlice'
import {
  FiAward,
  FiMapPin,
  FiStar,
  FiTarget,
  FiUser,
  FiCheckCircle,
  FiAlertTriangle,
  FiX,
  FiDollarSign,
  FiCalendar
} from 'react-icons/fi'

interface CoachCredentialTabProps {
  profile: CoachProfileData
  user: User
}

const CoachCredentialTab: React.FC<CoachCredentialTabProps> = ({ profile }) => {
  // Generate QR code URL (placeholder - in real app would use actual QR code library)
  const qrCodeUrl = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="white"/>
      <text x="50" y="50" font-family="Arial" font-size="8" text-anchor="middle" dominant-baseline="middle">QR</text>
      <rect x="10" y="10" width="80" height="80" fill="none" stroke="black" stroke-width="2"/>
    </svg>
  `)}`

  // Calculate affiliation status
  const getAffiliationStatus = () => {
    if (!profile.affiliation_expires_at) return 'Active'
    
    const expiryDate = new Date(profile.affiliation_expires_at)
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    if (expiryDate < now) return 'Expired'
    if (expiryDate < thirtyDaysFromNow) return 'Expiring Soon'
    return 'Active'
  }

  const affiliationStatus = getAffiliationStatus()
  
  return (
    <div className="max-w-2xl mx-auto">
      {/* Digital Credential Card */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with Federation Logo */}
        <div className="bg-gradient-to-r from-green-700 to-green-800 p-6 text-center border-b border-green-500">
          <div className="flex items-center justify-center space-x-6">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg">
              <FiAward className="text-green-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MEXICAN PICKLEBALL FEDERATION</h1>
              <p className="text-sm text-green-200 font-medium">Official Coach Credential</p>
            </div>
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg">
              <span className="text-green-600 font-bold text-2xl">🇲🇽</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Photo and QR */}
            <div className="text-center">
              <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-green-700 to-green-800 rounded-3xl flex items-center justify-center shadow-lg">
                {profile.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt="Coach"
                    className="w-28 h-28 rounded-3xl object-cover border-4 border-white"
                  />
                ) : (
                  <FiUser className="text-4xl text-white" />
                )}
              </div>

              {/* QR Code */}
              <div className="bg-white p-3 rounded-2xl inline-block shadow-lg">
                <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20" />
              </div>
              <p className="text-xs mt-2 text-green-200 font-medium">Scan to verify</p>
            </div>

            {/* Middle Column - Main Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-4">{profile.full_name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white bg-opacity-10 rounded-2xl p-4">
                    <div className="flex items-center mb-2">
                      <FiMapPin className="w-5 h-5 mr-2 text-green-200" />
                      <p className="text-sm text-green-200 font-bold">State of Affiliation</p>
                    </div>
                    <p className="text-lg font-bold">{profile.state_name || 'Unknown State'}</p>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-2xl p-4">
                    <div className="flex items-center mb-2">
                      <FiStar className="w-5 h-5 mr-2 text-green-200" />
                      <p className="text-sm text-green-200 font-bold">NRTP Level</p>
                    </div>
                    <p className="text-lg font-bold">{profile.nrtp_level || 'Not Assigned'}</p>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-2xl p-4">
                    <div className="flex items-center mb-2">
                      {affiliationStatus === 'Active' ? <FiCheckCircle className="w-5 h-5 mr-2 text-green-200" /> :
                       affiliationStatus === 'Expiring Soon' ? <FiAlertTriangle className="w-5 h-5 mr-2 text-yellow-200" /> :
                       <FiX className="w-5 h-5 mr-2 text-red-200" />}
                      <p className="text-sm text-green-200 font-bold">Affiliation Status</p>
                    </div>
                    <p className={`text-lg font-bold ${
                      affiliationStatus === 'Active' ? 'text-green-200' :
                      affiliationStatus === 'Expiring Soon' ? 'text-yellow-200' :
                      'text-red-200'
                    }`}>
                      {affiliationStatus}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-2xl p-4">
                    <div className="flex items-center mb-2">
                      <FiTarget className="w-5 h-5 mr-2 text-green-200" />
                      <p className="text-sm text-green-200 font-bold">Ranking Position</p>
                    </div>
                    <p className="text-lg font-bold">Not Available</p>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-2xl p-4">
                    <div className="flex items-center mb-2">
                      <FiAward className="w-5 h-5 mr-2 text-green-200" />
                      <p className="text-sm text-green-200 font-bold">License Type</p>
                    </div>
                    <p className="text-lg font-bold">Coaching License</p>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-2xl p-4">
                    <div className="flex items-center mb-2">
                      <span className="mr-2 text-xl">🇲🇽</span>
                      <p className="text-sm text-green-200 font-bold">Nationality</p>
                    </div>
                    <p className="text-lg font-bold">Mexican</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-green-500">
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="text-green-200">Coach ID</p>
                <p className="font-mono">MPF-COACH-{profile.id.toString().padStart(6, '0')}</p>
              </div>
              <div className="text-right">
                <p className="text-green-200">Issued by</p>
                <p className="font-medium">Mexican Pickleball Federation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-8 bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center mr-4">
            <FiAward className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Credential Information</h3>
        </div>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiDollarSign className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="font-bold text-gray-900 text-lg">Coaching Rate</p>
                  <p className="text-sm text-gray-600 font-medium">Current hourly rate for coaching services</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl px-4 py-2 shadow-md border border-gray-200">
                <p className="text-2xl font-bold text-green-600">
                  ${profile.hourly_rate || 'Not Set'}/hour
                </p>
              </div>
            </div>
          </div>

          {profile.affiliation_expires_at && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiCalendar className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Affiliation Expires</p>
                    <p className="text-sm text-gray-600 font-medium">Membership renewal required by this date</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl px-4 py-2 shadow-md border border-gray-200">
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(profile.affiliation_expires_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-purple-50 to-purple-50 border border-purple-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {profile.user.is_verified ? (
                  <FiCheckCircle className="w-6 h-6 text-green-600 mr-3" />
                ) : (
                  <FiAlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                )}
                <div>
                  <p className="font-bold text-gray-900 text-lg">Verification Status</p>
                  <p className="text-sm text-gray-600 font-medium">Account verification status with the federation</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-2xl text-sm font-bold border shadow-md ${
                profile.user.is_verified
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-200 text-green-800'
                  : 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-200 text-yellow-800'
              }`}>
                {profile.user.is_verified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachCredentialTab