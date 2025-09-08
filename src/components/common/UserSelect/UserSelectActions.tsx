import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UserRole } from '../../../types'

interface UserTypeOption {
  value: UserRole
  label: string
  description: string
  icon: string
  features: string[]
  requirements: string[]
  fees: string
}

interface UserSelectActionsProps {
  selectedType: UserRole | null
  userTypes: UserTypeOption[]
}

const UserSelectActions: React.FC<UserSelectActionsProps> = ({ selectedType, userTypes }) => {
  const navigate = useNavigate()

  const handleContinue = () => {
    if (selectedType) {
      navigate(`/register/${selectedType}`)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button
        onClick={handleBackToLogin}
        className="text-gray-600 hover:text-gray-800 px-6 py-3 text-lg font-medium transition-colors duration-200"
      >
        ← Back to Login
      </button>
      
      <button
        onClick={handleContinue}
        disabled={!selectedType}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        {selectedType ? `Continue as ${userTypes.find(t => t.value === selectedType)?.label}` : 'Select Account Type'}
      </button>
    </div>
  )
}

export default UserSelectActions