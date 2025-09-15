import React from 'react'
import { FiUsers, FiStar, FiShield } from 'react-icons/fi'

const UserSelectHeader: React.FC = () => {
  return (
    <div className="text-center mb-16">
      {/* Hero Icon */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl mb-6">
            <span className="text-white text-3xl font-bold">🏓</span>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center animate-bounce">
            <FiStar className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center animate-pulse">
            <FiShield className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      {/* Main Title */}
      <div className="space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent leading-tight">
          Choose Your Account Type
        </h1>

        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed">
            Select the type of account that best describes your role in the pickleball federation.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Each account type has different features, requirements, and benefits tailored to your specific needs.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="flex justify-center items-center space-x-8 mt-8">
          <div className="flex items-center text-emerald-600">
            <FiUsers className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">5 Account Types</span>
          </div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="flex items-center text-cyan-600">
            <FiStar className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Specialized Features</span>
          </div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="flex items-center text-blue-600">
            <FiShield className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Verified Accounts</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserSelectHeader