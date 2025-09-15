import React from 'react'
import { FiFileText, FiClipboard, FiInfo } from 'react-icons/fi'
import { StateRegisterRequest } from '../../../../types'

interface StateInstitutionalDetailsSectionProps {
  formData: StateRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

const StateInstitutionalDetailsSection: React.FC<StateInstitutionalDetailsSectionProps> = ({ formData, onInputChange }) => {
  return (
    <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 backdrop-blur-sm p-8 rounded-2xl border border-green-200/50 shadow-lg">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <FiFileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Institutional Details</h3>
          <p className="text-sm text-gray-600">Committee structure, history, and development plans</p>
        </div>
      </div>
      
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <FiClipboard className="w-4 h-4 mr-2 text-green-600" />
          Institutional Details *
        </label>
        <div className="relative">
          <textarea
            name="institutionalDetails"
            value={formData.institutionalDetails}
            onChange={onInputChange}
            required
            rows={6}
            className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md resize-none"
            placeholder="Provide detailed information about your committee or association including:
• Legal status and registration details
• Organizational structure and governance
• Current membership and affiliated clubs
• History of pickleball promotion in your state
• Plans for state-wide development and growth
• Previous experience in sports administration
• Committee leadership and qualifications"
          />
          <FiClipboard className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-100/50 rounded-xl border border-green-200">
        <div className="flex items-start space-x-3">
          <FiInfo className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-green-900 mb-1">Institutional Documentation</h4>
            <p className="text-xs text-green-800">
              Please provide comprehensive details about your organization's structure, legal status, and commitment to developing pickleball at the state level. This information helps us understand your committee's capacity and authority.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StateInstitutionalDetailsSection