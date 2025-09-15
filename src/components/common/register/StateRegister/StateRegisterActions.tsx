import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiShield, FiCheck } from 'react-icons/fi'

interface StateRegisterActionsProps {
  isLoading: boolean
}

const StateRegisterActions: React.FC<StateRegisterActionsProps> = ({ isLoading }) => {
  const navigate = useNavigate()

  const handleBackToSelect = () => {
    navigate('/register')
  }

  return (
    <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 backdrop-blur-sm rounded-2xl p-8 border border-green-200/50 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
            <FiShield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">Ready to Lead Your State?</h4>
            <p className="text-sm text-gray-600">Complete your registration to become an official state committee</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <button
            type="button"
            onClick={handleBackToSelect}
            className="flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 bg-white/60 backdrop-blur-sm hover:bg-white/80 px-6 py-3 rounded-xl font-medium transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to User Selection</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[280px]"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating State Committee Account...</span>
              </>
            ) : (
              <>
                <FiCheck className="w-5 h-5" />
                <span>Complete State Registration</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StateRegisterActions