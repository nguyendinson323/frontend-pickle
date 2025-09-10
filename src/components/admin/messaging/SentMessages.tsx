import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { 
  resendFailedMessage,
  getMessageDeliveryReport
} from '../../../store/slices/adminMessagingSlice'

const SentMessages: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { sentMessages, loading } = useSelector((state: RootState) => state.adminMessaging)
  
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showDeliveryReport, setShowDeliveryReport] = useState(false)
  const [deliveryReport, setDeliveryReport] = useState(null)

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
      const report = await dispatch(getMessageDeliveryReport(messageId))
      setDeliveryReport(report)
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Sent Messages</h3>
        </div>

        {sentMessages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages have been sent yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sentMessages.map((message) => (
                  <tr key={message.id} className="hover:">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {message.subject}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {message.body.substring(0, 100)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatRecipients(message.recipients)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {message.recipient_count} recipients
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="text-green-600">
                          ✓ {message.delivery_stats.delivered} delivered
                        </div>
                        {message.delivery_stats.failed > 0 && (
                          <div className="text-red-600">
                            ✗ {message.delivery_stats.failed} failed
                          </div>
                        )}
                        {message.delivery_stats.pending > 0 && (
                          <div className="text-yellow-600">
                            ⏳ {message.delivery_stats.pending} pending
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{new Date(message.sent_at).toLocaleDateString()}</div>
                      <div>{new Date(message.sent_at).toLocaleTimeString()}</div>
                      <div className="text-xs">by {message.sent_by}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-y-1">
                      <button
                        onClick={() => handleViewDeliveryReport(message.id)}
                        className="text-indigo-600 hover:text-indigo-900 block transition-colors"
                      >
                        View Report
                      </button>
                      {message.delivery_stats.failed > 0 && (
                        <button
                          onClick={() => handleResendFailed(message.id)}
                          className="text-orange-600 hover:text-orange-900 block transition-colors"
                        >
                          Resend Failed
                        </button>
                      )}
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Delivery Report</h3>
                <button
                  onClick={() => setShowDeliveryReport(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {deliveryReport.totalRecipients}
                    </div>
                    <div className="text-sm text-blue-800">Total Recipients</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {deliveryReport.deliveryStats.delivered}
                    </div>
                    <div className="text-sm text-green-800">Delivered</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {deliveryReport.deliveryStats.failed}
                    </div>
                    <div className="text-sm text-red-800">Failed</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {deliveryReport.deliveryStats.pending}
                    </div>
                    <div className="text-sm text-yellow-800">Pending</div>
                  </div>
                </div>

                {/* Delivery Breakdown */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Delivery Breakdown by Method</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Email</h5>
                      <div className="space-y-1 text-sm">
                        <div className="text-green-600">✓ {deliveryReport.deliveryBreakdown.email.delivered} delivered</div>
                        <div className="text-red-600">✗ {deliveryReport.deliveryBreakdown.email.failed} failed</div>
                        <div className="text-yellow-600">⏳ {deliveryReport.deliveryBreakdown.email.pending} pending</div>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">SMS</h5>
                      <div className="space-y-1 text-sm">
                        <div className="text-green-600">✓ {deliveryReport.deliveryBreakdown.sms.delivered} delivered</div>
                        <div className="text-red-600">✗ {deliveryReport.deliveryBreakdown.sms.failed} failed</div>
                        <div className="text-yellow-600">⏳ {deliveryReport.deliveryBreakdown.sms.pending} pending</div>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">In-App</h5>
                      <div className="space-y-1 text-sm">
                        <div className="text-green-600">✓ {deliveryReport.deliveryBreakdown.inApp.delivered} delivered</div>
                        <div className="text-red-600">✗ {deliveryReport.deliveryBreakdown.inApp.failed} failed</div>
                        <div className="text-yellow-600">⏳ {deliveryReport.deliveryBreakdown.inApp.pending} pending</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Failure Reasons */}
                {deliveryReport.failureReasons.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Failure Reasons</h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
                      <table className="min-w-full">
                        <thead className="bg-red-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                              Reason
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                              Count
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-red-200">
                          {deliveryReport.failureReasons.map((failure, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm text-red-900">{failure.reason}</td>
                              <td className="px-4 py-3 text-sm text-red-900">{failure.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDeliveryReport(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Close
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