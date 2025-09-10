import React from 'react'
import { SystemStatus } from '../../../store/slices/adminDashboardSlice'

interface AdminSystemStatusProps {
  systemStatus: SystemStatus
}

const AdminSystemStatus: React.FC<AdminSystemStatusProps> = ({ systemStatus }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online': return 'text-green-600'
      case 'offline': return 'text-red-600'
      case 'maintenance': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'online': return 'Operational'
      case 'offline': return 'Offline'
      case 'maintenance': return 'Maintenance'
      default: return 'Unknown'
    }
  }

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case 'online':
        return (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'offline':
        return (
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case 'maintenance':
        return (
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      default:
        return (
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">System Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            {getStatusIcon(systemStatus.database)}
          </div>
          <h4 className="font-semibold text-gray-900">Database</h4>
          <p className={`text-sm ${getStatusColor(systemStatus.database)}`}>
            {getStatusText(systemStatus.database)}
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            {getStatusIcon(systemStatus.email)}
          </div>
          <h4 className="font-semibold text-gray-900">Email Service</h4>
          <p className={`text-sm ${getStatusColor(systemStatus.email)}`}>
            {getStatusText(systemStatus.email)}
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            {getStatusIcon(systemStatus.storage)}
          </div>
          <h4 className="font-semibold text-gray-900">Storage</h4>
          <p className={`text-sm ${getStatusColor(systemStatus.storage)}`}>
            {getStatusText(systemStatus.storage)}
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            {getStatusIcon(systemStatus.payments)}
          </div>
          <h4 className="font-semibold text-gray-900">Payments</h4>
          <p className={`text-sm ${getStatusColor(systemStatus.payments)}`}>
            {getStatusText(systemStatus.payments)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminSystemStatus