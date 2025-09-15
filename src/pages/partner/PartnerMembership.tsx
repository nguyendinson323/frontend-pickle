import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchPartnerMembershipData,
  subscribeToPartnerPlan,
  cancelPartnerSubscription,
  changePartnerPlan,
  clearError
} from '../../store/slices/partnerMembershipSlice'

const PartnerMembership: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    currentSubscription,
    availablePlans,
    paymentHistory,
    stats,
    partnerInfo,
    loading,
    error
  } = useSelector((state: RootState) => state.partnerMembership)

  const [activeTab, setActiveTab] = useState<'overview' | 'benefits' | 'billing'>('overview')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  useEffect(() => {
    dispatch(fetchPartnerMembershipData())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const handleSubscribe = async (planId: number) => {
    try {
      await dispatch(subscribeToPartnerPlan(planId, {
        payment_method: 'credit_card',
        billing_cycle: billingCycle
      }))
    } catch (error) {
      console.error('Subscription failed:', error)
    }
  }

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        await dispatch(cancelPartnerSubscription())
      } catch (error) {
        console.error('Cancellation failed:', error)
      }
    }
  }

  const handleChangePlan = async (newPlanId: number) => {
    if (window.confirm('Are you sure you want to change your subscription plan?')) {
      try {
        await dispatch(changePartnerPlan(newPlanId, {
          payment_method: 'credit_card',
          billing_cycle: billingCycle
        }))
      } catch (error) {
        console.error('Plan change failed:', error)
      }
    }
  }

  const handleDownloadReceipt = async (paymentId: number) => {
    try {
      // Fetch receipt data from backend
      const response = await fetch(`/api/partner/membership/receipt/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch receipt data')
      }

      const data = await response.json()
      const receipt = data.receipt

      const receiptData = `
PARTNER MEMBERSHIP RECEIPT
========================

Payment ID: ${receipt.paymentId}
Date: ${formatDate(receipt.date)}
Amount: ${formatCurrency(receipt.amount)}
Currency: ${receipt.currency}
Status: ${receipt.status}
Payment Type: ${receipt.paymentType}
Payment Method: ${receipt.paymentMethod}
Stripe Payment ID: ${receipt.stripePaymentId || 'N/A'}

Partner: ${receipt.partnerName}

Thank you for your partnership!
Mexican Pickleball Federation
      `

      const blob = new Blob([receiptData], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `receipt-${receipt.paymentId}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download receipt:', error)
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
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(numAmount)
  }

  const parseFeatures = (featuresString: string): string[] => {
    try {
      return JSON.parse(featuresString)
    } catch {
      return []
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Partner Membership</h1>
        <p className="text-purple-100">Grow your business with our partnership program</p>
        {partnerInfo && (
          <p className="text-purple-100 mt-2">
            {partnerInfo.business_name} • {partnerInfo.partner_type}
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
          {(['overview', 'benefits', 'billing'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-600'
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
            <h2 className="text-xl font-semibold mb-4">Partnership Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Plan</p>
                <p className="text-lg font-semibold">
                  {currentSubscription?.plan?.name || 'No active plan'}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Status</p>
                <p className={`text-lg font-semibold ${
                  currentSubscription?.status === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {currentSubscription?.status || 'Inactive'}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Partner Since</p>
                <p className="text-lg font-semibold">
                  {stats?.partnerSince ? formatDate(stats.partnerSince) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Partnership Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Partnership Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {stats?.profileViews?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-gray-500">Profile Views</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {stats?.leadsGenerated || '0'}
                </p>
                <p className="text-sm text-gray-500">Leads Generated</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {stats?.tournamentsSponsored || '0'}
                </p>
                <p className="text-sm text-gray-500">Tournaments Sponsored</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {stats?.averageRating || '0.0'}
                </p>
                <p className="text-sm text-gray-500">Average Rating</p>
              </div>
            </div>
          </div>

          {/* Current Plan Features */}
          {currentSubscription?.plan && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Current Plan Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parseFeatures(currentSubscription.plan.features).map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-green-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'benefits' && (
        <div className="space-y-6">
          {/* Billing Cycle Toggle */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-center mb-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    billingCycle === 'monthly'
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-600'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    billingCycle === 'yearly'
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-600'
                  }`}
                >
                  Yearly (Save 17%)
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Partnership Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availablePlans.map((plan) => {
                const price = billingCycle === 'yearly' ? plan.yearly_price : plan.monthly_price
                const isCurrentPlan = currentSubscription?.plan_id === plan.id
                const isFeatured = plan.name.toLowerCase().includes('pro')

                return (
                  <div
                    key={plan.id}
                    className={`border rounded-lg p-6 ${
                      isFeatured ? 'border-purple-500 shadow-lg relative' : 'border-gray-200'
                    }`}
                  >
                    {isFeatured && (
                      <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{formatCurrency(price)}</span>
                      <span className="text-gray-500">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {parseFeatures(plan.features).map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-4 h-4 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {isCurrentPlan ? (
                      <div className="w-full py-2 text-center border border-green-500 text-green-600 rounded-lg font-medium">
                        Current Plan
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (currentSubscription) {
                            handleChangePlan(plan.id)
                          } else {
                            handleSubscribe(plan.id)
                          }
                        }}
                        disabled={loading}
                        className={`w-full py-2 rounded-lg font-medium transition-colors ${
                          isFeatured
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } disabled:opacity-50`}
                      >
                        {currentSubscription ? 'Switch Plan' : 'Select Plan'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Current Subscription */}
          {currentSubscription && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="font-medium">{currentSubscription.plan.name}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-medium capitalize ${
                    currentSubscription.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentSubscription.status}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{formatDate(currentSubscription.start_date)}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium">{formatDate(currentSubscription.end_date)}</p>
                </div>
              </div>
              {currentSubscription.status === 'active' && (
                <div className="mt-4">
                  <button
                    onClick={handleCancelSubscription}
                    disabled={loading}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Cancel Subscription
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Payment History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>
            {paymentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(payment.transaction_date || payment.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {payment.payment_type === 'membership' ? 'Membership Payment' : payment.payment_type}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDownloadReceipt(payment.id)}
                            className="text-purple-600 hover:text-purple-700 disabled:opacity-50"
                            disabled={loading}
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No payment history available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PartnerMembership