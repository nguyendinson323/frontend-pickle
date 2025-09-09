import React from 'react'

interface StatisticsCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  loading?: boolean
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  loading = false
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  )
}

// Simple Chart Components
interface MetricDisplayProps {
  label: string
  value: string | number
  change?: number
  colorClass?: string
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  label,
  value,
  change,
  colorClass = 'text-blue-600'
}) => (
  <div className="text-center p-4 bg-gray-50 rounded-lg">
    <div className={`text-2xl font-bold ${colorClass}`}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
    <div className="text-sm text-gray-600">{label}</div>
    {change !== undefined && (
      <div className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? '↗' : '↘'} {Math.abs(change)}%
      </div>
    )}
  </div>
)

interface ProgressBarProps {
  label: string
  value: number
  max: number
  colorClass?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max,
  colorClass = 'bg-blue-600'
}) => {
  const percentage = (value / max) * 100

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>{label}</span>
        <span>{value.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${colorClass} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  )
}

interface ListItemProps {
  label: string
  value: string | number
  subtitle?: string
}

export const ListItem: React.FC<ListItemProps> = ({ label, value, subtitle }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
    <div>
      <div className="font-medium text-gray-900">{label}</div>
      {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
    </div>
    <div className="text-lg font-semibold text-gray-800">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
  </div>
)

export default StatisticsCard