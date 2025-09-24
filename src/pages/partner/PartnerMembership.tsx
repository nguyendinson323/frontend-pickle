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
import {
  FiAward,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiStar,
  FiEye,
  FiCheck,
  FiDownload,
  FiCreditCard,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiSettings,
  FiBarChart2
} from 'react-icons/fi'

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-700 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
            <FiLoader className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Membership</h2>
          <p className="text-gray-600 font-medium">Please wait while we fetch your partnership details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-700 p-8">
            <div className="flex items-center text-white">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center mr-6">
                <FiAward className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Partner Membership</h1>
                <p className="text-purple-100 font-medium text-lg">Grow your business with our partnership program</p>
                {partnerInfo && (
                  <div className="flex items-center mt-3 text-purple-100">
                    <FiSettings className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      {partnerInfo.business_name} • {partnerInfo.partner_type}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 shadow-lg rounded-2xl p-6 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-700 rounded-2xl flex items-center justify-center mr-4">
                <FiAlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-900 mb-1">Membership Error</h3>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl mb-6 overflow-hidden">
          <div className="border-b border-gray-100">
            <nav className="-mb-px flex">
              {(['overview', 'benefits', 'billing'] as const).map((tab) => {
                const icons = {
                  overview: <FiBarChart2 className="w-5 h-5 mr-2" />,
                  benefits: <FiAward className="w-5 h-5 mr-2" />,
                  billing: <FiCreditCard className="w-5 h-5 mr-2" />
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-6 px-8 text-sm font-bold border-b-4 transition-all duration-300 flex items-center capitalize ${
                      activeTab === tab
                        ? 'border-purple-500 text-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50'
                    }`}
                  >
                    {icons[tab]}
                    {tab}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl flex items-center justify-center mr-4">
                  <FiSettings className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Partnership Status</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                  <div className="flex items-center mb-3">
                    <FiAward className="w-6 h-6 text-purple-600 mr-2" />
                    <p className="text-sm font-bold text-gray-500">Plan</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {currentSubscription?.plan?.name || 'No active plan'}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                  <div className="flex items-center mb-3">
                    <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${
                      currentSubscription?.status === 'active' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <div className={`w-3 h-3 rounded-full ${
                        currentSubscription?.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                      }`}></div>
                    </div>
                    <p className="text-sm font-bold text-gray-500">Status</p>
                  </div>
                  <p className={`text-xl font-bold ${
                    currentSubscription?.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentSubscription?.status || 'Inactive'}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                  <div className="flex items-center mb-3">
                    <FiCalendar className="w-6 h-6 text-blue-600 mr-2" />
                    <p className="text-sm font-bold text-gray-500">Partner Since</p>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {stats?.partnerSince ? formatDate(stats.partnerSince) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Partnership Metrics */}
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
                  <FiBarChart2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Partnership Performance</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiEye className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-purple-600 mb-2">
                    {stats?.profileViews?.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm font-bold text-gray-500">Profile Views</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiUsers className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    {stats?.leadsGenerated || '0'}
                  </p>
                  <p className="text-sm font-bold text-gray-500">Leads Generated</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiAward className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-orange-600 mb-2">
                    {stats?.tournamentsSponsored || '0'}
                  </p>
                  <p className="text-sm font-bold text-gray-500">Tournaments Sponsored</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiStar className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-yellow-600 mb-2">
                    {stats?.averageRating || '0.0'}
                  </p>
                  <p className="text-sm font-bold text-gray-500">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Current Plan Features */}
            {currentSubscription?.plan && (
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center mr-4">
                    <FiCheck className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Current Plan Benefits</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parseFeatures(currentSubscription.plan.features).map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center mt-0.5">
                        <FiCheck className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{feature}</span>
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
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
              <div className="flex justify-center mb-6">
                <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-2 shadow-inner">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                      billingCycle === 'monthly'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-700 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FiCalendar className="w-4 h-4 inline mr-2" />
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative ${
                      billingCycle === 'yearly'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-700 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FiCalendar className="w-4 h-4 inline mr-2" />
                    Yearly
                    <span className="ml-2 bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 px-2 py-1 rounded-full text-xs font-bold border border-green-300">
                      Save 17%
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-4">
                  <FiAward className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Partnership Plans</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availablePlans.map((plan) => {
                  const price = billingCycle === 'yearly' ? plan.yearly_price : plan.monthly_price
                  const isCurrentPlan = currentSubscription?.plan_id === plan.id
                  const isFeatured = plan.name.toLowerCase().includes('pro')

                  return (
                    <div
                      key={plan.id}
                      className={`border rounded-3xl p-8 relative hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 ${
                        isFeatured ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl' : 'border-gray-200 bg-white'
                      }`}
                    >
                      {isFeatured && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-purple-600 to-pink-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            <FiStar className="w-4 h-4 inline mr-1" />
                            Most Popular
                          </span>
                        </div>
                      )}
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                        <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                        <div className="mb-6">
                          <div className="flex items-center justify-center mb-2">
                            <FiDollarSign className="w-8 h-8 text-purple-600" />
                            <span className="text-4xl font-bold text-purple-600">{formatCurrency(price).replace('$', '')}</span>
                          </div>
                          <span className="text-gray-500 font-medium">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                        </div>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {parseFeatures(plan.features).map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-5 h-5 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center mt-0.5 mr-3">
                              <FiCheck className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {isCurrentPlan ? (
                        <div className="w-full py-4 text-center bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 rounded-2xl font-bold border border-green-300">
                          <FiCheck className="w-5 h-5 inline mr-2" />
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
                          className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none ${
                            isFeatured
                              ? 'bg-gradient-to-r from-purple-600 to-pink-700 text-white shadow-lg hover:from-purple-700 hover:to-pink-800'
                              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
                          }`}
                        >
                          {loading ? (
                            <FiLoader className="w-5 h-5 inline mr-2 animate-spin" />
                          ) : (
                            <FiCreditCard className="w-5 h-5 inline mr-2" />
                          )}
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
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
                    <FiCreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Current Subscription</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-3">
                      <FiAward className="w-6 h-6 text-purple-600 mr-2" />
                      <p className="text-sm font-bold text-gray-500">Plan</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{currentSubscription.plan.name}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-3">
                      <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${
                        currentSubscription.status === 'active' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          currentSubscription.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                        }`}></div>
                      </div>
                      <p className="text-sm font-bold text-gray-500">Status</p>
                    </div>
                    <p className={`text-xl font-bold capitalize ${
                      currentSubscription.status === 'active' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {currentSubscription.status}
                    </p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-3">
                      <FiCalendar className="w-6 h-6 text-green-600 mr-2" />
                      <p className="text-sm font-bold text-gray-500">Start Date</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{formatDate(currentSubscription.start_date)}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-3">
                      <FiCalendar className="w-6 h-6 text-red-600 mr-2" />
                      <p className="text-sm font-bold text-gray-500">End Date</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{formatDate(currentSubscription.end_date)}</p>
                  </div>
                </div>
                {currentSubscription.status === 'active' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleCancelSubscription}
                      disabled={loading}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-2xl hover:from-red-700 hover:to-pink-800 disabled:opacity-50 font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
                    >
                      {loading ? (
                        <FiLoader className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <FiX className="w-5 h-5 mr-2" />
                      )}
                      Cancel Subscription
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Payment History */}
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center mr-4">
                  <FiCalendar className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
              </div>
              {paymentHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <FiCalendar className="w-4 h-4 inline mr-1" />
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <FiCreditCard className="w-4 h-4 inline mr-1" />
                            Description
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <FiDollarSign className="w-4 h-4 inline mr-1" />
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <FiDownload className="w-4 h-4 inline mr-1" />
                            Receipt
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {paymentHistory.map((payment, index) => (
                          <tr key={payment.id} className={`hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatDate(payment.transaction_date || payment.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {payment.payment_type === 'membership' ? 'Membership Payment' : payment.payment_type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                                payment.status === 'completed'
                                  ? 'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border-green-300'
                                  : payment.status === 'pending'
                                  ? 'bg-gradient-to-r from-yellow-100 to-orange-200 text-yellow-800 border-yellow-300'
                                  : 'bg-gradient-to-r from-red-100 to-pink-200 text-red-800 border-red-300'
                              }`}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => handleDownloadReceipt(payment.id)}
                                className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-purple-100 to-indigo-200 text-purple-700 border border-purple-300 rounded-xl hover:from-purple-200 hover:to-indigo-300 disabled:opacity-50 font-bold transition-all duration-200 hover:transform hover:scale-105"
                                disabled={loading}
                              >
                                {loading ? (
                                  <FiLoader className="w-4 h-4 animate-spin" />
                                ) : (
                                  <FiDownload className="w-4 h-4" />
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <FiCalendar className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">No Payment History</h3>
                  <p className="text-gray-600 font-medium">Your payment history will appear here once you make your first subscription payment.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PartnerMembership