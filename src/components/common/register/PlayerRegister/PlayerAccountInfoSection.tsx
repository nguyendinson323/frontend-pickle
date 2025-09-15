import React from 'react'
import { FiUser, FiMail, FiLock, FiPhone, FiShield, FiEye } from 'react-icons/fi'
import { PlayerRegisterRequest } from '../../../../types'

interface PlayerAccountInfoSectionProps {
  formData: PlayerRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

const PlayerAccountInfoSection: React.FC<PlayerAccountInfoSectionProps> = ({ formData, onInputChange }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-200/50 shadow-lg">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <FiUser className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Account Information</h3>
          <p className="text-sm text-gray-600">Create your player account credentials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiUser className="w-4 h-4 mr-2 text-blue-600" />
            Username *
          </label>
          <div className="relative">
            <input
              type="text"
              id="username"
              name="username"
              required
              value={formData.username}
              onChange={onInputChange}
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="Choose a unique username"
            />
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiMail className="w-4 h-4 mr-2 text-blue-600" />
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={onInputChange}
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="Enter your email address"
            />
            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiLock className="w-4 h-4 mr-2 text-blue-600" />
            Password *
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={onInputChange}
              className="w-full px-5 py-4 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="Create a secure password"
            />
            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            <FiEye className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer hover:text-blue-500 transition-colors duration-200" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiShield className="w-4 h-4 mr-2 text-blue-600" />
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={onInputChange}
              className="w-full px-5 py-4 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="Confirm your password"
            />
            <FiShield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            <FiEye className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer hover:text-blue-500 transition-colors duration-200" />
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-red-600 text-sm mt-2 flex items-center">
              <FiShield className="w-4 h-4 mr-1" />
              Passwords do not match
            </p>
          )}
        </div>

        <div className="md:col-span-2 group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiPhone className="w-4 h-4 mr-2 text-blue-600" />
            Phone Number (Optional)
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={onInputChange}
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="WhatsApp or mobile number"
            />
            <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-100/50 rounded-xl border border-blue-200">
        <div className="flex items-start space-x-3">
          <FiShield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Account Security</h4>
            <p className="text-xs text-blue-800">
              Your account will be used for tournament registration and court bookings. Use a strong password and keep your credentials secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerAccountInfoSection