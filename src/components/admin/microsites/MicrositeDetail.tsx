import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { MicrositeAdmin } from '../../../types/admin'
import { getMicrositeDetails } from '../../../store/slices/adminMicrositesSlice'

interface MicrositeDetailProps {
  microsite: MicrositeAdmin
  onClose: () => void
}

const MicrositeDetail: React.FC<MicrositeDetailProps> = ({ microsite, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [detailedMicrosite, setDetailedMicrosite] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await dispatch(getMicrositeDetails(microsite.id))
        setDetailedMicrosite(result)
      } catch (error) {
        console.error('Failed to fetch microsite details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [dispatch, microsite.id])

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
      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getOwnerTypeBadge = (type: string) => {
    const typeConfig = {
      club: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Club Organization', icon: '🏸' },
      partner: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Business Partner', icon: '🤝' },
      state: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'State Committee', icon: '🏛️' }
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.club
    return (
      <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${config.bg} ${config.text}`}>
        <span className="mr-2">{config.icon}</span>
        {config.label}
      </span>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading details...</span>
          </div>
        </div>
      </div>
    )
  }

  const data = detailedMicrosite || microsite

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Microsite Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className=" rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Site Title</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{data.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(data.status)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-gray-900">{data.description || 'No description provided'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subdomain</label>
                    <p className="mt-1 text-gray-900">{data.subdomain || 'No subdomain'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Site URL</label>
                    <a 
                      href={data.subdomain ? `https://${data.subdomain}` : '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-1 text-indigo-600 hover:text-indigo-900 break-all"
                    >
                      {data.subdomain ? `https://${data.subdomain}` : 'No URL assigned'}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created Date</label>
                    <p className="mt-1 text-gray-900">{new Date(data.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="mt-1 text-gray-900">{new Date(data.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Visibility Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      data.visibility_status === 'public' ? 'bg-green-100 text-green-800' :
                      data.visibility_status === 'private' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {data.visibility_status}
                    </span>
                  </div>
                </div>

                {data.rejection_reason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                    <p className="mt-1 text-red-600 bg-red-50 p-3 rounded">{data.rejection_reason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Owner Information */}
            <div className=" rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Owner</label>
                  <p className="mt-1 text-gray-900">{data.owner_name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <div className="mt-1">
                    {getOwnerTypeBadge(data.owner_type)}
                  </div>
                </div>

                {data.owner_contact && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                      <p className="mt-1 text-gray-900">{data.owner_contact.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-gray-900">{data.owner_contact.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-gray-900">{data.owner_contact.phone}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Performance & Analytics */}
          <div className="space-y-6">
            <div className=" rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Scores</h4>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${getScoreBg(data.content_score)}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Content Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor(data.content_score)}`}>
                      {data.content_score}/100
                    </span>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${getScoreBg(data.seo_score || 0)}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">SEO Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor(data.seo_score || 0)}`}>
                      {data.seo_score || 0}/100
                    </span>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${getScoreBg(data.performance_score || 0)}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Performance</span>
                    <span className={`text-2xl font-bold ${getScoreColor(data.performance_score || 0)}`}>
                      {data.performance_score || 0}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className=" rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h4>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">{data.page_views.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Page Views</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{data.monthly_visitors.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Monthly Visitors</div>
                </div>
              </div>
            </div>

            {/* Content Status */}
            <div className=" rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Status</h4>
              
              <div className="space-y-4">
                <div>
                  <div className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                    data.has_inappropriate_content ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {data.has_inappropriate_content ? '⚠️ Flagged Content' : '✅ Clean Content'}
                  </div>
                </div>

                {data.content_warnings && data.content_warnings.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content Warnings</label>
                    <ul className="text-sm text-red-600 space-y-1">
                      {data.content_warnings.map((warning: string, index: number) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.last_audit_date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Audit</label>
                    <p className="mt-1 text-gray-900">{new Date(data.last_audit_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default MicrositeDetail