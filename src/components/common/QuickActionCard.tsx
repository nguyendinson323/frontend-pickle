import React from 'react'

interface QuickActionCardProps {
  title: string
  description: string
  icon: string
  onClick: () => void
  variant?: 'default' | 'primary' | 'secondary'
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({ 
  title, 
  description, 
  icon, 
  onClick,
  variant = 'default' 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'border-indigo-300 hover:border-indigo-500 hover:shadow-lg bg-indigo-50 hover:bg-indigo-100'
      case 'secondary':
        return 'border-purple-300 hover:border-purple-500 hover:shadow-lg bg-purple-50 hover:bg-purple-100'
      default:
        return 'border-gray-300 hover:border-gray-400 hover:shadow-md bg-white hover:'
    }
  }

  return (
    <button
      onClick={onClick}
      className={`text-left p-4 border-2 rounded-lg transition-all duration-200 ${getVariantClasses()}`}
    >
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-3">{icon}</span>
        <h4 className="font-semibold text-gray-900">{title}</h4>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  )
}