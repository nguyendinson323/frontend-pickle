import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../store'
import { fetchStateMembershipData, renewStateAffiliation, fetchAffiliationRequirements } from '../../../../store/slices/stateMembershipSlice'

export const StateMembershipTab: React.FC = () => {
  const navigate = useNavigate()
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

  const [showRenewalModal, setShowRenewalModal] = useState(false)

  useEffect(() => {
    dispatch(fetchStateMembershipData())
    dispatch(fetchAffiliationRequirements())
  }, [dispatch])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }


  const handleRenewalClick = async () => {
    if (affiliationStatus?.isActive) {
      setShowRenewalModal(true)
    } else {
      navigate('/state/membership/renew')
    }
  }

  const handleRenewalConfirm = async () => {
    try {
      await dispatch(renewStateAffiliation({ payment_method: 'credit_card' }))
      setShowRenewalModal(false)
    } catch (error) {
      console.error('Renewal failed:', error)
    }
  }

  const getStatusColor = (isActive: boolean, daysRemaining: number) => {
    if (!isActive) return 'bg-red-100 text-red-800'
    if (daysRemaining < 30) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (isActive: boolean, daysRemaining: number) => {
    if (!isActive) return 'EXPIRED'
    if (daysRemaining < 30) return 'EXPIRING SOON'
    return 'ACTIVE'
  }

  if (loading && !stateCommittee) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Membership & Affiliation</h3>
          <p className="text-sm text-gray-600">Manage your federation membership and affiliation status</p>
        </div>
        <div className="flex space-x-3">
          {affiliationStatus && !affiliationStatus.isActive || (affiliationStatus?.daysRemaining && affiliationStatus.daysRemaining < 60) ? (
            <button
              onClick={handleRenewalClick}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Renew Membership
            </button>
          ) : null}
          <button
            onClick={() => navigate('/state/membership')}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Membership Details
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Membership Status Overview */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-semibold mb-2">Affiliation Status</h4>
            <div className="flex items-center space-x-4">
              {affiliationStatus && (
                <>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white ${
                    getStatusColor(affiliationStatus.isActive, affiliationStatus.daysRemaining).includes('red') ? 'text-red-800' :
                    getStatusColor(affiliationStatus.isActive, affiliationStatus.daysRemaining).includes('yellow') ? 'text-yellow-800' : 'text-green-800'
                  }`}>
                    {getStatusText(affiliationStatus.isActive, affiliationStatus.daysRemaining)}
                  </span>
                  <span className="text-blue-100">
                    Expires: {formatDate(affiliationStatus.expiresAt)}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {stateCommittee?.name || 'State Committee'}
            </div>
            <p className="text-blue-100 text-sm">USA Pickleball Affiliate</p>
          </div>
        </div>
      </div>

      {/* Membership Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Committee Information</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Committee Name</label>
              <p className="text-gray-900">{stateCommittee?.name || 'Not assigned'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">President</label>
              <p className="text-gray-900">{stateCommittee?.president_name || 'Not assigned'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Established</label>
              <p className="text-gray-900">
                {stateCommittee?.created_at ? formatDate(stateCommittee.created_at) : 'Not available'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Annual Fee</label>
              <p className="text-gray-900 font-semibold">
                {affiliationStatus?.annualFee ? formatCurrency(affiliationStatus.annualFee) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">State Statistics</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Registered Players</label>
              <p className="text-gray-900">{stateStatistics?.registeredPlayers || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Affiliated Clubs</label>
              <p className="text-gray-900">{stateStatistics?.affiliatedClubs || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Certified Coaches</label>
              <p className="text-gray-900">{stateStatistics?.certifiedCoaches || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Annual Tournaments</label>
              <p className="text-gray-900">{stateStatistics?.annualTournaments || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Affiliation Details</h4>
          <div className="space-y-3">
            {affiliationStatus && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Days Until Expiry</label>
                  <p className={`text-lg font-bold ${
                    affiliationStatus.daysRemaining < 30 ? 'text-red-600' :
                    affiliationStatus.daysRemaining < 60 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {affiliationStatus.daysRemaining} days
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                  <p className="text-gray-900">
                    {formatDate(affiliationStatus.memberSince)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Next Renewal</label>
                  <p className="text-gray-900 font-semibold">
                    {affiliationStatus.annualFee ? formatCurrency(affiliationStatus.annualFee) : 'TBD'}
                  </p>
                </div>
                {affiliationStatus.isActive && affiliationStatus.daysRemaining > 0 && (
                  <button
                    onClick={handleRenewalClick}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mt-3"
                  >
                    Renew Early
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment History & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Payment History */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Payment History</h4>
            <button
              onClick={() => navigate('/state/membership/payments')}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          {paymentHistory && paymentHistory.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {paymentHistory.slice(0, 4).map((payment) => (
                <div key={payment.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{payment.payment_type}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(payment.transaction_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Payment History</h4>
              <p className="text-gray-600">Payment records will appear here once available.</p>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Recent Activities</h4>
          </div>
          {recentActivities && recentActivities.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentActivities.slice(0, 4).map((activity) => (
                <div key={activity.id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-sm">📅</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(activity.start_date)} • {activity.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Recent Activities</h4>
              <p className="text-gray-600">Activity records will appear here once available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Compliance Status */}
      {complianceStatus && (
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Compliance Status</h4>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Annual Report</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    complianceStatus.annualReport.completed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {complianceStatus.annualReport.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Insurance</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    complianceStatus.insurance.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {complianceStatus.insurance.valid ? 'Valid' : 'Expired'}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Board Elections</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    complianceStatus.boardElections.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {complianceStatus.boardElections.completed ? 'Completed' : 'Due'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Quarterly Review</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    complianceStatus.quarterlyReview.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {complianceStatus.quarterlyReview.completed ? 'Completed' : 'Due'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Membership Benefits */}
      {affiliationRequirements?.benefits && affiliationRequirements.benefits.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Membership Benefits</h4>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {affiliationRequirements.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/state/membership/certificate')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Download Certificate
        </button>
        <button
          onClick={() => navigate('/state/membership/compliance')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Submit Reports
        </button>
        <button
          onClick={() => navigate('/state/membership/contact')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.476L3 21l2.476-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
          </svg>
          Contact Support
        </button>
      </div>

      {/* Renewal Modal */}
      {showRenewalModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Membership Renewal</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to renew your membership for {affiliationStatus?.annualFee ? formatCurrency(affiliationStatus.annualFee) : 'TBD'}?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowRenewalModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRenewalConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Renewal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}