import React from 'react'
import { FiUser, FiAward, FiStar, FiShield } from 'react-icons/fi'

const CoachRegisterHeader: React.FC = () => {
  return (
    <div className="text-center mb-12">
      {/* Hero Icon */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl mb-6">
            <span className="text-white text-3xl font-bold">👨‍🏫</span>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center animate-bounce">
            <FiStar className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center animate-pulse">
            <FiShield className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      {/* Main Title */}
      <div className="space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent leading-tight">
          Coach Registration
        </h1>

        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed">
            Register as a certified pickleball coach and share your expertise.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Build your coaching profile, manage students, and provide professional training within our community.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="flex justify-center items-center space-x-8 mt-8">
          <div className="flex items-center text-blue-600">
            <FiUser className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Coach Profile</span>
          </div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="flex items-center text-indigo-600">
            <FiAward className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Certification</span>
          </div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="flex items-center text-blue-700">
            <FiShield className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Verified Status</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachRegisterHeader