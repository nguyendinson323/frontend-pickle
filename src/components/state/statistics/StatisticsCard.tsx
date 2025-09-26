import React from 'react'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'

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
      <div className={`bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 ${className}`}>
      <div className="mb-8">
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
  <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
    <div className={`text-3xl font-bold mb-2 ${colorClass}`}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
    <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>
    {change !== undefined && (
      <div className={`text-xs flex items-center justify-center space-x-1 ${
        change >= 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        {change >= 0 ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
        <span>{Math.abs(change)}%</span>
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
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
        <span>{label}</span>
        <span>{value.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-200/50 rounded-full h-3 shadow-inner">
        <div
          className={`${colorClass} h-3 rounded-full transition-all duration-500 shadow-sm`}
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
  <div className="flex justify-between items-center py-3 border-b border-gray-200/50 last:border-b-0">
    <div>
      <div className="font-medium text-gray-900">{label}</div>
      {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
    </div>
    <div className="text-lg font-bold text-gray-800">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
  </div>
)

export default StatisticsCard