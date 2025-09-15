import React from 'react'
import { FiHome, FiUser, FiMapPin, FiCreditCard, FiCheckCircle } from 'react-icons/fi'
import { PartnerRegisterRequest } from '../../../../types'
import { State } from '../../../../types/auth'

interface BusinessInfoSectionProps {
  formData: PartnerRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  states: State[]
}

const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({ formData, onInputChange, states }) => {
  return (
    <div className="bg-gradient-to-br from-orange-50/50 to-red-50/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-200/50 shadow-lg">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <FiHome className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Business Information</h3>
          <p className="text-sm text-gray-600">Provide your business details and registration info</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiHome className="w-4 h-4 mr-2 text-orange-600" />
            Business Name *
          </label>
          <div className="relative">
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={onInputChange}
              required
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="Official name of your business"
            />
            <FiHome className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
          </div>
        </div>

        <div className="md:col-span-2 group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiUser className="w-4 h-4 mr-2 text-orange-600" />
            Contact Person Name *
          </label>
          <div className="relative">
            <input
              type="text"
              name="contactPersonName"
              value={formData.contactPersonName}
              onChange={onInputChange}
              required
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="Full name of main contact person"
            />
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiMapPin className="w-4 h-4 mr-2 text-orange-600" />
            State Location *
          </label>
          <div className="relative">
            <select
              name="state"
              value={formData.state}
              onChange={onInputChange}
              required
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md appearance-none"
            >
              <option value="">Select state where business is located</option>
              {states.map(state => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
            <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiCreditCard className="w-4 h-4 mr-2 text-orange-600" />
            RFC (Optional)
          </label>
          <div className="relative">
            <input
              type="text"
              name="rfc"
              value={formData.rfc}
              onChange={onInputChange}
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="Tax identification number"
              maxLength={13}
            />
            <FiCreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-orange-100/50 rounded-xl border border-orange-200">
        <div className="flex items-start space-x-3">
          <FiCheckCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-orange-900 mb-1">Business Verification</h4>
            <p className="text-xs text-orange-800">
              Ensure all business information is accurate. This will be used for federation verification and partner directory listing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessInfoSection