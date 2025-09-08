import React from 'react'
import { UserRole } from '../../../types'

interface UserTypeOption {
  value: UserRole
  label: string
  description: string
  icon: string
  features: string[]
  requirements: string[]
  fees: string
}

interface UserTypeCardProps {
  type: UserTypeOption
  selectedType: UserRole | null
  onSelect: (type: UserRole) => void
}

const UserTypeCard: React.FC<UserTypeCardProps> = ({ type, selectedType, onSelect }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
        selectedType === type.value 
          ? 'ring-4 ring-indigo-500 bg-indigo-50' 
          : 'hover:shadow-lg'
      }`}
      onClick={() => onSelect(type.value)}
    >
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">{type.icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {type.label}
        </h3>
        <p className="text-gray-600 text-sm">
          {type.description}
        </p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
        <ul className="space-y-1">
          {type.features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Required Information</h4>
        <ul className="space-y-1">
          {type.requirements.slice(0, 3).map((req, idx) => (
            <li key={idx} className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {req}
            </li>
          ))}
          {type.requirements.length > 3 && (
            <li className="text-sm text-gray-500 ml-6">
              +{type.requirements.length - 3} more requirements
            </li>
          )}
        </ul>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center text-sm">
          <svg className="w-4 h-4 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span className="text-gray-600 font-medium">{type.fees}</span>
        </div>
      </div>

      {selectedType === type.value && (
        <div className="mt-4 flex items-center justify-center">
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            Selected
          </div>
        </div>
      )}
    </div>
  )
}

export default UserTypeCard