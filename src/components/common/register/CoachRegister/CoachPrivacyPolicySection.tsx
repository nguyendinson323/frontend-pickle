import React from 'react'
import { CoachRegisterRequest } from '../../../../types'

interface CoachPrivacyPolicySectionProps {
  formData: CoachRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

const CoachPrivacyPolicySection: React.FC<CoachPrivacyPolicySectionProps> = ({ formData, onInputChange }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div className="flex items-start">
        <input
          type="checkbox"
          name="privacyPolicyAccepted"
          checked={formData.privacyPolicyAccepted}
          onChange={onInputChange}
          required
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <div className="ml-3">
          <p className="text-sm text-gray-700">
            I accept the{' '}
            <button type="button" className="text-blue-600 hover:text-blue-500 underline">
              Privacy Policy
            </button>{' '}
            and{' '}
            <button type="button" className="text-blue-600 hover:text-blue-500 underline">
              Terms of Service
            </button>{' '}
            of the Mexican Pickleball Federation. I understand that all provided information will be verified and that I must maintain valid coaching qualifications to retain my coach status.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CoachPrivacyPolicySection