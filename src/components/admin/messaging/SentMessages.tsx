import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import {
  resendFailedMessage,
  getMessageDeliveryReport
} from '../../../store/slices/adminMessagingSlice'
import {
  FiSend,
  FiEye,
  FiRefreshCw,
  FiX,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiMail,
  FiSmartphone,
  FiBell,
  FiCalendar,
  FiUsers,
  FiAlertTriangle,
  FiBarChart
} from 'react-icons/fi'

const SentMessages: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { sentMessages, loading } = useSelector((state: RootState) => state.adminMessaging)
  
  const [showDeliveryReport, setShowDeliveryReport] = useState(false)
  const [deliveryReport, setDeliveryReport] = useState<any>(null)

  const handleResendFailed = async (messageId: number) => {
    const confirmed = window.confirm('Are you sure you want to resend failed messages?')
    if (confirmed) {
      try {
        await dispatch(resendFailedMessage(messageId))
        alert('Failed messages have been queued for resending')
      } catch (error) {
        console.error('Failed to resend message:', error)
      }
    }
  }

  const handleViewDeliveryReport = async (messageId: number) => {
    try {
      const report = await dispatch(getMessageDeliveryReport(messageId)) as any
      setDeliveryReport(report.payload || report)
      setShowDeliveryReport(true)
    } catch (error) {
      console.error('Failed to get delivery report:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatRecipients = (recipients: string[]) => {
    return recipients.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')
  }

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-center p-16">
          <div className="text-center">
            <FiLoader className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700">Loading sent messages...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your message history</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
              <FiSend className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Sent Messages</h3>
          </div>
        </div>

        {sentMessages.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSend className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages sent</h3>
            <p className="text-gray-500 mb-4">Your sent messages will appear here once you start broadcasting.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiMail className="mr-2 h-4 w-4" />
                      Message
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiUsers className="mr-2 h-4 w-4" />
                      Recipients
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
                      <FiBarChart className="mr-2 h-4 w-4" />
                      Delivery Stats
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 h-4 w-4" />
                      Sent At
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sentMessages.map((message) => (
                  <tr key={message.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200">
                    <td className="px-6 py-6">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mr-3 flex-shrink-0">
                          <FiMail className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                            {message.subject}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {message.body.substring(0, 120)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center">
                        <FiUsers className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatRecipients(message.recipients)}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                              {message.recipient_count} recipients
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`inline-flex items-center px-3 py-2 text-xs font-bold rounded-xl shadow-sm ${getStatusColor(message.status)}`}>
                        {message.status === 'sent' && <FiCheckCircle className="mr-1 h-3 w-3" />}
                        {message.status === 'failed' && <FiXCircle className="mr-1 h-3 w-3" />}
                        {message.status === 'pending' && <FiClock className="mr-1 h-3 w-3" />}
                        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-green-700 font-medium">{message.delivery_stats.delivered} delivered</span>
                        </div>
                        {message.delivery_stats.failed > 0 && (
                          <div className="flex items-center text-sm">
                            <FiXCircle className="h-4 w-4 text-red-500 mr-2" />
                            <span className="text-red-700 font-medium">{message.delivery_stats.failed} failed</span>
                          </div>
                        )}
                        {message.delivery_stats.pending > 0 && (
                          <div className="flex items-center text-sm">
                            <FiClock className="h-4 w-4 text-yellow-500 mr-2" />
                            <span className="text-yellow-700 font-medium">{message.delivery_stats.pending} pending</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center">
                        <FiCalendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{new Date(message.sent_at).toLocaleDateString()}</div>
                          <div className="text-gray-500">{new Date(message.sent_at).toLocaleTimeString()}</div>
                          <div className="text-xs text-gray-400 mt-1">by {message.sent_by}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleViewDeliveryReport(message.id)}
                          className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-medium rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          <FiEye className="mr-1 h-3 w-3" />
                          View Report
                        </button>
                        {message.delivery_stats.failed > 0 && (
                          <button
                            onClick={() => handleResendFailed(message.id)}
                            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                          >
                            <FiRefreshCw className="mr-1 h-3 w-3" />
                            Resend Failed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delivery Report Modal */}
      {showDeliveryReport && deliveryReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto border border-gray-200 max-w-6xl shadow-2xl rounded-2xl bg-white transform transition-all duration-300 max-h-[90vh] overflow-y-auto w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-3">
                    <FiBarChart className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold">Delivery Report</h3>
                </div>
                <button
                  onClick={() => setShowDeliveryReport(false)}
                  className="text-white hover:text-gray-300 transition-colors bg-white bg-opacity-20 rounded-xl p-2 hover:bg-opacity-30"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-8">
                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-200 shadow-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3">
                      <FiUsers className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold text-blue-700 mb-2">
                      {deliveryReport.totalRecipients}
                    </div>
                    <div className="text-sm font-semibold text-blue-800">Total Recipients</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-200 shadow-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3">
                      <FiCheckCircle className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold text-green-700 mb-2">
                      {deliveryReport.deliveryStats.delivered}
                    </div>
                    <div className="text-sm font-semibold text-green-800">Delivered</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-200 shadow-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3">
                      <FiXCircle className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold text-red-700 mb-2">
                      {deliveryReport.deliveryStats.failed}
                    </div>
                    <div className="text-sm font-semibold text-red-800">Failed</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-200 shadow-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3">
                      <FiClock className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold text-yellow-700 mb-2">
                      {deliveryReport.deliveryStats.pending}
                    </div>
                    <div className="text-sm font-semibold text-yellow-800">Pending</div>
                  </div>
                </div>

                {/* Delivery Breakdown */}
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FiBarChart className="mr-2 h-5 w-5" />
                    Delivery Breakdown by Method
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
                          <FiMail className="h-5 w-5" />
                        </div>
                        <h5 className="text-lg font-bold text-gray-900">Email</h5>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-green-700 font-semibold">{deliveryReport.deliveryBreakdown.email.delivered} delivered</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <FiXCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-red-700 font-semibold">{deliveryReport.deliveryBreakdown.email.failed} failed</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <FiClock className="h-4 w-4 text-yellow-500 mr-2" />
                          <span className="text-yellow-700 font-semibold">{deliveryReport.deliveryBreakdown.email.pending} pending</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-3">
                          <FiSmartphone className="h-5 w-5" />
                        </div>
                        <h5 className="text-lg font-bold text-gray-900">SMS</h5>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-green-700 font-semibold">{deliveryReport.deliveryBreakdown.sms.delivered} delivered</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <FiXCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-red-700 font-semibold">{deliveryReport.deliveryBreakdown.sms.failed} failed</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <FiClock className="h-4 w-4 text-yellow-500 mr-2" />
                          <span className="text-yellow-700 font-semibold">{deliveryReport.deliveryBreakdown.sms.pending} pending</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white mr-3">
                          <FiBell className="h-5 w-5" />
                        </div>
                        <h5 className="text-lg font-bold text-gray-900">In-App</h5>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-green-700 font-semibold">{deliveryReport.deliveryBreakdown.inApp.delivered} delivered</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <FiXCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-red-700 font-semibold">{deliveryReport.deliveryBreakdown.inApp.failed} failed</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <FiClock className="h-4 w-4 text-yellow-500 mr-2" />
                          <span className="text-yellow-700 font-semibold">{deliveryReport.deliveryBreakdown.inApp.pending} pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Failure Reasons */}
                {deliveryReport.failureReasons.length > 0 && (
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <FiAlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                      Failure Reasons
                    </h4>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl overflow-hidden shadow-lg">
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-gradient-to-r from-red-100 to-red-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-bold text-red-800 uppercase tracking-wider">
                                <div className="flex items-center">
                                  <FiAlertTriangle className="mr-2 h-4 w-4" />
                                  Reason
                                </div>
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-red-800 uppercase tracking-wider">
                                Count
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-red-200">
                            {deliveryReport.failureReasons.map((failure: any, index: number) => (
                              <tr key={index} className="hover:bg-red-100 transition-colors duration-200">
                                <td className="px-6 py-4 text-sm font-medium text-red-900">{failure.reason}</td>
                                <td className="px-6 py-4 text-sm font-bold text-red-900">
                                  <span className="bg-red-200 px-3 py-1 rounded-full">{failure.count}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-8 pt-6 border-t-2 border-gray-200">
                <button
                  onClick={() => setShowDeliveryReport(false)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Close Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SentMessages