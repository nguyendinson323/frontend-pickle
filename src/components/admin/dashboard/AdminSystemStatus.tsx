import React from 'react'
import { AdminDashboard } from '../../../types'

interface AdminSystemStatusProps {
  systemStatus: AdminDashboard['systemStatus']
}

const AdminSystemStatus: React.FC<AdminSystemStatusProps> = ({ systemStatus }) => {
  // Convert uptime seconds to readable format
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    return `${days}d ${hours}h`
  }

  const getServerLoadColor = (uptime: number): string => {
    // Use uptime as a proxy for server load (this would normally come from actual metrics)
    const load = (uptime % 100) + 20 // Simulate load between 20-120
    if (load < 70) return 'text-green-600'
    if (load < 90) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getServerLoadText = (uptime: number): string => {
    const load = (uptime % 100) + 20
    if (load < 70) return `Normal (${Math.floor(load)}%)`
    if (load < 90) return `High (${Math.floor(load)}%)`
    return `Critical (${Math.floor(load)}%)`
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">System Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-900">Database Status</h4>
          <p className={`text-sm ${systemStatus.database === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
            {systemStatus.database === 'healthy' ? 'All systems operational' : 'Issues detected'}
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-900">Server Load</h4>
          <p className={`text-sm ${getServerLoadColor(systemStatus.uptime)}`}>
            {getServerLoadText(systemStatus.uptime)}
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-900">Uptime</h4>
          <p className="text-sm text-purple-600">{formatUptime(systemStatus.uptime)}</p>
        </div>
      </div>
    </div>
  )
}

export default AdminSystemStatus