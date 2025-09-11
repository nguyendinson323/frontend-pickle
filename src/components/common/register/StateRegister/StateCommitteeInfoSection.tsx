import React from 'react'
import { StateRegisterRequest } from '../../../../types'
import { State } from '../../../../types/auth'

interface StateCommitteeInfoSectionProps {
  formData: StateRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  states: State[]
}

const StateCommitteeInfoSection: React.FC<StateCommitteeInfoSectionProps> = ({ formData, onInputChange, states }) => {
  return (
    <div className=" p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Committee Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Committee/Association Name *</label>
          <input
            type="text"
            name="committeeName"
            value={formData.committeeName}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
            placeholder="Official name of your state committee or association"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">President Name *</label>
          <input
            type="text"
            name="presidentName"
            value={formData.presidentName}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
            placeholder="Full name of committee president or chairman"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State Coverage Area *</label>
          <select
            name="stateCoverage"
            value={formData.stateCoverage}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
          >
            <option value="">Select the state you will manage</option>
            {states.map(state => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">RFC (Optional)</label>
          <input
            type="text"
            name="rfc"
            value={formData.rfc}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
            placeholder="Tax identification number if applicable"
            maxLength={13}
          />
        </div>
      </div>
    </div>
  )
}

export default StateCommitteeInfoSection