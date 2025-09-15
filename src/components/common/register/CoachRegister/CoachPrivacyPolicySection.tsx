import React from 'react'
import { FiShield, FiCheck, FiExternalLink } from 'react-icons/fi'
import { CoachRegisterRequest } from '../../../../types'

interface CoachPrivacyPolicySectionProps {
  formData: CoachRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

const CoachPrivacyPolicySection: React.FC<CoachPrivacyPolicySectionProps> = ({ formData, onInputChange }) => {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-8">
      <div className="flex items-start space-x-4">
        {/* Enhanced Checkbox */}
        <div className="relative flex-shrink-0 mt-1">
          <input
            type="checkbox"
            name="privacyPolicyAccepted"
            checked={formData.privacyPolicyAccepted}
            onChange={onInputChange}
            required
            className="sr-only"
            id="coach-privacy-policy-checkbox"
          />
          <label
            htmlFor="coach-privacy-policy-checkbox"
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 ${
              formData.privacyPolicyAccepted
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-500 shadow-lg'
                : 'bg-white border-gray-300 hover:border-blue-400'
            }`}
          >
            {formData.privacyPolicyAccepted && (
              <FiCheck className="w-4 h-4 text-white font-bold" />
            )}
          </label>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mr-3">
              <FiShield className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-bold text-amber-800 text-lg">Coach Agreement</h4>
          </div>

          <p className="text-amber-700 leading-relaxed mb-4">
            I accept the{' '}
            <button
              type="button"
              className="inline-flex items-center text-blue-600 hover:text-blue-500 font-semibold underline decoration-2 underline-offset-2 transition-colors duration-200"
            >
              Privacy Policy
              <FiExternalLink className="w-3 h-3 ml-1" />
            </button>{' '}
            and{' '}
            <button
              type="button"
              className="inline-flex items-center text-blue-600 hover:text-blue-500 font-semibold underline decoration-2 underline-offset-2 transition-colors duration-200"
            >
              Terms of Service
              <FiExternalLink className="w-3 h-3 ml-1" />
            </button>{' '}
            of the Mexican Pickleball Federation.
          </p>

          <p className="text-amber-700 leading-relaxed mb-4">
            I understand that all provided information will be verified and that I must maintain valid coaching qualifications to retain my coach status.
          </p>

          {/* Verification Notice */}
          <div className="mt-4 flex items-center text-amber-700">
            <FiCheck className="w-4 h-4 mr-2 text-amber-600" />
            <span className="text-sm font-medium">Coach certification verification required</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachPrivacyPolicySection