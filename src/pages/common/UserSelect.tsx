import React, { useState } from 'react'
import { UserRole } from '../../types'
import {
  UserSelectHeader,
  UserTypeGrid,
  UserSelectActions,
  UserSelectDetails
} from '../../components/common/UserSelect'

interface UserTypeOption {
  value: UserRole
  label: string
  description: string
  icon: string
  features: string[]
  requirements: string[]
  fees: string
}

const UserSelectPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<UserRole | null>(null)

  const userTypes: UserTypeOption[] = [
    {
      value: 'player',
      label: 'Player',
      description: 'Individual athletes who play pickleball and participate in tournaments',
      icon: '🏓',
      features: [
        'Tournament registration',
        'Court reservations',
        'Player connections',
        'Digital credentials',
        'Ranking system'
      ],
      requirements: [
        'Full name and personal information',
        'Date of birth',
        'State of residence',
        'CURP (Mexican national ID)',
        'Official ID document upload',
        'Profile photo',
        'NRTP skill level'
      ],
      fees: 'Annual membership fee required'
    },
    {
      value: 'coach',
      label: 'Coach',
      description: 'Certified trainers who provide coaching services and referee matches',
      icon: '👨‍🏫',
      features: [
        'Student management',
        'Session scheduling',
        'Certification tracking',
        'Referee opportunities',
        'Digital credentials'
      ],
      requirements: [
        'Full name and personal information',
        'Date of birth',
        'State of residence',
        'CURP (Mexican national ID)',
        'Official ID document upload',
        'Profile photo',
        'Coaching qualifications'
      ],
      fees: 'Annual membership fee required'
    },
    {
      value: 'club',
      label: 'Club',
      description: 'Organizations that unite players and may own courts or organize tournaments',
      icon: '🏢',
      features: [
        'Member management',
        'Court registration',
        'Tournament organization',
        'Club microsite',
        'Revenue generation'
      ],
      requirements: [
        'Club name and information',
        'Manager details',
        'State location',
        'Club type',
        'RFC (optional)',
        'Logo and branding'
      ],
      fees: 'Basic: Annual affiliation fee | Premium: Enhanced features'
    },
    {
      value: 'partner',
      label: 'Partner',
      description: 'Businesses, hotels, resorts that own courts and organize events for revenue',
      icon: '🏨',
      features: [
        'Court rental system',
        'Event hosting',
        'Business microsite',
        'Revenue tracking',
        'Partner benefits'
      ],
      requirements: [
        'Business name',
        'Contact person details',
        'Partner type',
        'State location',
        'RFC (optional)',
        'Business logo'
      ],
      fees: 'Premium plan only (no basic affiliation)'
    },
    {
      value: 'state',
      label: 'State Committee',
      description: 'Regional committees that manage pickleball within entire states',
      icon: '🏛️',
      features: [
        'State-wide management',
        'Regional tournaments',
        'State microsite',
        'Player oversight',
        'Committee administration'
      ],
      requirements: [
        'Committee/association name',
        'President information',
        'State coverage area',
        'RFC (optional)',
        'Institutional details',
        'Committee logo'
      ],
      fees: 'Annual affiliation fee (higher cost due to scope)'
    }
  ]

  const handleTypeSelect = (type: UserRole) => {
    setSelectedType(type)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UserSelectHeader />
        
        <UserTypeGrid 
          userTypes={userTypes}
          selectedType={selectedType}
          onTypeSelect={handleTypeSelect}
        />
        
        <UserSelectActions 
          selectedType={selectedType}
          userTypes={userTypes}
        />
        
        <UserSelectDetails 
          selectedType={selectedType}
          userTypes={userTypes}
        />
      </div>
    </div>
  )
}

export default UserSelectPage