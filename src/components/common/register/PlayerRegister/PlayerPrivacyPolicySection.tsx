import React from 'react'

interface PlayerPrivacyPolicySectionProps {
  privacyAccepted: boolean
  onPrivacyAcceptedChange: (accepted: boolean) => void
}

const PlayerPrivacyPolicySection: React.FC<PlayerPrivacyPolicySectionProps> = ({ 
  privacyAccepted, 
  onPrivacyAcceptedChange 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Privacy Policy
      </h2>
      
      <div className="space-y-4">
        <div className="max-h-32 overflow-y-auto border border-gray-300 rounded p-4 text-sm text-gray-600">
          <p className="mb-2">
            By registering with the Mexican Pickleball Federation, you agree to our privacy policy and terms of service.
            Your personal information will be used solely for federation activities, tournament registration, and communication.
          </p>
          <p className="mb-2">
            We collect and process your data in accordance with Mexican privacy laws and international standards.
            Your information will not be shared with third parties without your explicit consent.
          </p>
          <p>
            You have the right to access, modify, or delete your personal data at any time through your account settings
            or by contacting federation support.
          </p>
        </div>
        
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={privacyAccepted}
            onChange={(e) => onPrivacyAcceptedChange(e.target.checked)}
            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            I have read and accept the privacy policy and terms of service *
          </span>
        </label>
      </div>
    </div>
  )
}

export default PlayerPrivacyPolicySection