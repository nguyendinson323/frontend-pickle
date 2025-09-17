import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { MicrositeAdmin } from '../../../types/admin'
import { exportMicrosites } from '../../../store/slices/adminMicrositesSlice'
import MicrositeStatusModal from './MicrositeStatusModal'
import MicrositeAnalyticsModal from './MicrositeAnalyticsModal'
import MicrositeAuditModal from './MicrositeAuditModal'
import MicrositeNotificationModal from './MicrositeNotificationModal'
import {
  FiGlobe,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiFileText,
  FiBarChart2,
  FiCalendar,
  FiMoreVertical,
  FiDownload,
  FiExternalLink,
  FiSettings,
  FiBell,
  FiSearch,
  FiLoader,
  FiChevronDown
} from 'react-icons/fi'

interface MicrositesTableProps {
  onMicrositeSelect: (microsite: MicrositeAdmin) => void
}

const MicrositesTable: React.FC<MicrositesTableProps> = ({ onMicrositeSelect }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { microsites, micrositeFilter, loading } = useSelector((state: RootState) => state.adminMicrosites)
  const [selectedMicrosite, setSelectedMicrosite] = useState<MicrositeAdmin | null>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active', icon: FiCheckCircle },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive', icon: FiXCircle },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', label: 'Suspended', icon: FiXCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending', icon: FiClock },
      approved: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Approved', icon: FiCheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected', icon: FiXCircle }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const IconComponent = config.icon
    return (
      <span className={`inline-flex items-center px-3 py-2 text-xs font-bold rounded-xl shadow-sm ${config.bg} ${config.text}`}>
        <IconComponent className="mr-1 h-3 w-3" />
        {config.label}
      </span>
    )
  }

  const getOwnerTypeBadge = (type: string) => {
    const typeConfig = {
      club: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Club', icon: FiUsers },
      partner: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Partner', icon: FiUsers },
      state: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'State', icon: FiGlobe }
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.club
    const IconComponent = config.icon
    return (
      <span className={`inline-flex items-center px-3 py-2 text-xs font-bold rounded-xl shadow-sm ${config.bg} ${config.text}`}>
        <IconComponent className="mr-1 h-3 w-3" />
        {config.label}
      </span>
    )
  }

  const getVisibilityBadge = (visibility: string) => {
    const visibilityConfig = {
      public: { bg: 'bg-green-100', text: 'text-green-800', label: 'Public', icon: FiEye },
      private: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Private', icon: FiEye },
      restricted: { bg: 'bg-red-100', text: 'text-red-800', label: 'Restricted', icon: FiEye }
    }
    const config = visibilityConfig[visibility as keyof typeof visibilityConfig] || visibilityConfig.public
    const IconComponent = config.icon
    return (
      <span className={`inline-flex items-center px-3 py-2 text-xs font-bold rounded-xl shadow-sm ${config.bg} ${config.text}`}>
        <IconComponent className="mr-1 h-3 w-3" />
        {config.label}
      </span>
    )
  }

  const getContentStatus = (microsite: MicrositeAdmin) => {
    if (microsite.has_inappropriate_content) {
      return (
        <span className="inline-flex items-center px-3 py-2 text-xs font-bold rounded-xl shadow-sm bg-red-100 text-red-800">
          <FiXCircle className="mr-1 h-3 w-3" />
          Flagged
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-3 py-2 text-xs font-bold rounded-xl shadow-sm bg-green-100 text-green-800">
        <FiCheckCircle className="mr-1 h-3 w-3" />
        Clean
      </span>
    )
  }

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    dispatch(exportMicrosites(micrositeFilter, format))
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
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FiLoader className="animate-spin mr-2 h-5 w-5" />
            Loading Microsites...
          </h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-8 gap-6">
                  <div className="h-6 bg-gray-200 rounded-xl"></div>
                  <div className="h-6 bg-gray-200 rounded-xl"></div>
                  <div className="h-6 bg-gray-200 rounded-xl"></div>
                  <div className="h-6 bg-gray-200 rounded-xl"></div>
                  <div className="h-6 bg-gray-200 rounded-xl"></div>
                  <div className="h-6 bg-gray-200 rounded-xl"></div>
                  <div className="h-6 bg-gray-200 rounded-xl"></div>
                  <div className="h-6 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
              <FiGlobe className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Microsites ({microsites.length})
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                onChange={(e) => handleExport(e.target.value as 'csv' | 'excel' | 'pdf')}
                className="inline-flex items-center pl-10 pr-4 py-2 border-2 border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 transform hover:scale-105 appearance-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Export Data</option>
                <option value="csv">📄 Export as CSV</option>
                <option value="excel">📊 Export as Excel</option>
                <option value="pdf">📋 Export as PDF</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDownload className="h-4 w-4 text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiGlobe className="mr-2 h-4 w-4" />
                  Site Details
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiUsers className="mr-2 h-4 w-4" />
                  Owner
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiCheckCircle className="mr-2 h-4 w-4" />
                  Status
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiEye className="mr-2 h-4 w-4" />
                  Visibility
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiFileText className="mr-2 h-4 w-4" />
                  Content
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiBarChart2 className="mr-2 h-4 w-4" />
                  Performance
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiCalendar className="mr-2 h-4 w-4" />
                  Last Updated
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {microsites.map((microsite) => (
              <tr key={microsite.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mr-3 flex-shrink-0">
                      <FiGlobe className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-900 mb-1">{microsite.title}</div>
                      <div className="text-xs text-gray-500 mb-2">{microsite.subdomain || 'No subdomain'}</div>
                      <a
                        href={microsite.subdomain ? `https://${microsite.subdomain}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-900 font-medium hover:underline"
                      >
                        <FiExternalLink className="mr-1 h-3 w-3" />
                        Visit Site
                      </a>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiUsers className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{microsite.owner_name}</div>
                      <div className="mt-1">{getOwnerTypeBadge(microsite.owner_type)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  {getStatusBadge(microsite.status)}
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  {getVisibilityBadge(microsite.visibility_status)}
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="space-y-2">
                    {getContentStatus(microsite)}
                    <div className="flex items-center">
                      <FiBarChart2 className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500 font-medium">
                        Score: {microsite.content_score}/100
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <FiEye className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium">{microsite.page_views.toLocaleString()}</span>
                      <span className="text-xs text-gray-500 ml-1">views</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiUsers className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium">{microsite.monthly_visitors.toLocaleString()}</span>
                      <span className="text-xs ml-1">/mo</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium">{new Date(microsite.updated_at).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onMicrositeSelect(microsite)}
                      className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-medium rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                      title="View Details"
                    >
                      <FiEye className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(microsite)}
                      className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                      title="Change Status"
                    >
                      <FiSettings className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleAnalytics(microsite)}
                      className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                      title="View Analytics"
                    >
                      <FiBarChart2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleAudit(microsite)}
                      className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                      title="Audit Site"
                    >
                      <FiSearch className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleNotification(microsite)}
                      className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-medium rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                      title="Send Notification"
                    >
                      <FiBell className="h-3 w-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {microsites.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiGlobe className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No microsites found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters.</p>
            <div className="flex items-center justify-center">
              <FiSearch className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">Use the filters above to refine your search</span>
            </div>
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