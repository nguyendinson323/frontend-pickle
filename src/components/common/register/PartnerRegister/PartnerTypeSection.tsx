import React from 'react'
import { FiTag, FiCheck } from 'react-icons/fi'
import { PartnerRegisterRequest } from '../../../../types'

interface PartnerType {
  value: string
  label: string
  description: string
  icon: string
}

interface PartnerTypeSectionProps {
  formData: PartnerRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  partnerTypes: PartnerType[]
}

const PartnerTypeSection: React.FC<PartnerTypeSectionProps> = ({ formData, onInputChange, partnerTypes }) => {
  return (
    <div className="bg-gradient-to-br from-orange-50/50 to-red-50/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-200/50 shadow-lg">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <FiTag className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Partner Type</h3>
          <p className="text-sm text-gray-600">Select the category that best describes your business</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {partnerTypes.map(type => (
          <div key={type.value} className="relative group">
            <input
              type="radio"
              name="partnerType"
              value={type.value}
              checked={formData.partnerType === type.value}
              onChange={onInputChange}
              className="sr-only"
              id={`partnerType-${type.value}`}
            />
            <label
              htmlFor={`partnerType-${type.value}`}
              className={`block p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden ${
                formData.partnerType === type.value
                  ? 'border-orange-500 bg-gradient-to-br from-orange-100 to-red-100 shadow-lg'
                  : 'border-gray-200 hover:border-orange-300 bg-white/80 backdrop-blur-sm shadow-sm'
              }`}
            >
              {formData.partnerType === type.value && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <FiCheck className="w-3 h-3 text-white" />
                </div>
              )}

              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3 text-2xl ${
                  formData.partnerType === type.value
                    ? 'bg-orange-200/50'
                    : 'bg-gray-100 group-hover:bg-orange-100'
                }`}>
                  {type.icon}
                </div>
                <div className={`font-bold text-lg ${
                  formData.partnerType === type.value ? 'text-orange-900' : 'text-gray-900'
                }`}>
                  {type.label}
                </div>
              </div>

              <div className={`text-sm leading-relaxed ${
                formData.partnerType === type.value ? 'text-orange-800' : 'text-gray-600'
              }`}>
                {type.description}
              </div>

              <div className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 ${
                formData.partnerType === type.value
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : 'bg-transparent group-hover:bg-orange-200'
              }`}></div>
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-orange-100/50 rounded-xl border border-orange-200">
        <div className="flex items-start space-x-3">
          <FiTag className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-orange-900 mb-1">Partner Categories</h4>
            <p className="text-xs text-orange-800">
              Choose the category that best represents your business. This helps us provide tailored features and connect you with relevant opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnerTypeSection