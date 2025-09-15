import React from 'react'
import { FiCheck, FiAlertCircle, FiList, FiGift } from 'react-icons/fi'
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

  const getGradientForUserType = (value: UserRole) => {
    switch (value) {
      case 'player':
        return 'from-emerald-500 to-cyan-600'
      case 'coach':
        return 'from-blue-500 to-indigo-600'
      case 'club':
        return 'from-purple-500 to-pink-600'
      case 'partner':
        return 'from-orange-500 to-red-600'
      case 'state':
        return 'from-teal-500 to-green-600'
      default:
        return 'from-gray-500 to-slate-600'
    }
  }

  return (
    <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200 animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-6">
          <div className={`w-16 h-16 bg-gradient-to-br ${getGradientForUserType(selectedType)} rounded-2xl flex items-center justify-center shadow-lg`}>
            <span className="text-white text-2xl">{selectedUserType.icon}</span>
          </div>
        </div>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          Next Steps for {selectedUserType.label} Registration
        </h3>
        <p className="text-gray-600 text-lg">
          Complete these requirements to activate your account
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Requirements Section */}
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <div className={`w-10 h-10 bg-gradient-to-br ${getGradientForUserType(selectedType)} rounded-xl flex items-center justify-center mr-4`}>
              <FiList className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-gray-800">Complete Requirements</h4>
          </div>

          <div className="space-y-4">
            {selectedUserType.requirements.map((req, idx) => (
              <div key={idx} className="group flex items-start bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
                <div className={`w-8 h-8 bg-gradient-to-br ${getGradientForUserType(selectedType)} rounded-lg flex items-center justify-center mr-4 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white text-sm font-bold">{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 font-medium leading-relaxed">{req}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <div className={`w-10 h-10 bg-gradient-to-br ${getGradientForUserType(selectedType)} rounded-xl flex items-center justify-center mr-4`}>
              <FiGift className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-gray-800">What You'll Get</h4>
          </div>

          <div className="space-y-4">
            {selectedUserType.features.map((feature, idx) => (
              <div key={idx} className="group flex items-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 hover:border-green-300 hover:shadow-md transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FiCheck className="w-4 h-4 text-white" />
                </div>
                <p className="text-green-800 font-medium leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="mt-10 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl">
        <div className="flex items-start">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
            <FiAlertCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h5 className="font-bold text-amber-800 mb-3 text-lg">Important Verification Notice</h5>
            <p className="text-amber-700 leading-relaxed">
              All information provided during registration will be thoroughly verified by the federation.
              Please ensure all documents and details are accurate and up-to-date to avoid delays in your account activation.
            </p>
            <div className="mt-4 flex items-center text-amber-700">
              <FiCheck className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Verification typically takes 2-3 business days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserSelectDetails