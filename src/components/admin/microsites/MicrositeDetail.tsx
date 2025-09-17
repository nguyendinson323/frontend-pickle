import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { MicrositeAdmin } from '../../../types/admin'
import { getMicrositeDetails } from '../../../store/slices/adminMicrositesSlice'
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
  FiX,
  FiLoader,
  FiExternalLink,
  FiMail,
  FiPhone,
  FiUser,
  FiAlertTriangle,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi'

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
      <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl shadow-sm ${config.bg} ${config.text}`}>
        <IconComponent className="mr-2 h-4 w-4" />
        {config.label}
      </span>
    )
  }

  const getOwnerTypeBadge = (type: string) => {
    const typeConfig = {
      club: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Club Organization', icon: FiUsers },
      partner: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Business Partner', icon: FiUsers },
      state: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'State Committee', icon: FiGlobe }
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.club
    const IconComponent = config.icon
    return (
      <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl shadow-sm ${config.bg} ${config.text}`}>
        <IconComponent className="mr-2 h-4 w-4" />
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
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div className="relative mx-auto border border-gray-200 max-w-6xl shadow-2xl rounded-2xl bg-white w-full max-h-[90vh]">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-4 rounded-t-2xl">
            <h3 className="text-xl font-bold flex items-center">
              <FiLoader className="animate-spin mr-2 h-5 w-5" />
              Loading Microsite Details
            </h3>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <FiLoader className="animate-spin h-16 w-16 text-indigo-600 mx-auto mb-4" />
              <span className="text-lg font-semibold text-gray-700">Loading detailed information...</span>
              <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the microsite data</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const data = detailedMicrosite || microsite

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto border border-gray-200 max-w-6xl shadow-2xl rounded-2xl bg-white transform transition-all duration-300 max-h-[90vh] overflow-y-auto w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-3">
                <FiGlobe className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">Microsite Details</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors bg-white bg-opacity-20 rounded-xl p-2 hover:bg-opacity-30"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiGlobe className="mr-3 h-6 w-6 text-indigo-600" />
                  Basic Information
                </h4>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                      <FiFileText className="mr-2 h-4 w-4" />
                      Site Title
                    </label>
                    <p className="text-lg font-bold text-gray-900 bg-white p-3 rounded-xl border border-gray-200">{data.title}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                      <FiCheckCircle className="mr-2 h-4 w-4" />
                      Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(data.status)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                      <FiFileText className="mr-2 h-4 w-4" />
                      Description
                    </label>
                    <p className="text-gray-900 bg-white p-3 rounded-xl border border-gray-200 leading-relaxed">{data.description || 'No description provided'}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                        <FiGlobe className="mr-2 h-4 w-4" />
                        Subdomain
                      </label>
                      <p className="text-gray-900 bg-white p-3 rounded-xl border border-gray-200 font-medium">{data.subdomain || 'No subdomain'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                        <FiExternalLink className="mr-2 h-4 w-4" />
                        Site URL
                      </label>
                      <div className="bg-white p-3 rounded-xl border border-gray-200">
                        <a
                          href={data.subdomain ? `https://${data.subdomain}` : '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 break-all font-medium hover:underline"
                        >
                          <FiExternalLink className="mr-2 h-4 w-4" />
                          {data.subdomain ? `https://${data.subdomain}` : 'No URL assigned'}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                        <FiCalendar className="mr-2 h-4 w-4" />
                        Created Date
                      </label>
                      <p className="text-gray-900 bg-white p-3 rounded-xl border border-gray-200 font-medium">{new Date(data.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                        <FiActivity className="mr-2 h-4 w-4" />
                        Last Updated
                      </label>
                      <p className="text-gray-900 bg-white p-3 rounded-xl border border-gray-200 font-medium">{new Date(data.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                      <FiEye className="mr-2 h-4 w-4" />
                      Visibility Status
                    </label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl shadow-sm ${
                        data.visibility_status === 'public' ? 'bg-green-100 text-green-800' :
                        data.visibility_status === 'private' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        <FiEye className="mr-2 h-4 w-4" />
                        {data.visibility_status?.charAt(0).toUpperCase() + data.visibility_status?.slice(1)}
                      </span>
                    </div>
                  </div>

                  {data.rejection_reason && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                        <FiAlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                        Rejection Reason
                      </label>
                      <p className="text-red-700 bg-red-50 p-4 rounded-xl border-2 border-red-200 font-medium">{data.rejection_reason}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Owner Information */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiUsers className="mr-3 h-6 w-6 text-blue-600" />
                  Owner Information
                </h4>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                      <FiUser className="mr-2 h-4 w-4" />
                      Owner
                    </label>
                    <p className="text-gray-900 bg-white p-3 rounded-xl border border-gray-200 font-medium">{data.owner_name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                      <FiUsers className="mr-2 h-4 w-4" />
                      Type
                    </label>
                    <div className="mt-1">
                      {getOwnerTypeBadge(data.owner_type)}
                    </div>
                  </div>

                  {data.owner_contact && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                          <FiUser className="mr-2 h-4 w-4" />
                          Contact Person
                        </label>
                        <p className="text-gray-900 bg-white p-3 rounded-xl border border-gray-200 font-medium">{data.owner_contact.name}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <FiMail className="mr-2 h-4 w-4" />
                            Email
                          </label>
                          <p className="text-gray-900 bg-white p-3 rounded-xl border border-gray-200 font-medium break-all">{data.owner_contact.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <FiPhone className="mr-2 h-4 w-4" />
                            Phone
                          </label>
                          <p className="text-gray-900 bg-white p-3 rounded-xl border border-gray-200 font-medium">{data.owner_contact.phone}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Performance & Analytics */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiBarChart2 className="mr-3 h-6 w-6 text-green-600" />
                  Performance Scores
                </h4>

                <div className="space-y-6">
                  <div className={`p-6 rounded-2xl border-2 shadow-lg ${getScoreBg(data.content_score)} border-opacity-50`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FiFileText className="mr-3 h-5 w-5 text-gray-600" />
                        <span className="text-sm font-bold text-gray-700">Content Score</span>
                      </div>
                      <span className={`text-3xl font-bold ${getScoreColor(data.content_score)}`}>
                        {data.content_score}/100
                      </span>
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 shadow-lg ${getScoreBg(data.seo_score || 0)} border-opacity-50`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FiTrendingUp className="mr-3 h-5 w-5 text-gray-600" />
                        <span className="text-sm font-bold text-gray-700">SEO Score</span>
                      </div>
                      <span className={`text-3xl font-bold ${getScoreColor(data.seo_score || 0)}`}>
                        {data.seo_score || 0}/100
                      </span>
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 shadow-lg ${getScoreBg(data.performance_score || 0)} border-opacity-50`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FiActivity className="mr-3 h-5 w-5 text-gray-600" />
                        <span className="text-sm font-bold text-gray-700">Performance</span>
                      </div>
                      <span className={`text-3xl font-bold ${getScoreColor(data.performance_score || 0)}`}>
                        {data.performance_score || 0}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiBarChart2 className="mr-3 h-6 w-6 text-purple-600" />
                  Analytics
                </h4>

                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 text-center shadow-lg border-2 border-blue-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                      <FiEye className="h-6 w-6" />
                    </div>
                    <div className="text-4xl font-bold text-blue-600 mb-2">{data.page_views.toLocaleString()}</div>
                    <div className="text-sm font-semibold text-gray-600">Total Page Views</div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 text-center shadow-lg border-2 border-green-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                      <FiUsers className="h-6 w-6" />
                    </div>
                    <div className="text-4xl font-bold text-green-600 mb-2">{data.monthly_visitors.toLocaleString()}</div>
                    <div className="text-sm font-semibold text-gray-600">Monthly Visitors</div>
                  </div>
                </div>
              </div>

              {/* Content Status */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiFileText className="mr-3 h-6 w-6 text-orange-600" />
                  Content Status
                </h4>

                <div className="space-y-6">
                  <div>
                    <div className={`inline-flex items-center px-4 py-3 text-sm font-bold rounded-xl shadow-lg ${
                      data.has_inappropriate_content ? 'bg-red-100 text-red-800 border-2 border-red-200' : 'bg-green-100 text-green-800 border-2 border-green-200'
                    }`}>
                      {data.has_inappropriate_content ? (
                        <>
                          <FiAlertTriangle className="mr-2 h-4 w-4" />
                          Flagged Content
                        </>
                      ) : (
                        <>
                          <FiCheckCircle className="mr-2 h-4 w-4" />
                          Clean Content
                        </>
                      )}
                    </div>
                  </div>

                  {data.content_warnings && data.content_warnings.length > 0 && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                        <FiAlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                        Content Warnings
                      </label>
                      <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200">
                        <ul className="text-sm text-red-700 space-y-2">
                          {data.content_warnings.map((warning: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <FiAlertTriangle className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                              {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {data.last_audit_date && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                        <FiCalendar className="mr-2 h-4 w-4" />
                        Last Audit
                      </label>
                      <p className="text-gray-900 bg-white p-3 rounded-xl border border-gray-200 font-medium">{new Date(data.last_audit_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="flex justify-end mt-8 pt-6 border-t-2 border-gray-200">
            <button
              onClick={onClose}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiX className="mr-2 h-4 w-4" />
              Close Details
            </button>
          </div>
        </div>
      </div>
  )
}

export default MicrositeDetail