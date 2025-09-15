import React from 'react'
import { FiBriefcase, FiHome, FiUsers, FiTrendingUp } from 'react-icons/fi'

const PartnerRegisterHeader: React.FC = () => {
  return (
    <div className="text-center mb-12 relative">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>

      <div className="flex justify-center mb-6 relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <FiBriefcase className="w-10 h-10 text-white relative z-10" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-orange-700 to-red-600 bg-clip-text text-transparent mb-3">
          Partner Registration
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Join the Mexican Pickleball Federation as a business partner and unlock premium opportunities
        </p>

        <div className="flex justify-center items-center space-x-8 mt-8">
          <div className="flex items-center space-x-2 text-orange-600">
            <FiHome className="w-5 h-5" />
            <span className="text-sm font-medium">Business Growth</span>
          </div>
          <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
          <div className="flex items-center space-x-2 text-orange-600">
            <FiUsers className="w-5 h-5" />
            <span className="text-sm font-medium">Community Access</span>
          </div>
          <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
          <div className="flex items-center space-x-2 text-orange-600">
            <FiTrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Revenue Streams</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnerRegisterHeader