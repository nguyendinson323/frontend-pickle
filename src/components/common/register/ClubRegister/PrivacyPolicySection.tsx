import React from 'react'
import { ClubRegisterRequest } from '../../../../types'

interface PrivacyPolicySectionProps {
  formData: ClubRegisterRequest
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
          className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <div className="ml-3">
          <p className="text-sm text-gray-700">
            I accept the{' '}
            <button type="button" className="text-purple-600 hover:text-purple-500 underline">
              Privacy Policy
            </button>{' '}
            and{' '}
            <button type="button" className="text-purple-600 hover:text-purple-500 underline">
              Terms of Service
            </button>{' '}
            of the Mexican Pickleball Federation. I confirm that I have the authority to register this club and that all provided information is accurate and up-to-date.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicySection