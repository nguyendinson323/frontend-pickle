import React from 'react'
import { StateRegisterRequest } from '../../../../types'

interface StateInstitutionalDetailsSectionProps {
  formData: StateRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

const StateInstitutionalDetailsSection: React.FC<StateInstitutionalDetailsSectionProps> = ({ formData, onInputChange }) => {
  return (
    <div className=" p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Institutional Details
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Institutional Details *</label>
        <textarea
          name="institutionalDetails"
          value={formData.institutionalDetails}
          onChange={onInputChange}
          required
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
          placeholder="Provide detailed information about your committee or association including:
- Legal status and registration details
- Organizational structure
- Current membership and affiliated clubs
- History of pickleball promotion in your state
- Plans for state-wide development
- Previous experience in sports administration"
        />
      </div>
    </div>
  )
}

export default StateInstitutionalDetailsSection