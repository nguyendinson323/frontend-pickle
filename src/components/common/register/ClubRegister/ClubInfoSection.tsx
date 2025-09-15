import React from 'react'
import { FiHome, FiMapPin, FiUser, FiFileText } from 'react-icons/fi'
import { ClubRegisterRequest } from '../../../../types'

interface State {
  id: number
  name: string
  short_code: string
}

interface ClubInfoSectionProps {
  formData: ClubRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  states: State[]
}

const ClubInfoSection: React.FC<ClubInfoSectionProps> = ({ formData, onInputChange, states }) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
          <FiHome className="w-5 h-5 text-white" />
        </div>
        Club Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2 group">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <FiHome className="w-4 h-4 mr-2 text-purple-600" />
            Club Name *
          </label>
          <div className="relative">
            <input
              type="text"
              name="clubName"
              value={formData.clubName}
              onChange={onInputChange}
              required
              className="w-full px-4 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-purple-400 group-hover:shadow-lg"
              placeholder="Official name of your club"
            />
            <FiHome className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
          </div>
        </div>

        <div className="md:col-span-2 group">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <FiUser className="w-4 h-4 mr-2 text-purple-600" />
            Manager Name *
          </label>
          <div className="relative">
            <input
              type="text"
              name="managerName"
              value={formData.managerName}
              onChange={onInputChange}
              required
              className="w-full px-4 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-purple-400 group-hover:shadow-lg"
              placeholder="Full name of club manager/president"
            />
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <FiMapPin className="w-4 h-4 mr-2 text-purple-600" />
            State Location *
          </label>
          <div className="relative">
            <select
              name="state"
              value={formData.state}
              onChange={onInputChange}
              required
              className="w-full px-4 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-purple-400 group-hover:shadow-lg appearance-none"
            >
              <option value="">Select state where club is located</option>
              {states.map(state => (
                <option key={state.id} value={state.name}>{state.name}</option>
              ))}
            </select>
            <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <FiFileText className="w-4 h-4 mr-2 text-purple-600" />
            RFC (Optional)
          </label>
          <div className="relative">
            <input
              type="text"
              name="rfc"
              value={formData.rfc}
              onChange={onInputChange}
              className="w-full px-4 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-purple-400 group-hover:shadow-lg"
              placeholder="Tax identification number"
              maxLength={13}
            />
            <FiFileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClubInfoSection