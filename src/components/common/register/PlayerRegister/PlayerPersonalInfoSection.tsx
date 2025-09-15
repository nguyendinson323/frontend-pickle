import React from 'react'
import { FiUser, FiCalendar, FiGlobe, FiMapPin, FiCreditCard, FiAward, FiFlag, FiInfo } from 'react-icons/fi'
import { PlayerRegisterRequest, State } from '../../../../types'

interface PlayerPersonalInfoSectionProps {
  formData: PlayerRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  states: State[]
}

const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

const PlayerPersonalInfoSection: React.FC<PlayerPersonalInfoSectionProps> = ({
  formData,
  onInputChange,
  states
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-200/50 shadow-lg">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <FiUser className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
          <p className="text-sm text-gray-600">Provide your personal details and player information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiUser className="w-4 h-4 mr-2 text-blue-600" />
            Full Name *
          </label>
          <div className="relative">
            <input
              type="text"
              id="full_name"
              name="fullName"
              required
              value={formData.fullName}
              onChange={onInputChange}
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="Enter your full legal name"
            />
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiCalendar className="w-4 h-4 mr-2 text-blue-600" />
            Date of Birth *
          </label>
          <div className="relative">
            <input
              type="date"
              id="birth_date"
              name="birthDate"
              required
              value={formData.birthDate}
              onChange={onInputChange}
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
            />
            <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
          </div>
          {formData.birthDate && (
            <p className="text-sm text-blue-600 mt-2 flex items-center">
              <FiInfo className="w-4 h-4 mr-1" />
              Age: {calculateAge(formData.birthDate)} years
            </p>
          )}
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiGlobe className="w-4 h-4 mr-2 text-blue-600" />
            Gender *
          </label>
          <div className="relative">
            <select
              id="gender"
              name="gender"
              required
              value={formData.gender}
              onChange={onInputChange}
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md appearance-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <FiGlobe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiMapPin className="w-4 h-4 mr-2 text-blue-600" />
            State *
          </label>
          <div className="relative">
            <select
              id="state_id"
              name="state"
              required
              value={formData.state}
              onChange={onInputChange}
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md appearance-none"
            >
              <option value="">Select your state</option>
              {states.map(state => (
                <option key={state.id} value={state.id.toString()}>
                  {state.name}
                </option>
              ))}
            </select>
            <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiCreditCard className="w-4 h-4 mr-2 text-blue-600" />
            CURP (Optional)
          </label>
          <div className="relative">
            <input
              type="text"
              id="curp"
              name="curp"
              value={formData.curp}
              onChange={onInputChange}
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="18-character CURP code"
              maxLength={18}
            />
            <FiCreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiAward className="w-4 h-4 mr-2 text-blue-600" />
            NRTP Skill Level
          </label>
          <div className="relative">
            <select
              id="nrtp_level"
              name="nrtpLevel"
              value={formData.nrtpLevel}
              onChange={onInputChange}
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md appearance-none"
            >
              <option value="1.0">1.0 - Beginner</option>
              <option value="1.5">1.5 - Novice</option>
              <option value="2.0">2.0 - Beginner+</option>
              <option value="2.5">2.5 - Intermediate-</option>
              <option value="3.0">3.0 - Intermediate</option>
              <option value="3.5">3.5 - Intermediate+</option>
              <option value="4.0">4.0 - Advanced</option>
              <option value="4.5">4.5 - Advanced+</option>
              <option value="5.0">5.0 - Expert</option>
            </select>
            <FiAward className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiFlag className="w-4 h-4 mr-2 text-blue-600" />
            Nationality
          </label>
          <div className="relative">
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={onInputChange}
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="Your nationality"
            />
            <FiFlag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-100/50 rounded-xl border border-blue-200">
        <div className="flex items-start space-x-3">
          <FiInfo className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Player Information</h4>
            <p className="text-xs text-blue-800">
              Your personal information helps us create your player profile and match you with appropriate tournaments and skill levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerPersonalInfoSection