import React from 'react'
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
        Personal Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            name="fullName"
            required
            value={formData.fullName}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            placeholder="Enter your full legal name"
          />
        </div>

        <div>
          <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            id="birth_date"
            name="birthDate"
            required
            value={formData.birthDate}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          />
          {formData.birthDate && (
            <p className="text-sm text-gray-600 mt-1">
              Age: {calculateAge(formData.birthDate)} years
            </p>
          )}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="state_id" className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <select
            id="state_id"
            name="state"
            required
            value={formData.state}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          >
            <option value="">Select your state</option>
            {states.map(state => (
              <option key={state.id} value={state.id.toString()}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="curp" className="block text-sm font-medium text-gray-700 mb-2">
            CURP (Mexican National ID)
          </label>
          <input
            type="text"
            id="curp"
            name="curp"
            value={formData.curp}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            placeholder="18-character CURP code"
            maxLength={18}
          />
        </div>

        <div>
          <label htmlFor="nrtp_level" className="block text-sm font-medium text-gray-700 mb-2">
            NRTP Skill Level
          </label>
          <select
            id="nrtp_level"
            name="nrtpLevel"
            value={formData.nrtpLevel}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
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
        </div>

        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
            Nationality
          </label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          />
        </div>
      </div>
    </div>
  )
}

export default PlayerPersonalInfoSection