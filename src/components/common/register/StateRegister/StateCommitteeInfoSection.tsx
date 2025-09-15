import React from 'react'
import { FiUsers, FiUser, FiMapPin, FiFileText, FiStar } from 'react-icons/fi'
import { StateRegisterRequest } from '../../../../types'
import { State } from '../../../../types/auth'

interface StateCommitteeInfoSectionProps {
  formData: StateRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  states: State[]
}

const StateCommitteeInfoSection: React.FC<StateCommitteeInfoSectionProps> = ({ formData, onInputChange, states }) => {
  return (
    <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 backdrop-blur-sm p-8 rounded-2xl border border-green-200/50 shadow-lg">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <FiUsers className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Committee Information</h3>
          <p className="text-sm text-gray-600">Official state committee details and coverage area</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiUsers className="w-4 h-4 mr-2 text-green-600" />
            Committee/Association Name *
          </label>
          <div className="relative">
            <input
              type="text"
              name="committeeName"
              value={formData.committeeName}
              onChange={onInputChange}
              required
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="Official name of your state committee or association"
            />
            <FiUsers className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
          </div>
        </div>
        
        <div className="md:col-span-2 group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiUser className="w-4 h-4 mr-2 text-green-600" />
            President Name *
          </label>
          <div className="relative">
            <input
              type="text"
              name="presidentName"
              value={formData.presidentName}
              onChange={onInputChange}
              required
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="Full name of committee president or chairman"
            />
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
          </div>
        </div>
        
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiMapPin className="w-4 h-4 mr-2 text-green-600" />
            State Coverage Area *
          </label>
          <div className="relative">
            <select
              name="stateCoverage"
              value={formData.stateCoverage}
              onChange={onInputChange}
              required
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md appearance-none"
            >
              <option value="">Select the state you will manage</option>
              {states.map(state => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
            <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiFileText className="w-4 h-4 mr-2 text-green-600" />
            RFC (Optional)
          </label>
          <div className="relative">
            <input
              type="text"
              name="rfc"
              value={formData.rfc}
              onChange={onInputChange}
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="Tax identification number if applicable"
              maxLength={13}
            />
            <FiFileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-100/50 rounded-xl border border-green-200">
        <div className="flex items-start space-x-3">
          <FiStar className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-green-900 mb-1">State Committee Authority</h4>
            <p className="text-xs text-green-800">
              Your committee will have jurisdiction over all pickleball activities within your selected state. This includes tournament sanctioning, club registration, and athlete development programs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StateCommitteeInfoSection