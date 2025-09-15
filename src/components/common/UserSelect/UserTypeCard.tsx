import React from 'react'
import { FiCheck, FiFileText, FiDollarSign, FiStar } from 'react-icons/fi'
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
  const getCardGradient = (value: UserRole) => {
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

  const isSelected = selectedType === type.value

  return (
    <div
      className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 cursor-pointer transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl border-2 ${
        isSelected
          ? `ring-4 ring-offset-2 ring-emerald-400 bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-300 shadow-2xl scale-[1.02]`
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(type.value)}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <FiCheck className="w-4 h-4 text-white font-bold" />
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className={`w-16 h-16 bg-gradient-to-br ${getCardGradient(type.value)} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-white text-2xl">{type.icon}</span>
        </div>
        <h3 className={`text-2xl font-bold mb-3 ${isSelected ? 'text-emerald-800' : 'text-gray-900'}`}>
          {type.label}
        </h3>
        <p className={`text-sm leading-relaxed ${isSelected ? 'text-emerald-700' : 'text-gray-600'}`}>
          {type.description}
        </p>
      </div>

      {/* Key Features */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className={`w-6 h-6 bg-gradient-to-br ${getCardGradient(type.value)} rounded-lg flex items-center justify-center mr-2`}>
            <FiStar className="w-3 h-3 text-white" />
          </div>
          <h4 className={`font-bold ${isSelected ? 'text-emerald-800' : 'text-gray-900'}`}>Key Features</h4>
        </div>
        <ul className="space-y-2">
          {type.features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm">
              <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <FiCheck className="w-3 h-3 text-white" />
              </div>
              <span className={isSelected ? 'text-emerald-700 font-medium' : 'text-gray-600'}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Required Information */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className={`w-6 h-6 bg-gradient-to-br ${getCardGradient(type.value)} rounded-lg flex items-center justify-center mr-2`}>
            <FiFileText className="w-3 h-3 text-white" />
          </div>
          <h4 className={`font-bold ${isSelected ? 'text-emerald-800' : 'text-gray-900'}`}>Requirements</h4>
        </div>
        <ul className="space-y-2">
          {type.requirements.slice(0, 3).map((req, idx) => (
            <li key={idx} className="flex items-center text-sm">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-white text-xs font-bold">{idx + 1}</span>
              </div>
              <span className={isSelected ? 'text-emerald-700' : 'text-gray-600'}>{req}</span>
            </li>
          ))}
          {type.requirements.length > 3 && (
            <li className="flex items-center text-sm ml-8">
              <span className={`${isSelected ? 'text-emerald-600' : 'text-gray-500'} font-medium`}>
                +{type.requirements.length - 3} more requirements
              </span>
            </li>
          )}
        </ul>
      </div>

      {/* Fees */}
      <div className={`border-t-2 pt-4 ${isSelected ? 'border-emerald-200' : 'border-gray-200'}`}>
        <div className="flex items-center">
          <div className={`w-6 h-6 bg-gradient-to-br ${getCardGradient(type.value)} rounded-lg flex items-center justify-center mr-3`}>
            <FiDollarSign className="w-3 h-3 text-white" />
          </div>
          <span className={`text-sm font-semibold ${isSelected ? 'text-emerald-700' : 'text-gray-700'}`}>
            {type.fees}
          </span>
        </div>
      </div>

      {/* Selection Badge */}
      {isSelected && (
        <div className="mt-6 flex items-center justify-center">
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
            <FiCheck className="w-4 h-4" />
            <span>Selected Account Type</span>
          </div>
        </div>
      )}

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
        isSelected ? '' : 'bg-gradient-to-br from-gray-50/50 to-white/50'
      }`}></div>
    </div>
  )
}

export default UserTypeCard