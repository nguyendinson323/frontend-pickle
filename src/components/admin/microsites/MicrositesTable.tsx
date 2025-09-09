import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { MicrositeAdmin } from '../../../types/admin'
import { exportMicrosites } from '../../../store/slices/adminMicrositesSlice'
import MicrositeStatusModal from './MicrositeStatusModal'
import MicrositeAnalyticsModal from './MicrositeAnalyticsModal'
import MicrositeAuditModal from './MicrositeAuditModal'
import MicrositeNotificationModal from './MicrositeNotificationModal'

interface MicrositesTableProps {
  onMicrositeSelect: (microsite: MicrositeAdmin) => void
}

const MicrositesTable: React.FC<MicrositesTableProps> = ({ onMicrositeSelect }) => {
  const dispatch = useDispatch()
  const { microsites, micrositeFilter, loading } = useSelector((state: RootState) => state.adminMicrosites)
  const [selectedMicrosite, setSelectedMicrosite] = useState<MicrositeAdmin | null>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive' },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', label: 'Suspended' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      approved: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getOwnerTypeBadge = (type: string) => {
    const typeConfig = {
      club: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Club', icon: '🏸' },
      partner: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Partner', icon: '🤝' },
      state: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'State', icon: '🏛️' }
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.club
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    )
  }

  const getVisibilityBadge = (visibility: string) => {
    const visibilityConfig = {
      public: { bg: 'bg-green-100', text: 'text-green-800', label: 'Public' },
      private: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Private' },
      restricted: { bg: 'bg-red-100', text: 'text-red-800', label: 'Restricted' }
    }
    const config = visibilityConfig[visibility as keyof typeof visibilityConfig] || visibilityConfig.public
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getContentStatus = (microsite: MicrositeAdmin) => {
    if (microsite.has_inappropriate_content) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          ⚠️ Flagged
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        ✅ Clean
      </span>
    )
  }

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    dispatch(exportMicrosites(micrositeFilter, format) as any)
  }

  const handleStatusChange = (microsite: MicrositeAdmin) => {
    setSelectedMicrosite(microsite)
    setShowStatusModal(true)
  }

  const handleAnalytics = (microsite: MicrositeAdmin) => {
    setSelectedMicrosite(microsite)
    setShowAnalyticsModal(true)
  }

  const handleAudit = (microsite: MicrositeAdmin) => {
    setSelectedMicrosite(microsite)
    setShowAuditModal(true)
  }

  const handleNotification = (microsite: MicrositeAdmin) => {
    setSelectedMicrosite(microsite)
    setShowNotificationModal(true)
  }

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-8 gap-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Microsites ({microsites.length})
          </h3>
          <div className="flex space-x-3">
            <div className="relative inline-block text-left">
              <select
                onChange={(e) => handleExport(e.target.value as 'csv' | 'excel' | 'pdf')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                defaultValue=""
              >
                <option value="" disabled>Export</option>
                <option value="csv">Export as CSV</option>
                <option value="excel">Export as Excel</option>
                <option value="pdf">Export as PDF</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Site Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visibility
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {microsites.map((microsite) => (
              <tr key={microsite.id} className="hover:">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{microsite.title}</div>
                    <div className="text-sm text-gray-500">{microsite.domain_name}</div>
                    <a 
                      href={microsite.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:text-indigo-900"
                    >
                      Visit Site →
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{microsite.owner_name}</div>
                  {getOwnerTypeBadge(microsite.owner_type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(microsite.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getVisibilityBadge(microsite.visibility_status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    {getContentStatus(microsite)}
                    <div className="text-xs text-gray-500">
                      Score: {microsite.content_score}/100
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>Views: {microsite.page_views.toLocaleString()}</div>
                  <div>Visitors: {microsite.monthly_visitors.toLocaleString()}/mo</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(microsite.last_updated).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onMicrositeSelect(microsite)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleStatusChange(microsite)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Status
                    </button>
                    <button
                      onClick={() => handleAnalytics(microsite)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Analytics
                    </button>
                    <button
                      onClick={() => handleAudit(microsite)}
                      className="text-orange-600 hover:text-orange-900"
                    >
                      Audit
                    </button>
                    <button
                      onClick={() => handleNotification(microsite)}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      Notify
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {microsites.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No microsites found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {selectedMicrosite && showStatusModal && (
        <MicrositeStatusModal
          microsite={selectedMicrosite}
          onClose={() => setShowStatusModal(false)}
        />
      )}

      {selectedMicrosite && showAnalyticsModal && (
        <MicrositeAnalyticsModal
          microsite={selectedMicrosite}
          onClose={() => setShowAnalyticsModal(false)}
        />
      )}

      {selectedMicrosite && showAuditModal && (
        <MicrositeAuditModal
          microsite={selectedMicrosite}
          onClose={() => setShowAuditModal(false)}
        />
      )}

      {selectedMicrosite && showNotificationModal && (
        <MicrositeNotificationModal
          microsite={selectedMicrosite}
          onClose={() => setShowNotificationModal(false)}
        />
      )}
    </div>
  )
}

export default MicrositesTable