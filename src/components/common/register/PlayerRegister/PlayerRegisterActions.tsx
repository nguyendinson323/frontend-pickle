import React from 'react'
import { useNavigate } from 'react-router-dom'

interface PlayerRegisterActionsProps {
  isFormValid: () => boolean
  isLoading: boolean
}

const PlayerRegisterActions: React.FC<PlayerRegisterActionsProps> = ({ isFormValid, isLoading }) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        type="button"
        onClick={() => navigate('/register')}
        className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        ← Back to User Selection
      </button>
      
      <button
        type="submit"
        disabled={!isFormValid() || isLoading}
        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed shadow-lg"
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </div>
        ) : (
          'Register as Player'
        )}
      </button>
    </div>
  )
}

export default PlayerRegisterActions