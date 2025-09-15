import React from 'react'
import { FiUser, FiMail, FiLock, FiPhone, FiShield, FiEye } from 'react-icons/fi'
import { StateRegisterRequest } from '../../../../types'

interface StateAccountInfoSectionProps {
  formData: StateRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

const StateAccountInfoSection: React.FC<StateAccountInfoSectionProps> = ({ formData, onInputChange }) => {
  return (
    <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 backdrop-blur-sm p-8 rounded-2xl border border-green-200/50 shadow-lg">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <FiUser className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Account Information</h3>
          <p className="text-sm text-gray-600">Create your state committee account credentials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiUser className="w-4 h-4 mr-2 text-green-600" />
            Username *
          </label>
          <div className="relative">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={onInputChange}
              required
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="Choose a unique username"
            />
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiMail className="w-4 h-4 mr-2 text-green-600" />
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              required
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="committee@example.com"
            />
            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiLock className="w-4 h-4 mr-2 text-green-600" />
            Password *
          </label>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onInputChange}
              required
              className="w-full px-5 py-4 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="Create a secure password"
            />
            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
            <FiEye className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer hover:text-green-500 transition-colors duration-200" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <FiShield className="w-4 h-4 mr-2 text-green-600" />
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onInputChange}
              required
              className="w-full px-5 py-4 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="Confirm your password"
            />
            <FiShield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
            <FiEye className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer hover:text-green-500 transition-colors duration-200" />
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
            <FiPhone className="w-4 h-4 mr-2 text-green-600" />
            Phone Number *
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={onInputChange}
              required
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md"
              placeholder="+52 55 1234 5678"
            />
            <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-100/50 rounded-xl border border-green-200">
        <div className="flex items-start space-x-3">
          <FiShield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-green-900 mb-1">Official Account Security</h4>
            <p className="text-xs text-green-800">
              Your state committee account will have administrative privileges. Use a strong password and keep your credentials secure for state-level management responsibilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StateAccountInfoSection