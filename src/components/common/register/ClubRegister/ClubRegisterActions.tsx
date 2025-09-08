import React from 'react'

interface ClubRegisterActionsProps {
  isLoading: boolean
  onBackToSelect: () => void
}

const ClubRegisterActions: React.FC<ClubRegisterActionsProps> = ({ isLoading, onBackToSelect }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
      <button
        type="button"
        onClick={onBackToSelect}
        className="text-gray-600 hover:text-gray-800 px-8 py-3 text-lg font-medium transition-colors duration-200"
      >
        ← Back to User Selection
      </button>
      
      <button
        type="submit"
        disabled={isLoading}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-12 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Club Account...
          </div>
        ) : (
          'Complete Club Registration'
        )}
      </button>
    </div>
  )
}

export default ClubRegisterActions