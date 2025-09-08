import React from 'react'

interface StatePrivacyPolicySectionProps {
  privacyAccepted: boolean
  onPrivacyAcceptedChange: (accepted: boolean) => void
}

const StatePrivacyPolicySection: React.FC<StatePrivacyPolicySectionProps> = ({ 
  privacyAccepted, 
  onPrivacyAcceptedChange 
}) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div className="flex items-start">
        <input
          type="checkbox"
          name="privacyPolicyAccepted"
          checked={privacyAccepted}
          onChange={(e) => onPrivacyAcceptedChange(e.target.checked)}
          required
          className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
        />
        <div className="ml-3">
          <p className="text-sm text-gray-700">
            I accept the{' '}
            <button type="button" className="text-red-600 hover:text-red-500 underline">
              Privacy Policy
            </button>{' '}
            and{' '}
            <button type="button" className="text-red-600 hover:text-red-500 underline">
              Terms of Service
            </button>{' '}
            of the Mexican Pickleball Federation. I confirm that I have the legal authority to register this state committee and represent pickleball interests in my state. I understand the responsibilities and commitments involved in state-level management and agree to work cooperatively with the national federation. All provided information is accurate and up-to-date.
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatePrivacyPolicySection