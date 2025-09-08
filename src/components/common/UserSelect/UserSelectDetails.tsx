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

interface UserSelectDetailsProps {
  selectedType: UserRole | null
  userTypes: UserTypeOption[]
}

const UserSelectDetails: React.FC<UserSelectDetailsProps> = ({ selectedType, userTypes }) => {
  if (!selectedType) {
    return null
  }

  const selectedUserType = userTypes.find(t => t.value === selectedType)
  
  if (!selectedUserType) {
    return null
  }

  return (
    <div className="mt-12 bg-white rounded-lg shadow-lg p-8 animate-fade-in-up">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Next Steps for {selectedUserType.label} Registration
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Complete Requirements</h4>
          <ul className="space-y-2">
            {selectedUserType.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-600">
                <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                  {idx + 1}
                </span>
                {req}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">What You'll Get</h4>
          <ul className="space-y-2">
            {selectedUserType.features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h5 className="font-medium text-yellow-800 mb-1">Important Note</h5>
            <p className="text-sm text-yellow-700">
              All information provided during registration will be verified by the federation. 
              Please ensure all documents and details are accurate and up-to-date.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserSelectDetails