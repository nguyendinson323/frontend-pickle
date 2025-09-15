import React from 'react'
import { UserRole } from '../../../types'
import UserTypeCard from './UserTypeCard'

interface UserTypeOption {
  value: UserRole
  label: string
  description: string
  icon: string
  features: string[]
  requirements: string[]
  fees: string
}

interface UserTypeGridProps {
  userTypes: UserTypeOption[]
  selectedType: UserRole | null
  onTypeSelect: (type: UserRole) => void
}

const UserTypeGrid: React.FC<UserTypeGridProps> = ({ userTypes, selectedType, onTypeSelect }) => {
  return (
    <div className="relative mb-16">
      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {userTypes.map((type, index) => (
          <div
            key={type.value}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <UserTypeCard
              type={type}
              selectedType={selectedType}
              onSelect={onTypeSelect}
            />
          </div>
        ))}
      </div>

      {/* Floating Selection Indicator */}
      {selectedType && (
        <div className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-white rounded-full animate-ping"></span>
            <span className="text-sm font-bold">
              {userTypes.find(t => t.value === selectedType)?.label} Selected
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserTypeGrid