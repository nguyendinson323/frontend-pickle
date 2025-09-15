import React from 'react'
import { FiShield, FiCheck, FiFileText, FiLock } from 'react-icons/fi'

interface StatePrivacyPolicySectionProps {
  privacyAccepted: boolean
  onPrivacyAcceptedChange: (accepted: boolean) => void
}

const StatePrivacyPolicySection: React.FC<StatePrivacyPolicySectionProps> = ({
  privacyAccepted,
  onPrivacyAcceptedChange
}) => {
  return (
    <div className="bg-gradient-to-br from-green-50/70 to-emerald-50/70 backdrop-blur-sm border border-green-200/60 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <FiShield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-green-900 mb-1">Legal Agreement & Authorization</h4>
          <p className="text-sm text-green-700">Confirm your authority and acceptance of terms</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-green-200/50 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <input
              type="checkbox"
              name="privacyPolicyAccepted"
              checked={privacyAccepted}
              onChange={(e) => onPrivacyAcceptedChange(e.target.checked)}
              required
              className="h-5 w-5 text-green-600 focus:ring-green-500 border-2 border-gray-300 rounded-md transition-colors duration-200"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <FiCheck className="w-4 h-4 text-green-600 mr-2" />
              <h5 className="text-sm font-semibold text-gray-900">Required Confirmations</h5>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <FiFileText className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  I accept the{' '}
                  <button type="button" className="text-green-600 hover:text-green-700 underline font-medium transition-colors duration-200">
                    Privacy Policy
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-green-600 hover:text-green-700 underline font-medium transition-colors duration-200">
                    Terms of Service
                  </button>{' '}
                  of the Mexican Pickleball Federation.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <FiShield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  I confirm that I have the legal authority to register this state committee and represent pickleball interests in my state.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <FiLock className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  I understand the responsibilities and commitments involved in state-level management and agree to work cooperatively with the national federation.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <FiCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  All provided information is accurate and up-to-date.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatePrivacyPolicySection