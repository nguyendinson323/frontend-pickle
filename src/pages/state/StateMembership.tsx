import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchStateMembershipData,
  fetchAffiliationRequirements,
  renewStateAffiliation,
  submitComplianceReport,
  clearError
} from '../../store/slices/stateMembershipSlice'

const StateMembership: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    stateCommittee,
    affiliationStatus,
    stateStatistics,
    paymentHistory,
    recentActivities,
    complianceStatus,
    affiliationRequirements,
    loading,
    error
  } = useSelector((state: RootState) => state.stateMembership)

  const [activeTab, setActiveTab] = useState<'overview' | 'benefits' | 'governance'>('overview')
  const [showRenewalModal, setShowRenewalModal] = useState(false)

  useEffect(() => {
    dispatch(fetchStateMembershipData())
    dispatch(fetchAffiliationRequirements())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const handleRenewalAffiliation = async () => {
    try {
      await dispatch(renewStateAffiliation({
        payment_method: 'credit_card'
      }))
      setShowRenewalModal(false)
    } catch (error) {
      console.error('Affiliation renewal failed:', error)
    }
  }

  const handleSubmitReport = async (reportType: string) => {
    try {
      await dispatch(submitComplianceReport(reportType, {
        submitted_by: stateCommittee?.president_name,
        submission_date: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Report submission failed:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount)
  }

  const getComplianceColor = (completed: boolean) => {
    return completed ? 'text-green-600' : 'text-yellow-600'
  }

  const getComplianceIcon = (completed: boolean) => {
    return completed
      ? 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
      : 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">State Association Membership</h1>
        <p className="text-blue-100">Manage your state pickleball association effectively</p>
        {stateCommittee && (
          <p className="text-blue-100 mt-2">
            {stateCommittee.name} • {stateCommittee.president_name}
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {(['overview', 'benefits', 'governance'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Association Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Status</p>
                <p className={`text-lg font-semibold ${
                  affiliationStatus?.isActive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {affiliationStatus?.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-lg font-semibold">
                  {affiliationStatus?.memberSince ? new Date(affiliationStatus.memberSince).getFullYear() : 'N/A'}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Days Remaining</p>
                <p className="text-lg font-semibold">
                  {affiliationStatus?.daysRemaining || 0}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Next Renewal</p>
                <p className="text-lg font-semibold">
                  {affiliationStatus?.expiresAt ? formatDate(affiliationStatus.expiresAt) : 'N/A'}
                </p>
              </div>
            </div>
            {affiliationStatus && !affiliationStatus.isActive && (
              <div className="mt-4">
                <button
                  onClick={() => setShowRenewalModal(true)}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Renew Affiliation
                </button>
              </div>
            )}
          </div>

          {/* State Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">State Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">
                  {stateStatistics?.registeredPlayers?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-gray-600">Registered Players</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {stateStatistics?.affiliatedClubs || '0'}
                </p>
                <p className="text-sm text-gray-600">Affiliated Clubs</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">
                  {stateStatistics?.annualTournaments || '0'}
                </p>
                <p className="text-sm text-gray-600">Annual Tournaments</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-3xl font-bold text-orange-600">
                  {stateStatistics?.certifiedCoaches || '0'}
                </p>
                <p className="text-sm text-gray-600">Certified Coaches</p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id + index } className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(activity.start_date)} - Status: {activity.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent activities found.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'benefits' && (
        <div className="space-y-6">
          {/* Annual Fee Information */}
          {affiliationRequirements && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Annual Affiliation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Annual Fee</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(affiliationRequirements.annualFee)}
                  </p>
                  <p className="text-sm text-gray-500">{affiliationRequirements.paymentSchedule}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Current Status</p>
                  <p className={`text-lg font-semibold ${
                    affiliationStatus?.isActive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {affiliationStatus?.isActive ? 'Active' : 'Expired'}
                  </p>
                  {affiliationStatus?.expiresAt && (
                    <p className="text-sm text-gray-500">
                      Expires: {formatDate(affiliationStatus.expiresAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Benefits */}
          {affiliationRequirements && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Federation Benefits</h2>
              <div className="space-y-3">
                {affiliationRequirements.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support Services */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Federation Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Technical Support</h3>
                <p className="text-sm text-gray-600">24/7 platform support and training resources</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Compliance Assistance</h3>
                <p className="text-sm text-gray-600">Help meeting national federation standards</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Growth Programs</h3>
                <p className="text-sm text-gray-600">Resources to expand pickleball in your state</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'governance' && (
        <div className="space-y-6">
          {/* Compliance Status */}
          {complianceStatus && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Compliance Requirements</h2>
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-3 ${complianceStatus.annualReport.completed ? 'bg-green-50' : 'bg-yellow-50'} rounded-lg`}>
                  <div className="flex items-center space-x-3">
                    <svg className={`w-5 h-5 ${getComplianceColor(complianceStatus.annualReport.completed)}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d={getComplianceIcon(complianceStatus.annualReport.completed)} clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Annual Report</span>
                  </div>
                  <span className={`text-sm ${getComplianceColor(complianceStatus.annualReport.completed)}`}>
                    {complianceStatus.annualReport.completed
                      ? `Completed ${formatDate(complianceStatus.annualReport.completedDate)}`
                      : `Due ${formatDate(complianceStatus.annualReport.dueDate)}`}
                  </span>
                </div>

                <div className={`flex items-center justify-between p-3 ${complianceStatus.insurance.valid ? 'bg-green-50' : 'bg-yellow-50'} rounded-lg`}>
                  <div className="flex items-center space-x-3">
                    <svg className={`w-5 h-5 ${getComplianceColor(complianceStatus.insurance.valid)}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d={getComplianceIcon(complianceStatus.insurance.valid)} clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Insurance Documentation</span>
                  </div>
                  <span className={`text-sm ${getComplianceColor(complianceStatus.insurance.valid)}`}>
                    {complianceStatus.insurance.valid
                      ? `Valid until ${formatDate(complianceStatus.insurance.validUntil)}`
                      : 'Expired'}
                  </span>
                </div>

                <div className={`flex items-center justify-between p-3 ${complianceStatus.boardElections.completed ? 'bg-green-50' : 'bg-yellow-50'} rounded-lg`}>
                  <div className="flex items-center space-x-3">
                    <svg className={`w-5 h-5 ${getComplianceColor(complianceStatus.boardElections.completed)}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d={getComplianceIcon(complianceStatus.boardElections.completed)} clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Board Elections</span>
                  </div>
                  <span className={`text-sm ${getComplianceColor(complianceStatus.boardElections.completed)}`}>
                    {complianceStatus.boardElections.completed
                      ? `Completed ${formatDate(complianceStatus.boardElections.completedDate)}`
                      : `Next due ${formatDate(complianceStatus.boardElections.nextDue)}`}
                  </span>
                </div>

                <div className={`flex items-center justify-between p-3 ${complianceStatus.quarterlyReview.completed ? 'bg-green-50' : 'bg-yellow-50'} rounded-lg`}>
                  <div className="flex items-center space-x-3">
                    <svg className={`w-5 h-5 ${getComplianceColor(complianceStatus.quarterlyReview.completed)}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d={getComplianceIcon(complianceStatus.quarterlyReview.completed)} clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Quarterly Financial Review</span>
                  </div>
                  <span className={`text-sm ${getComplianceColor(complianceStatus.quarterlyReview.completed)}`}>
                    {complianceStatus.quarterlyReview.completed
                      ? 'Completed'
                      : `Due by ${formatDate(complianceStatus.quarterlyReview.dueDate)}`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleSubmitReport('quarterly')}
                disabled={loading}
                className="text-left p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Submit Report</p>
                    <p className="text-sm text-gray-500">File quarterly or annual reports</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {!affiliationStatus?.isActive && (
                <button
                  onClick={() => setShowRenewalModal(true)}
                  disabled={loading}
                  className="text-left p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Renew Affiliation</p>
                      <p className="text-sm text-gray-500">Renew state association membership</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Payment History */}
          {paymentHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Payment History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.slice(0, 5).map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(payment.transaction_date || payment.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {payment.payment_type === 'affiliation' ? 'Annual Affiliation Fee' : payment.payment_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Renewal Modal */}
      {showRenewalModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Renew State Affiliation</h3>
            <p className="text-gray-600 mb-4">
              Annual affiliation fee: {affiliationRequirements ? formatCurrency(affiliationRequirements.annualFee) : '$2,500.00'}
            </p>
            <p className="text-gray-600 mb-6">
              This will extend your state association membership for one year.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRenewalModal(false)}
                className="px-4 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRenewalAffiliation}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Renew Affiliation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StateMembership