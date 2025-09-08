import React from 'react'
import { PartnerRegisterRequest } from '../../../../types'

interface PrivacyPolicySectionProps {
  formData: PartnerRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

const PrivacyPolicySection: React.FC<PrivacyPolicySectionProps> = ({ formData, onInputChange }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div className="flex items-start">
        <input
          type="checkbox"
          name="privacyPolicyAccepted"
          checked={formData.privacyPolicyAccepted}
          onChange={onInputChange}
          required
          className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        <div className="ml-3">
          <p className="text-sm text-gray-700">
            I accept the{' '}
            <button type="button" className="text-orange-600 hover:text-orange-500 underline">
              Privacy Policy
            </button>{' '}
            and{' '}
            <button type="button" className="text-orange-600 hover:text-orange-500 underline">
              Terms of Service
            </button>{' '}
            of the Mexican Pickleball Federation. I confirm that I have the authority to register this business as a federation partner and that all provided information is accurate and up-to-date. I understand that partner membership includes premium features and associated fees.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicySection