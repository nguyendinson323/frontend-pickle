import React from 'react'
import { FiTag, FiCheck, FiTarget, FiUsers, FiBookOpen, FiHeart } from 'react-icons/fi'
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
  const getTypeIcon = (value: string) => {
    switch (value) {
      case 'recreational': return FiUsers
      case 'competitive': return FiTarget
      case 'training': return FiBookOpen
      case 'social': return FiHeart
      default: return FiTag
    }
  }

  const getTypeGradient = (value: string) => {
    switch (value) {
      case 'recreational': return 'from-green-500 to-emerald-600'
      case 'competitive': return 'from-red-500 to-pink-600'
      case 'training': return 'from-blue-500 to-indigo-600'
      case 'social': return 'from-purple-500 to-pink-600'
      default: return 'from-gray-500 to-slate-600'
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
          <FiTag className="w-5 h-5 text-white" />
        </div>
        Club Type
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clubTypes.map(type => {
          const IconComponent = getTypeIcon(type.value)
          const isSelected = formData.clubType === type.value

          return (
            <div key={type.value} className="relative group">
              <input
                type="radio"
                name="clubType"
                value={type.value}
                checked={isSelected}
                onChange={onInputChange}
                className="sr-only"
                id={`clubType-${type.value}`}
              />
              <label
                htmlFor={`clubType-${type.value}`}
                className={`block p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                  isSelected
                    ? `border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl ring-4 ring-purple-200`
                    : 'border-gray-300 bg-white/80 backdrop-blur-sm hover:border-purple-400 hover:shadow-lg'
                }`}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <FiCheck className="w-4 h-4 text-white font-bold" />
                  </div>
                )}

                {/* Type Icon */}
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getTypeGradient(type.value)} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className={`font-bold text-lg ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
                    {type.label}
                  </div>
                </div>

                {/* Description */}
                <div className={`text-sm leading-relaxed ${isSelected ? 'text-purple-700' : 'text-gray-600'}`}>
                  {type.description}
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                  isSelected ? '' : 'bg-gradient-to-br from-purple-50/50 to-pink-50/50'
                }`}></div>
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ClubTypeSection