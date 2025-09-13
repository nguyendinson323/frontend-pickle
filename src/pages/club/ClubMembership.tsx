import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchClubMembershipData,
  subscribeToClubPlan,
  cancelClubSubscription,
  changeClubPlan,
  clearError
} from '../../store/slices/clubMembershipSlice'

const ClubMembership: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { 
    currentSubscription, 
    availablePlans, 
    paymentHistory, 
    stats, 
    clubInfo, 
    loading, 
    error 
  } = useSelector((state: RootState) => state.clubMembership)

  const [activeTab, setActiveTab] = useState<'overview' | 'benefits' | 'billing'>('overview')
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    dispatch(fetchClubMembershipData())
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
      await dispatch(subscribeToClubPlan(planId, {
        payment_method: 'credit_card',
        billing_cycle: billingCycle
      }))
      setShowPaymentModal(false)
      setSelectedPlan(null)
    } catch (error) {
      console.error('Subscription failed:', error)
    }
  }

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        await dispatch(cancelClubSubscription())
      } catch (error) {
        console.error('Cancellation failed:', error)
      }
    }
  }

  const handleChangePlan = async (planId: number) => {
    try {
      await dispatch(changeClubPlan(planId, billingCycle))
    } catch (error) {
      console.error('Plan change failed:', error)
    }
  }

  const membershipFeatures = [
    { title: 'Court Management', description: 'Manage unlimited courts and facilities' },
    { title: 'Tournament Hosting', description: 'Host and manage official tournaments' },
    { title: 'Member Management', description: 'Track and manage club members' },
    { title: 'Club Microsite', description: 'Custom club website and branding' },
    { title: 'Analytics Dashboard', description: 'Detailed insights and reports' },
    { title: 'Priority Support', description: '24/7 dedicated support' }
  ]

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Club Membership</h1>
        <p className="text-indigo-100">
          {clubInfo?.name ? `Manage ${clubInfo.name}'s membership and unlock premium features` : 'Manage your club membership and unlock premium features'}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {(['overview', 'benefits', 'billing'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
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
            <h2 className="text-xl font-semibold mb-4">Current Membership Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Plan</p>
                <p className="text-lg font-semibold">
                  {currentSubscription?.plan?.name || 'No Active Plan'}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Status</p>
                <p className={`text-lg font-semibold ${
                  stats?.status === 'active' ? 'text-green-600' : 
                  stats?.status === 'expired' ? 'text-red-600' : 
                  stats?.status === 'canceled' ? 'text-yellow-600' : 'text-gray-600'
                }`}>
                  {stats?.status ? stats.status.charAt(0).toUpperCase() + stats.status.slice(1) : 'Inactive'}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Days Remaining</p>
                <p className="text-lg font-semibold">
                  {stats?.days_remaining || 0}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Next Billing</p>
                <p className="text-lg font-semibold">
                  {currentSubscription?.end_date ? formatDate(currentSubscription.end_date) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Premium Status */}
          {stats && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Premium Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Premium Status</p>
                  <p className={`text-lg font-semibold ${stats.has_premium ? 'text-green-600' : 'text-gray-600'}`}>
                    {stats.has_premium ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Court Management</p>
                  <p className={`text-lg font-semibold ${stats.has_courts ? 'text-green-600' : 'text-gray-600'}`}>
                    {stats.has_courts ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-lg font-semibold">
                    {formatPrice(stats.total_spent)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Included Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {membershipFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'benefits' && (
        <div className="space-y-6">
          {/* Billing Cycle Toggle */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Choose Billing Cycle</h2>
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${billingCycle === 'monthly' ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    billingCycle === 'yearly' ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm ${billingCycle === 'yearly' ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                  Yearly <span className="text-green-500">(Save 20%)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availablePlans.map((plan) => {
                const price = billingCycle === 'yearly' ? plan.yearly_price : plan.monthly_price
                const isCurrentPlan = currentSubscription?.plan_id === plan.id
                const isFeatured = plan.name.toLowerCase().includes('professional') || plan.name.toLowerCase().includes('premium')
                
                return (
                  <div
                    key={plan.id}
                    className={`border rounded-lg p-6 ${
                      isFeatured ? 'border-indigo-500 shadow-lg relative' : 'border-gray-200'
                    } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
                  >
                    {isFeatured && (
                      <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm">
                        Recommended
                      </span>
                    )}
                    {isCurrentPlan && (
                      <span className="absolute -top-3 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        Current Plan
                      </span>
                    )}
                    <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{formatPrice(price)}</span>
                      <span className="text-gray-500">/{billingCycle.slice(0, -2)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                    {plan.features && (
                      <ul className="space-y-2 mb-6">
                        {plan.features.split(',').map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">{feature.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="space-y-2">
                      {isCurrentPlan ? (
                        <button
                          onClick={() => handleChangePlan(plan.id)}
                          className="w-full py-2 rounded-lg font-medium bg-green-100 text-green-700 border border-green-300"
                        >
                          Update Billing Cycle
                        </button>
                      ) : currentSubscription ? (
                        <button
                          onClick={() => handleChangePlan(plan.id)}
                          className="w-full py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          Change to This Plan
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedPlan(plan.id)
                            setShowPaymentModal(true)
                          }}
                          className={`w-full py-2 rounded-lg font-medium ${
                            isFeatured
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Select Plan
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Why Choose Club Membership?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Grow Your Club</h3>
                <p className="text-gray-600">Access tools to attract and retain more members, increasing your club's revenue and reputation.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Streamline Operations</h3>
                <p className="text-gray-600">Automate court bookings, member management, and tournament organization.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Enhanced Visibility</h3>
                <p className="text-gray-600">Get featured in our directory and attract more players to your facilities.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Professional Tools</h3>
                <p className="text-gray-600">Access professional-grade tools for managing your club's operations and growth.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Billing Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-sm text-gray-500">
                      {currentSubscription ? 'Credit Card' : 'No payment method on file'}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      // In a real implementation, this would open a payment method update modal
                      console.log('Update payment method')
                    }}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Update
                  </button>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Billing Contact</p>
                    <p className="text-sm text-gray-500">
                      {clubInfo?.name || 'Club billing information'}
                    </p>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>
              {currentSubscription && (
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Auto Renewal</p>
                      <p className="text-sm text-gray-500">
                        {currentSubscription.auto_renew ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      {currentSubscription.auto_renew ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>
            {paymentHistory && paymentHistory.length > 0 ? (
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
                          {payment.payment_type} - {payment.reference_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatPrice(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {payment.status === 'completed' ? (
                            <button 
                              onClick={() => {
                                // In a real implementation, this would download the receipt
                                console.log('Download receipt for payment:', payment.id)
                              }}
                              className="text-indigo-600 hover:text-indigo-700"
                            >
                              Download
                            </button>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No payment history</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your payment transactions will appear here once you subscribe to a plan.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Membership Actions</h2>
            <div className="space-y-3">
              {currentSubscription && (
                <>
                  <button 
                    onClick={() => setActiveTab('benefits')}
                    className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Change Plan</p>
                        <p className="text-sm text-gray-500">Upgrade or downgrade your membership</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                  <button 
                    onClick={handleCancelSubscription}
                    className="w-full text-left px-4 py-3 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-red-600">Cancel Membership</p>
                        <p className="text-sm text-gray-500">Cancel your subscription</p>
                      </div>
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </>
              )}
              {!currentSubscription && (
                <button 
                  onClick={() => setActiveTab('benefits')}
                  className="w-full text-left px-4 py-3 border border-indigo-200 rounded-lg hover:bg-indigo-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-indigo-600">Subscribe to a Plan</p>
                      <p className="text-sm text-gray-500">Choose a membership plan to get started</p>
                    </div>
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Simple Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 text-center">
                Confirm Subscription
              </h3>
              <div className="mt-4 px-7 py-3">
                <p className="text-sm text-gray-500 text-center">
                  You are about to subscribe to the selected plan for {billingCycle} billing.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-medium">
                      {availablePlans.find(p => p.id === selectedPlan)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Billing Cycle:</span>
                    <span className="font-medium capitalize">{billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">
                      {formatPrice(billingCycle === 'yearly' 
                        ? availablePlans.find(p => p.id === selectedPlan)?.yearly_price || 0
                        : availablePlans.find(p => p.id === selectedPlan)?.monthly_price || 0
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowPaymentModal(false)
                    setSelectedPlan(null)
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubscribe(selectedPlan)}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClubMembership