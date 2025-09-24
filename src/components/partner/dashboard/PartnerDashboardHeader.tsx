import React from 'react'
import {
  FiHome,
  FiUser,
  FiMapPin
} from 'react-icons/fi'

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
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8 mb-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6">
        {/* Business Logo */}
        <div className="w-24 h-24 bg-gradient-to-br from-orange-600 to-orange-700 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden">
          {profile.businessLogoUrl ? (
            <img src={profile.businessLogoUrl} alt="Business Logo" className="w-full h-full object-cover" />
          ) : (
            <FiHome className="text-3xl text-white" />
          )}
        </div>

        {/* Business Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{profile.businessName}</h1>
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="flex items-center bg-gradient-to-r from-orange-100 to-orange-200 border border-orange-300 px-3 py-1 rounded-2xl">
              <FiHome className="w-4 h-4 mr-2 text-orange-700" />
              <span className="text-sm font-bold text-orange-800 capitalize">{profile.partnerType}</span>
            </div>
            <div className="flex items-center bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 px-3 py-1 rounded-2xl">
              <FiMapPin className="w-4 h-4 mr-2 text-blue-700" />
              <span className="text-sm font-bold text-blue-800">{profile.state}</span>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start text-gray-600">
            <FiUser className="w-4 h-4 mr-2" />
            <span className="font-medium">Contact: {profile.contactPersonName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnerDashboardHeader