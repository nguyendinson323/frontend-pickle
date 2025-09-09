import React from 'react'
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
    <div className=" p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Partner Type
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partnerTypes.map(type => (
          <div key={type.value} className="relative">
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
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                formData.partnerType === type.value
                  ? 'border-orange-500 bg-orange-50 text-orange-900'
                  : 'border-gray-300 hover:border-orange-300 hover:'
              }`}
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{type.icon}</span>
                <div className="font-semibold">{type.label}</div>
              </div>
              <div className="text-sm text-gray-600">{type.description}</div>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PartnerTypeSection