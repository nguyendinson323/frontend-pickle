import React from 'react'
import { SystemStatus } from '../../../store/slices/adminDashboardSlice'

interface AdminSystemStatusProps {
  systemStatus: SystemStatus
}

interface StatusService {
  key: keyof SystemStatus
  name: string
  description: string
  icon: JSX.Element
}

const AdminSystemStatus: React.FC<AdminSystemStatusProps> = ({ systemStatus }) => {
  const services: StatusService[] = [
    {
      key: 'database',
      name: 'Database',
      description: 'PostgreSQL cluster status',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      )
    },
    {
      key: 'email',
      name: 'Email Service',
      description: 'SMTP & notifications',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      key: 'storage',
      name: 'File Storage',
      description: 'S3 & media uploads',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v8.586l-2.293-2.293a1 1 0 00-1.414 0L12 12.586l-2.293-2.293a1 1 0 00-1.414 0L6 12.586V4a1 1 0 011-1z" />
        </svg>
      )
    },
    {
      key: 'payments',
      name: 'Payment Gateway',
      description: 'Stripe & transactions',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    }
  ]

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online': return 'text-green-600'
      case 'offline': return 'text-red-600'
      case 'maintenance': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBgColor = (status: string): string => {
    switch (status) {
      case 'online': return 'bg-green-50 border-green-200'
      case 'offline': return 'bg-red-50 border-red-200'
      case 'maintenance': return 'bg-yellow-50 border-yellow-200'
      default: return 'bg-gray-50 border-gray-200'
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
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        )
      case 'offline':
        return (
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        )
      case 'maintenance':
        return (
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
        )
      default:
        return (
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
        )
    }
  }

  const getOverallStatus = (): { status: string; count: { online: number; offline: number; maintenance: number } } => {
    const statuses = Object.values(systemStatus)
    const count = {
      online: statuses.filter(s => s === 'online').length,
      offline: statuses.filter(s => s === 'offline').length,
      maintenance: statuses.filter(s => s === 'maintenance').length
    }

    if (count.offline > 0) return { status: 'offline', count }
    if (count.maintenance > 0) return { status: 'maintenance', count }
    return { status: 'online', count }
  }

  const overall = getOverallStatus()

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">System Status</h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {getStatusIcon(overall.status)}
              <span className={`text-sm font-medium ${getStatusColor(overall.status)}`}>
                {getStatusText(overall.status)}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {services.map((service) => {
            const status = systemStatus[service.key]
            return (
              <div
                key={service.key}
                className={`group p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${getStatusBgColor(status)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      status === 'online' ? 'bg-green-100 text-green-600' :
                      status === 'offline' ? 'bg-red-100 text-red-600' :
                      status === 'maintenance' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {service.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-gray-800">
                        {service.name}
                      </h4>
                      <p className="text-xs text-gray-500">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(status)}
                    <span className={`text-sm font-medium ${getStatusColor(status)}`}>
                      {getStatusText(status)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Response time: &lt;100ms</span>
                  <span>Uptime: 99.9%</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">System Health Overview</h4>
            <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium transition-colors duration-200">
              View Details →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{overall.count.online}</div>
              <div className="text-xs text-gray-500">Services Online</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{overall.count.maintenance}</div>
              <div className="text-xs text-gray-500">In Maintenance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{overall.count.offline}</div>
              <div className="text-xs text-gray-500">Offline</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSystemStatus