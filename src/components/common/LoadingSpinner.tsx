import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'indigo' | 'blue' | 'green' | 'red' | 'purple' | 'gray'
  message?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'indigo',
  message 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4'
      case 'md': return 'h-8 w-8'
      case 'lg': return 'h-16 w-16'
      case 'xl': return 'h-32 w-32'
      default: return 'h-8 w-8'
    }
  }

  const getColorClasses = () => {
    return `border-${color}-600`
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`animate-spin rounded-full border-b-2 ${getSizeClasses()} ${getColorClasses()}`}
      ></div>
      {message && (
        <p className="mt-4 text-sm text-gray-600">{message}</p>
      )}
    </div>
  )
}