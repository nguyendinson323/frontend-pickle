import React from 'react'
import { FiArrowLeft, FiUserPlus, FiLoader } from 'react-icons/fi'

interface ClubRegisterActionsProps {
  isFormValid: () => boolean
  isLoading: boolean
  onBackToSelect: () => void
}

const ClubRegisterActions: React.FC<ClubRegisterActionsProps> = ({ isFormValid, isLoading, onBackToSelect }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBackToSelect}
        className="group flex items-center text-gray-600 hover:text-gray-800 px-8 py-4 text-lg font-medium transition-all duration-300 hover:bg-white/60 hover:backdrop-blur-sm rounded-xl hover:shadow-lg"
      >
        <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Back to User Selection</span>
      </button>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid() || isLoading}
        className={`group relative overflow-hidden px-12 py-4 rounded-2xl text-lg font-bold transition-all duration-500 transform shadow-2xl ${
          !isFormValid() || isLoading
            ? 'bg-gray-400 cursor-not-allowed text-gray-100'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-[1.02] hover:shadow-3xl'
        }`}
      >
        {!isLoading && isFormValid() && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}

        <div className="relative flex items-center space-x-3">
          {isLoading ? (
            <>
              <FiLoader className="w-6 h-6 animate-spin" />
              <span>Creating Club Account...</span>
            </>
          ) : (
            <>
              <FiUserPlus className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span>Complete Club Registration</span>
            </>
          )}
        </div>

        {!isLoading && isFormValid() && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
      </button>
    </div>
  )
}

export default ClubRegisterActions