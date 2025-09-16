import React from 'react'
import { FiShield, FiCheck, FiAlertCircle, FiFileText } from 'react-icons/fi'

interface PlayerPrivacyPolicySectionProps {
  privacyAccepted: boolean
  onPrivacyAcceptedChange: (accepted: boolean) => void
}

const PlayerPrivacyPolicySection: React.FC<PlayerPrivacyPolicySectionProps> = ({
  privacyAccepted,
  onPrivacyAcceptedChange
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-200/50 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <FiShield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Privacy Policy & Terms</h3>
          <p className="text-sm text-gray-600">Review and accept the federation terms and conditions</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-6 max-h-40 overflow-y-auto">
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              By registering with the Mexican Pickleball Federation, you agree to our privacy policy and terms of service.
              Your personal information will be used solely for federation activities, tournament registration, and communication.
            </p>
            <p>
              We collect and process your data in accordance with Mexican privacy laws and international standards.
              Your information will not be shared with third parties without your explicit consent.
            </p>
            <p>
              You have the right to access, modify, or delete your personal data at any time through your account settings
              or by contacting federation support.
            </p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                privacyAccepted
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-gray-300 hover:border-blue-400'
              }`}>
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => onPrivacyAcceptedChange(e.target.checked)}
                  // className="sr-only"
                />
                {privacyAccepted && (
                  <FiCheck className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-700 leading-relaxed">
                I have read and accept the{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 underline font-medium inline-flex items-center"
                >
                  <FiFileText className="w-3 h-3 mr-1" />
                  Privacy Policy
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 underline font-medium inline-flex items-center"
                >
                  <FiFileText className="w-3 h-3 mr-1" />
                  Terms of Service
                </button>{' '}
                of the Mexican Pickleball Federation *
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-100/50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <FiCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Data Protection</h4>
                <p className="text-xs text-blue-800">
                  Your information is protected under Mexican privacy laws and handled securely.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-100/50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <FiCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Player Rights</h4>
                <p className="text-xs text-blue-800">
                  You can access, modify, or delete your data at any time through your account.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-blue-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <FiAlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-yellow-900 mb-2">Player Membership</h4>
              <p className="text-xs text-yellow-800 leading-relaxed">
                By creating a player account, you will have access to tournament registration, court bookings, and
                community features. Some premium services may require additional fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerPrivacyPolicySection