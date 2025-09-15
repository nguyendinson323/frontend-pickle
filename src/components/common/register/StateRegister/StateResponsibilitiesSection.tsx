import React from 'react'
import { FiInfo, FiCheck, FiStar, FiSettings, FiGlobe, FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi'

const StateResponsibilitiesSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-green-50/70 to-emerald-50/70 backdrop-blur-sm border border-green-200/60 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <FiInfo className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-green-900 mb-1">State Committee Responsibilities & Benefits</h4>
          <p className="text-sm text-green-700">Understand your role and access privileges as a state committee</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-green-200/50 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
              <FiCheck className="w-4 h-4 text-white" />
            </div>
            <h5 className="text-lg font-semibold text-gray-900">Key Responsibilities</h5>
          </div>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start space-x-3">
              <FiTrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Manage state-wide pickleball development and growth initiatives</span>
            </li>
            <li className="flex items-start space-x-3">
              <FiAward className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Organize regional tournaments and state championships</span>
            </li>
            <li className="flex items-start space-x-3">
              <FiUsers className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Oversee club and player registrations within your state</span>
            </li>
            <li className="flex items-start space-x-3">
              <FiGlobe className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Coordinate with the national federation and other states</span>
            </li>
            <li className="flex items-start space-x-3">
              <FiStar className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Promote pickleball growth and community participation</span>
            </li>
          </ul>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-green-200/50 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
              <FiStar className="w-4 h-4 text-white" />
            </div>
            <h5 className="text-lg font-semibold text-gray-900">Platform Benefits</h5>
          </div>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start space-x-3">
              <FiSettings className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Advanced state management dashboard and administrative tools</span>
            </li>
            <li className="flex items-start space-x-3">
              <FiGlobe className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Official state microsite with customizable branding</span>
            </li>
            <li className="flex items-start space-x-3">
              <FiUsers className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Player oversight and comprehensive ranking system access</span>
            </li>
            <li className="flex items-start space-x-3">
              <FiAward className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Tournament organization platform with registration management</span>
            </li>
            <li className="flex items-start space-x-3">
              <FiCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Committee administration features and member management</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default StateResponsibilitiesSection