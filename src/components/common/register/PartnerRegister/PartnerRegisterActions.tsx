import React from 'react'
import { FiArrowLeft, FiBriefcase, FiLoader, FiCheck } from 'react-icons/fi'

interface PartnerRegisterActionsProps {
  isLoading: boolean
  onBackToSelect: () => void
}

const PartnerRegisterActions: React.FC<PartnerRegisterActionsProps> = ({ isLoading, onBackToSelect }) => {
  return (
    <div className="bg-gradient-to-br from-orange-50/50 to-red-50/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-200/50 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
        <button
          type="button"
          onClick={onBackToSelect}
          className="group flex items-center space-x-3 text-gray-600 hover:text-orange-600 px-6 py-3 rounded-xl transition-all duration-300 hover:bg-white/50 backdrop-blur-sm border border-transparent hover:border-orange-200"
        >
          <div className="w-8 h-8 bg-gray-100 group-hover:bg-orange-100 rounded-lg flex items-center justify-center transition-colors duration-200">
            <FiArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-lg font-medium">Back to User Selection</span>
        </button>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-2 text-orange-600">
            <FiCheck className="w-5 h-5" />
            <span className="text-sm font-medium">Ready to submit</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-700 to-red-600 hover:from-orange-700 hover:via-orange-800 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:transform-none disabled:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10 flex items-center space-x-3">
              {isLoading ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  <span>Creating Partner Account...</span>
                </>
              ) : (
                <>
                  <FiBriefcase className="w-5 h-5" />
                  <span>Complete Partner Registration</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-orange-100/50 rounded-xl border border-orange-200">
        <div className="flex items-center justify-center space-x-4 text-sm text-orange-800">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>Secure Registration</span>
          </div>
          <div className="w-1 h-1 bg-orange-300 rounded-full"></div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>Instant Verification</span>
          </div>
          <div className="w-1 h-1 bg-orange-300 rounded-full"></div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>Premium Access</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnerRegisterActions