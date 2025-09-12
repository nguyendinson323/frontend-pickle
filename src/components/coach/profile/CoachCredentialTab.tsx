import React from 'react'
import { User } from '../../../types/auth'
import { CoachProfileData } from '../../../store/slices/coachProfileSlice'

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
        <div className="bg-green-700 p-4 text-center border-b border-green-500">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">🏓</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">MEXICAN PICKLEBALL FEDERATION</h1>
              <p className="text-sm text-green-200">Official Coach Credential</p>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">🇲🇽</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Photo and QR */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-green-700 rounded-full flex items-center justify-center">
                {profile.profile_photo_url ? (
                  <img 
                    src={profile.profile_photo_url} 
                    alt="Coach" 
                    className="w-24 h-24 rounded-full object-cover" 
                  />
                ) : (
                  <span className="text-3xl text-white">👨‍🏫</span>
                )}
              </div>
              
              {/* QR Code */}
              <div className="bg-white p-2 rounded-lg inline-block">
                <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16" />
              </div>
              <p className="text-xs mt-1 text-green-200">Scan to verify</p>
            </div>

            {/* Middle Column - Main Info */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{profile.full_name}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-green-200 font-medium">State of Affiliation</p>
                    <p className="text-lg">{profile.state_name || 'Unknown State'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-200 font-medium">NRTP Level</p>
                    <p className="text-lg">{profile.nrtp_level || 'Not Assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-200 font-medium">Affiliation Status</p>
                    <p className={`text-lg font-medium ${
                      affiliationStatus === 'Active' ? 'text-green-200' :
                      affiliationStatus === 'Expiring Soon' ? 'text-yellow-200' :
                      'text-red-200'
                    }`}>
                      {affiliationStatus}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-200 font-medium">Ranking Position</p>
                    <p className="text-lg">Not Available</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-200 font-medium">License Type</p>
                    <p className="text-lg">Coaching License</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-200 font-medium">Nationality</p>
                    <p className="text-lg flex items-center">
                      <span className="mr-2">🇲🇽</span> Mexican
                    </p>
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
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Credential Information</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Coaching Rate</p>
              <p className="text-sm text-gray-600">Current hourly rate for coaching services</p>
            </div>
            <p className="text-lg font-bold text-green-600">
              ${profile.hourly_rate || 'Not Set'}/hour
            </p>
          </div>
          
          {profile.affiliation_expires_at && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Affiliation Expires</p>
                <p className="text-sm text-gray-600">Membership renewal required by this date</p>
              </div>
              <p className="text-lg font-medium text-gray-900">
                {new Date(profile.affiliation_expires_at).toLocaleDateString()}
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Verification Status</p>
              <p className="text-sm text-gray-600">Account verification status with the federation</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              profile.user.is_verified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {profile.user.is_verified ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachCredentialTab