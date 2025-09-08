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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {userTypes.map((type) => (
        <UserTypeCard
          key={type.value}
          type={type}
          selectedType={selectedType}
          onSelect={onTypeSelect}
        />
      ))}
    </div>
  )
}

export default UserTypeGrid