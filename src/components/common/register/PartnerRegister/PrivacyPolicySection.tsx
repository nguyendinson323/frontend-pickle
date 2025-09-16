import React from 'react'
import { FiShield, FiCheck, FiAlertCircle, FiFileText } from 'react-icons/fi'
import { PartnerRegisterRequest } from '../../../../types'

interface PrivacyPolicySectionProps {
  formData: PartnerRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

const PrivacyPolicySection: React.FC<PrivacyPolicySectionProps> = ({ formData, onInputChange }) => {
  return (
    <div className="bg-gradient-to-br from-orange-50/50 to-red-50/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-200/50 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <FiShield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Terms & Privacy Agreement</h3>
          <p className="text-sm text-gray-600">Review and accept the partnership terms and conditions</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white/70 backdrop-blur-sm border border-orange-200/50 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                formData.privacyPolicyAccepted
                  ? 'bg-orange-500 border-orange-500'
                  : 'border-gray-300 hover:border-orange-400'
              }`}>
                <input
                  type="checkbox"
                  name="privacyPolicyAccepted"
                  checked={formData.privacyPolicyAccepted}
                  onChange={onInputChange}
                  required
                />
                {formData.privacyPolicyAccepted && (
                  <FiCheck className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-700 leading-relaxed">
                I accept the{' '}
                <button
                  type="button"
                  className="text-orange-600 hover:text-orange-500 underline font-medium inline-flex items-center"
                >
                  <FiFileText className="w-3 h-3 mr-1" />
                  Privacy Policy
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  className="text-orange-600 hover:text-orange-500 underline font-medium inline-flex items-center"
                >
                  <FiFileText className="w-3 h-3 mr-1" />
                  Terms of Service
                </button>{' '}
                of the Mexican Pickleball Federation.
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-orange-100/50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <FiCheck className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-orange-900 mb-1">Authority Confirmation</h4>
                <p className="text-xs text-orange-800">
                  I confirm that I have the authority to register this business as a federation partner.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-100/50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <FiCheck className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-orange-900 mb-1">Information Accuracy</h4>
                <p className="text-xs text-orange-800">
                  All provided information is accurate and up-to-date.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <FiAlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-yellow-900 mb-2">Partnership Notice</h4>
              <p className="text-xs text-yellow-800 leading-relaxed">
                Partner membership includes access to premium features and tools. Associated fees may apply based on your
                chosen service level and usage. Detailed pricing information will be provided during the onboarding process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicySection