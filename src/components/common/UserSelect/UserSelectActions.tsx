import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiUserPlus } from 'react-icons/fi'
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
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
      <button
        onClick={handleBackToLogin}
        className="group flex items-center text-gray-600 hover:text-gray-800 px-6 py-4 text-lg font-medium transition-all duration-300 hover:bg-white/60 hover:backdrop-blur-sm rounded-xl hover:shadow-lg"
      >
        <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Back to Login</span>
      </button>

      <button
        onClick={handleContinue}
        disabled={!selectedType}
        className={`group relative overflow-hidden px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-500 transform shadow-xl ${
          selectedType
            ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white hover:scale-[1.02] hover:shadow-2xl'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {selectedType && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}

        <div className="relative flex items-center space-x-3">
          {selectedType ? (
            <>
              <FiUserPlus className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span>Continue as {userTypes.find(t => t.value === selectedType)?.label}</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </>
          ) : (
            <>
              <FiUserPlus className="w-6 h-6" />
              <span>Select Account Type First</span>
            </>
          )}
        </div>

        {selectedType && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
      </button>
    </div>
  )
}

export default UserSelectActions