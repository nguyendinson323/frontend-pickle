import React from 'react'
import { FiShield, FiMapPin, FiUsers, FiTrendingUp } from 'react-icons/fi'

const StateRegisterHeader: React.FC = () => {
  return (
    <div className="text-center mb-12 relative">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>

      <div className="flex justify-center mb-6 relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <FiShield className="w-10 h-10 text-white relative z-10" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 bg-clip-text text-transparent mb-3">
          State Committee Registration
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Lead pickleball development and governance at the state level
        </p>

        <div className="flex justify-center items-center space-x-8 mt-8">
          <div className="flex items-center space-x-2 text-green-600">
            <FiMapPin className="w-5 h-5" />
            <span className="text-sm font-medium">State Coverage</span>
          </div>
          <div className="w-2 h-2 bg-green-300 rounded-full"></div>
          <div className="flex items-center space-x-2 text-green-600">
            <FiUsers className="w-5 h-5" />
            <span className="text-sm font-medium">Committee Authority</span>
          </div>
          <div className="w-2 h-2 bg-green-300 rounded-full"></div>
          <div className="flex items-center space-x-2 text-green-600">
            <FiTrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Regional Growth</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StateRegisterHeader