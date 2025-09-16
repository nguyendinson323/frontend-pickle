import React from 'react'
import { FiUser, FiCalendar, FiMapPin, FiFileText, FiAward, FiUsers } from 'react-icons/fi'
import { CoachRegisterRequest } from '../../../../types'

interface State {
  id: number
  name: string
  short_code: string | null
}

interface CoachPersonalInfoSectionProps {
  formData: CoachRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  states: State[]
}

const CoachPersonalInfoSection: React.FC<CoachPersonalInfoSectionProps> = ({ formData, onInputChange, states }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
          <FiUser className="w-5 h-5 text-white" />
        </div>
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2 group">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <FiUser className="w-4 h-4 mr-2 text-blue-600" />
            Full Name *
          </label>
          <div className="relative">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={onInputChange}
              required
              className="w-full px-4 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-blue-400 group-hover:shadow-lg"
              placeholder="First Name Last Name"
            />
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <FiCalendar className="w-4 h-4 mr-2 text-blue-600" />
            Date of Birth *
          </label>
          <div className="relative">
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={onInputChange}
              required
              className="w-full px-4 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-blue-400 group-hover:shadow-lg"
            />
            <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <FiUsers className="w-4 h-4 mr-2 text-blue-600" />
            Gender *
          </label>
          <div className="relative">
            <select
              name="gender"
              value={formData.gender}
              onChange={onInputChange}
              required
              className="w-full px-4 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-blue-400 group-hover:shadow-lg appearance-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <FiUsers className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <FiMapPin className="w-4 h-4 mr-2 text-blue-600" />
            State of Residence *
          </label>
          <div className="relative">
            <select
              name="state"
              value={formData.state}
              onChange={onInputChange}
              required
              className="w-full px-4 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-blue-400 group-hover:shadow-lg appearance-none"
            >
              <option value="">Select your state</option>
              {states.map(state => (
                <option key={state.id} value={state.id.toString()}>{state.name}</option>
              ))}
            </select>
            <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <FiFileText className="w-4 h-4 mr-2 text-blue-600" />
            CURP *
          </label>
          <div className="relative">
            <input
              type="text"
              name="curp"
              value={formData.curp}
              onChange={onInputChange}
              required
              className="w-full px-4 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-blue-400 group-hover:shadow-lg"
              placeholder="18 character CURP"
              maxLength={18}
            />
            <FiFileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <FiAward className="w-4 h-4 mr-2 text-blue-600" />
            NRTP Level *
          </label>
          <div className="relative">
            <select
              name="nrtpLevel"
              value={formData.nrtpLevel}
              onChange={onInputChange}
              required
              className="w-full px-4 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-blue-400 group-hover:shadow-lg appearance-none"
            >
              <option value="1.0">1.0 - Beginner</option>
              <option value="1.5">1.5</option>
              <option value="2.0">2.0 - Novice</option>
              <option value="2.5">2.5</option>
              <option value="3.0">3.0 - Intermediate</option>
              <option value="3.5">3.5</option>
              <option value="4.0">4.0 - Advanced</option>
              <option value="4.5">4.5</option>
              <option value="5.0">5.0 - Professional</option>
            </select>
            <FiAward className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachPersonalInfoSection