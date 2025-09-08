import React from 'react'
import { ClubRegisterRequest } from '../../../../types'

interface ClubType {
  value: string
  label: string
  description: string
}

interface ClubTypeSectionProps {
  formData: ClubRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  clubTypes: ClubType[]
}

const ClubTypeSection: React.FC<ClubTypeSectionProps> = ({ formData, onInputChange, clubTypes }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Club Type
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clubTypes.map(type => (
          <div key={type.value} className="relative">
            <input
              type="radio"
              name="clubType"
              value={type.value}
              checked={formData.clubType === type.value}
              onChange={onInputChange}
              className="sr-only"
              id={`clubType-${type.value}`}
            />
            <label
              htmlFor={`clubType-${type.value}`}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                formData.clubType === type.value
                  ? 'border-purple-500 bg-purple-50 text-purple-900'
                  : 'border-gray-300 hover:border-purple-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-semibold">{type.label}</div>
              <div className="text-sm text-gray-600 mt-1">{type.description}</div>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClubTypeSection