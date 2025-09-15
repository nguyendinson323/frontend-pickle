import React from 'react'
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi'
import { ClubRegisterRequest } from '../../../../types'

interface AccountInfoSectionProps {
  formData: ClubRegisterRequest
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

const AccountInfoSection: React.FC<AccountInfoSectionProps> = ({ formData, onInputChange }) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
          <FiUser className="w-5 h-5 text-white" />
        </div>
        Account Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <FiUser className="w-4 h-4 mr-2 text-purple-600" />
            Username *
          </label>
          <div className="relative">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={onInputChange}
              required
              className="w-full px-4 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-purple-400 group-hover:shadow-lg"
              placeholder="Choose a unique username"
            />
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <FiMail className="w-4 h-4 mr-2 text-purple-600" />
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              required
              className="w-full px-4 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-purple-400 group-hover:shadow-lg"
              placeholder="club@example.com"
            />
            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <FiLock className="w-4 h-4 mr-2 text-purple-600" />
            Password *
          </label>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onInputChange}
              required
              className="w-full px-4 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-purple-400 group-hover:shadow-lg"
              placeholder="Create a secure password"
            />
            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <FiLock className="w-4 h-4 mr-2 text-purple-600" />
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onInputChange}
              required
              className="w-full px-4 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-purple-400 group-hover:shadow-lg"
              placeholder="Confirm your password"
            />
            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
          </div>
        </div>

        <div className="md:col-span-2 group">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <FiPhone className="w-4 h-4 mr-2 text-purple-600" />
            Phone Number *
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={onInputChange}
              required
              className="w-full px-4 py-4 pl-12 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-purple-400 group-hover:shadow-lg"
              placeholder="+52 55 1234 5678"
            />
            <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountInfoSection