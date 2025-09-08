import React from 'react'

interface PartnerProfile {
  businessName: string
  partnerType: string
  state: string
  contactPersonName: string
  businessLogoUrl?: string
}

interface PartnerDashboardHeaderProps {
  profile: PartnerProfile
}

const PartnerDashboardHeader: React.FC<PartnerDashboardHeaderProps> = ({ profile }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mr-4">
          {profile.businessLogoUrl ? (
            <img src={profile.businessLogoUrl} alt="Business Logo" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <span className="text-2xl text-white">🏨</span>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{profile.businessName}</h1>
          <p className="text-gray-600">{profile.partnerType} • {profile.state}</p>
          <p className="text-sm text-gray-500">Contact: {profile.contactPersonName}</p>
        </div>
      </div>
    </div>
  )
}

export default PartnerDashboardHeader