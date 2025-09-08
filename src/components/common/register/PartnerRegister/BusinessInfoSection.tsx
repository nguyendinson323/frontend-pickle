import React from 'react'
import { PartnerRegisterRequest } from '../../../../types'

interface BusinessInfoSectionProps {
  formData: PartnerRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  mexicanStates: string[]
}

const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({ formData, onInputChange, mexicanStates }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Business Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
            placeholder="Official name of your business"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person Name *</label>
          <input
            type="text"
            name="contactPersonName"
            value={formData.contactPersonName}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
            placeholder="Full name of main contact person"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State Location *</label>
          <select
            name="state"
            value={formData.state}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
          >
            <option value="">Select state where business is located</option>
            {mexicanStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">RFC (Optional)</label>
          <input
            type="text"
            name="rfc"
            value={formData.rfc}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
            placeholder="Tax identification number"
            maxLength={13}
          />
        </div>
      </div>
    </div>
  )
}

export default BusinessInfoSection