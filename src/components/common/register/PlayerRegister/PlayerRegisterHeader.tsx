import React from 'react'
import { FiUser, FiTarget, FiUsers, FiTrendingUp } from 'react-icons/fi'

const PlayerRegisterHeader: React.FC = () => {
  return (
    <div className="text-center mb-12 relative">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>

      <div className="flex justify-center mb-6 relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <FiUser className="w-10 h-10 text-white relative z-10" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent mb-3">
          Player Registration
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Join the Mexican Pickleball Federation and unlock your competitive potential
        </p>

        <div className="flex justify-center items-center space-x-8 mt-8">
          <div className="flex items-center space-x-2 text-blue-600">
            <FiTarget className="w-5 h-5" />
            <span className="text-sm font-medium">Tournament Play</span>
          </div>
          <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
          <div className="flex items-center space-x-2 text-blue-600">
            <FiUsers className="w-5 h-5" />
            <span className="text-sm font-medium">Player Community</span>
          </div>
          <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
          <div className="flex items-center space-x-2 text-blue-600">
            <FiTrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Skill Development</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerRegisterHeader