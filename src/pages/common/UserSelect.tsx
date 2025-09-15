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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-300 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/4 right-20 w-48 h-48 bg-cyan-300 rounded-full blur-2xl animate-bounce opacity-20" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-300 rounded-full blur-xl animate-ping opacity-25" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-emerald-400 rounded-full blur-lg animate-pulse opacity-30" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full blur-3xl animate-spin opacity-10" style={{ animationDuration: '20s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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