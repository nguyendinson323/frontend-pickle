import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchClubMembershipData,
  subscribeToClubPlan,
  cancelClubSubscription,
  changeClubPlan,
  downloadPaymentReceipt,
  updateClubPaymentMethod,
  toggleAutoRenewal,
  clearError
} from '../../store/slices/clubMembershipSlice'
import MembershipHeader from '../../components/club/membership/MembershipHeader'
import PaymentMethodModal from '../../components/club/membership/PaymentMethodModal'
import BillingContactModal from '../../components/club/membership/BillingContactModal'
import EnhancedPaymentModal from '../../components/club/membership/EnhancedPaymentModal'
import {
  FiCreditCard,
  FiUser,
  FiRefreshCw,
  FiX,
  FiCheck,
  FiClock,
  FiDollarSign,
  FiDownload,
  FiSettings,
  FiChevronRight,
  FiFileText,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiCalendar,
  FiStar,
  FiAlertTriangle
} from 'react-icons/fi'

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
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false)
  const [showBillingContactModal, setShowBillingContactModal] = useState(false)
  const [showEnhancedPaymentModal, setShowEnhancedPaymentModal] = useState(false)

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

  const handleSubscribe = async (paymentData: { payment_method: string; billing_cycle: 'monthly' | 'yearly'; stripe_payment_method_id?: string }) => {
    if (!selectedPlan) return

    try {
      await dispatch(subscribeToClubPlan(selectedPlan, paymentData))
      setShowEnhancedPaymentModal(false)
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

  const handleDownloadReceipt = async (paymentId: number) => {
    try {
      await dispatch(downloadPaymentReceipt(paymentId))
    } catch (error) {
      console.error('Receipt download failed:', error)
    }
  }

  const handleUpdatePaymentMethod = async (paymentData: { payment_method: string; stripe_payment_method_id?: string }) => {
    try {
      await dispatch(updateClubPaymentMethod(paymentData))
      setShowPaymentMethodModal(false)
    } catch (error) {
      console.error('Payment method update failed:', error)
    }
  }

  const handleUpdateBillingContact = async (contactData: {
    billing_contact_name: string
    billing_contact_email: string
    billing_contact_phone: string
    billing_address: string
    billing_city: string
    billing_state: string
    billing_zip: string
  }) => {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate success
      setShowBillingContactModal(false)
      console.log('Billing contact updated:', contactData)
    } catch (error) {
      console.error('Billing contact update failed:', error)
    }
  }

  const handleToggleAutoRenewal = async () => {
    try {
      const newAutoRenewal = !currentSubscription?.auto_renew
      await dispatch(toggleAutoRenewal(newAutoRenewal))
    } catch (error) {
      console.error('Auto renewal toggle failed:', error)
    }
  }

  const handleUpgradeClick = () => {
    setActiveTab('benefits')
  }

  const handleRenewClick = () => {
    setActiveTab('benefits')
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading membership details...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4 shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <MembershipHeader
          clubInfo={clubInfo}
          stats={stats}
          onUpgradeClick={handleUpgradeClick}
          onRenewClick={handleRenewClick}
        />

        {/* Tabs */}
        <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 border-b-2 border-blue-200">
            <nav className="flex space-x-8">
              {(['overview', 'benefits', 'billing'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-6 border-b-4 font-bold text-sm capitalize rounded-t-2xl transition-all duration-200 ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600 bg-white shadow-lg transform -translate-y-1'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-white hover:bg-opacity-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Current Status */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiShield className="h-6 w-6 mr-3" />
                  Current Membership Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center mb-2">
                      <FiStar className="h-4 w-4 text-blue-500 mr-2" />
                      <p className="text-sm font-medium text-gray-500">Plan</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {currentSubscription?.plan?.name || 'No Active Plan'}
                    </p>
                  </div>
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center mb-2">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                      <p className="text-sm font-medium text-gray-500">Status</p>
                    </div>
                    <p className={`text-lg font-bold ${
                      stats?.status === 'active' ? 'text-green-600' :
                      stats?.status === 'expired' ? 'text-red-600' :
                      stats?.status === 'canceled' ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {stats?.status ? stats.status.charAt(0).toUpperCase() + stats.status.slice(1) : 'Inactive'}
                    </p>
                  </div>
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center mb-2">
                      <FiClock className="h-4 w-4 text-orange-500 mr-2" />
                      <p className="text-sm font-medium text-gray-500">Days Remaining</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {stats?.days_remaining || 0}
                    </p>
                  </div>
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center mb-2">
                      <FiCalendar className="h-4 w-4 text-purple-500 mr-2" />
                      <p className="text-sm font-medium text-gray-500">Next Billing</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {currentSubscription?.end_date ? formatDate(currentSubscription.end_date) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Premium Status */}
              {stats && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FiTrendingUp className="h-6 w-6 mr-3" />
                    Premium Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border-2 border-purple-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-center mb-2">
                        <FiStar className="h-4 w-4 text-purple-500 mr-2" />
                        <p className="text-sm font-medium text-gray-500">Premium Status</p>
                      </div>
                      <p className={`text-lg font-bold ${stats.has_premium ? 'text-green-600' : 'text-gray-600'}`}>
                        {stats.has_premium ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <div className="bg-white border-2 border-purple-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-center mb-2">
                        <FiSettings className="h-4 w-4 text-indigo-500 mr-2" />
                        <p className="text-sm font-medium text-gray-500">Court Management</p>
                      </div>
                      <p className={`text-lg font-bold ${stats.has_courts ? 'text-green-600' : 'text-gray-600'}`}>
                        {stats.has_courts ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <div className="bg-white border-2 border-purple-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-center mb-2">
                        <FiDollarSign className="h-4 w-4 text-green-500 mr-2" />
                        <p className="text-sm font-medium text-gray-500">Total Spent</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(stats.total_spent)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiFileText className="h-6 w-6 mr-3" />
                  Included Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {membershipFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-white border-2 border-green-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                      <FiCheck className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="p-6 space-y-6">
              {/* Billing Cycle Toggle */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FiClock className="h-6 w-6 mr-3" />
                    Choose Billing Cycle
                  </h2>
                  <div className="flex items-center space-x-3 bg-white border-2 border-indigo-200 rounded-2xl p-3 shadow-sm">
                    <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-indigo-600' : 'text-gray-500'}`}>
                      Monthly
                    </span>
                    <button
                      onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:scale-105 ${
                        billingCycle === 'yearly' ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-lg ${
                          billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-indigo-600' : 'text-gray-500'}`}>
                      Yearly <span className="text-green-600 font-bold">(Save 20%)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing Plans */}
              <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiCreditCard className="h-6 w-6 mr-3" />
                  Available Plans
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {availablePlans.map((plan) => {
                    const price = billingCycle === 'yearly' ? plan.yearly_price : plan.monthly_price
                    const isCurrentPlan = currentSubscription?.plan_id === plan.id
                    const isFeatured = plan.name.toLowerCase().includes('professional') || plan.name.toLowerCase().includes('premium')

                    return (
                      <div
                        key={plan.id}
                        className={`border-2 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:transform hover:scale-105 ${
                          isFeatured ? 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg relative' : 'border-gray-200 bg-white'
                        } ${isCurrentPlan ? 'ring-4 ring-green-300 border-green-400' : ''}`}
                      >
                        {isFeatured && (
                          <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            <FiStar className="inline h-4 w-4 mr-1" />
                            Recommended
                          </span>
                        )}
                        {isCurrentPlan && (
                          <span className="absolute -top-3 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            <FiCheck className="inline h-4 w-4 mr-1" />
                            Current Plan
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                          <FiStar className="h-5 w-5 mr-2 text-indigo-500" />
                          {plan.name}
                        </h3>
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-gray-900">{formatPrice(price)}</span>
                          <span className="text-gray-500 font-medium">/{billingCycle.slice(0, -2)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 font-medium">{plan.description}</p>
                        {plan.features && (
                          <ul className="space-y-3 mb-6">
                            {plan.features.split(',').map((feature, idx) => (
                              <li key={idx} className="flex items-start">
                                <FiCheck className="w-4 h-4 text-green-500 mt-1 mr-3 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-700">{feature.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="space-y-2">
                          {isCurrentPlan ? (
                            <button
                              onClick={() => handleChangePlan(plan.id)}
                              className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-2 border-green-300 hover:from-green-200 hover:to-emerald-200 transition-all duration-200 hover:shadow-md"
                            >
                              <FiRefreshCw className="inline h-4 w-4 mr-2" />
                              Update Billing Cycle
                            </button>
                          ) : currentSubscription ? (
                            <button
                              onClick={() => handleChangePlan(plan.id)}
                              className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 text-white hover:from-indigo-700 hover:to-purple-800 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                            >
                              <FiChevronRight className="inline h-4 w-4 mr-2" />
                              Change to This Plan
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedPlan(plan.id)
                                setShowEnhancedPaymentModal(true)
                              }}
                              className={`w-full py-3 rounded-2xl font-bold transition-all duration-200 hover:shadow-lg transform hover:scale-105 ${
                                isFeatured
                                  ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white hover:from-indigo-700 hover:to-purple-800'
                                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
                              }`}
                            >
                              <FiCreditCard className="inline h-4 w-4 mr-2" />
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
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiTrendingUp className="h-6 w-6 mr-3" />
                  Why Choose Club Membership?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-yellow-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                      <FiUsers className="h-5 w-5 mr-2 text-yellow-600" />
                      Grow Your Club
                    </h3>
                    <p className="text-gray-600 font-medium">Access tools to attract and retain more members, increasing your club's revenue and reputation.</p>
                  </div>
                  <div className="bg-white border-2 border-yellow-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                      <FiSettings className="h-5 w-5 mr-2 text-orange-600" />
                      Streamline Operations
                    </h3>
                    <p className="text-gray-600 font-medium">Automate court bookings, member management, and tournament organization.</p>
                  </div>
                  <div className="bg-white border-2 border-yellow-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                      <FiStar className="h-5 w-5 mr-2 text-yellow-600" />
                      Enhanced Visibility
                    </h3>
                    <p className="text-gray-600 font-medium">Get featured in our directory and attract more players to your facilities.</p>
                  </div>
                  <div className="bg-white border-2 border-yellow-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                      <FiShield className="h-5 w-5 mr-2 text-orange-600" />
                      Professional Tools
                    </h3>
                    <p className="text-gray-600 font-medium">Access professional-grade tools for managing your club's operations and growth.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="p-6 space-y-6">
              {/* Billing Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiCreditCard className="h-6 w-6 mr-3" />
                  Billing Information
                </h2>
                <div className="space-y-4">
                  <div className="bg-white border-2 border-blue-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900 flex items-center">
                          <FiCreditCard className="h-4 w-4 mr-2" />
                          Payment Method
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          {currentSubscription ? 'Credit Card' : 'No payment method on file'}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowPaymentMethodModal(true)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-purple-800 transition-all duration-200 hover:shadow-lg"
                      >
                        <FiSettings className="inline h-4 w-4 mr-1" />
                        Update
                      </button>
                    </div>
                  </div>
                  <div className="bg-white border-2 border-blue-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900 flex items-center">
                          <FiUser className="h-4 w-4 mr-2" />
                          Billing Contact
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          {clubInfo?.name || 'Club billing information'}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowBillingContactModal(true)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-purple-800 transition-all duration-200 hover:shadow-lg"
                      >
                        <FiSettings className="inline h-4 w-4 mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                  {currentSubscription && (
                    <div className="bg-white border-2 border-blue-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-900 flex items-center">
                            <FiRefreshCw className="h-4 w-4 mr-2" />
                            Auto Renewal
                          </p>
                          <p className={`text-sm font-medium ${currentSubscription.auto_renew ? 'text-green-600' : 'text-red-600'}`}>
                            {currentSubscription.auto_renew ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                        <button
                          onClick={handleToggleAutoRenewal}
                          disabled={loading}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 hover:shadow-lg disabled:opacity-50 ${
                            currentSubscription.auto_renew
                              ? 'bg-gradient-to-r from-red-600 to-pink-700 text-white hover:from-red-700 hover:to-pink-800'
                              : 'bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:from-green-700 hover:to-emerald-800'
                          }`}
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline mr-1"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              {currentSubscription.auto_renew ? (
                                <FiX className="inline h-4 w-4 mr-1" />
                              ) : (
                                <FiCheck className="inline h-4 w-4 mr-1" />
                              )}
                              {currentSubscription.auto_renew ? 'Disable' : 'Enable'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiFileText className="h-6 w-6 mr-3" />
                  Payment History
                </h2>
                {paymentHistory && paymentHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-green-200">
                      <thead className="bg-gradient-to-r from-green-100 to-emerald-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wider">
                            <FiCalendar className="inline h-4 w-4 mr-1" />
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wider">
                            <FiFileText className="inline h-4 w-4 mr-1" />
                            Description
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wider">
                            <FiDollarSign className="inline h-4 w-4 mr-1" />
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wider">
                            <FiCheck className="inline h-4 w-4 mr-1" />
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wider">
                            <FiDownload className="inline h-4 w-4 mr-1" />
                            Receipt
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-green-100">
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id} className="hover:bg-green-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatDate(payment.transaction_date || payment.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {payment.payment_type} - {payment.reference_type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              {formatPrice(payment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                                payment.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                payment.status === 'failed' ? 'bg-red-100 text-red-800 border border-red-200' :
                                'bg-gray-100 text-gray-800 border border-gray-200'
                              }`}>
                                {payment.status === 'completed' && <FiCheck className="inline h-3 w-3 mr-1" />}
                                {payment.status === 'pending' && <FiClock className="inline h-3 w-3 mr-1" />}
                                {payment.status === 'failed' && <FiX className="inline h-3 w-3 mr-1" />}
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {payment.status === 'completed' ? (
                                <button
                                  onClick={() => handleDownloadReceipt(payment.id)}
                                  className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-3 py-2 rounded-xl text-sm font-bold hover:from-green-700 hover:to-emerald-800 transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent inline mr-1"></div>
                                      Loading...
                                    </>
                                  ) : (
                                    <>
                                      <FiDownload className="inline h-3 w-3 mr-1" />
                                      Download
                                    </>
                                  )}
                                </button>
                              ) : (
                                <span className="text-gray-400 font-medium">N/A</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FiFileText className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-gray-900">No payment history</h3>
                    <p className="mt-1 text-sm text-gray-600 font-medium">
                      Your payment transactions will appear here once you subscribe to a plan.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiSettings className="h-6 w-6 mr-3" />
                  Membership Actions
                </h2>
                <div className="space-y-4">
                  {currentSubscription && (
                    <>
                      <button
                        onClick={() => setActiveTab('benefits')}
                        className="w-full text-left px-6 py-4 bg-white border-2 border-orange-200 rounded-2xl hover:bg-orange-50 hover:shadow-md transition-all duration-200 hover:transform hover:scale-105"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-gray-900 flex items-center">
                              <FiRefreshCw className="h-4 w-4 mr-2" />
                              Change Plan
                            </p>
                            <p className="text-sm text-gray-600 font-medium">Upgrade or downgrade your membership</p>
                          </div>
                          <FiChevronRight className="w-5 h-5 text-orange-400" />
                        </div>
                      </button>
                      <button
                        onClick={handleCancelSubscription}
                        className="w-full text-left px-6 py-4 bg-white border-2 border-red-300 rounded-2xl hover:bg-red-50 hover:shadow-md transition-all duration-200 hover:transform hover:scale-105"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-red-600 flex items-center">
                              <FiX className="h-4 w-4 mr-2" />
                              Cancel Membership
                            </p>
                            <p className="text-sm text-gray-600 font-medium">Cancel your subscription</p>
                          </div>
                          <FiChevronRight className="w-5 h-5 text-red-400" />
                        </div>
                      </button>
                    </>
                  )}
                  {!currentSubscription && (
                    <button
                      onClick={() => setActiveTab('benefits')}
                      className="w-full text-left px-6 py-4 bg-white border-2 border-indigo-300 rounded-2xl hover:bg-indigo-50 hover:shadow-md transition-all duration-200 hover:transform hover:scale-105"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-indigo-600 flex items-center">
                            <FiCreditCard className="h-4 w-4 mr-2" />
                            Subscribe to a Plan
                          </p>
                          <p className="text-sm text-gray-600 font-medium">Choose a membership plan to get started</p>
                        </div>
                        <FiChevronRight className="w-5 h-5 text-indigo-400" />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
      <EnhancedPaymentModal
        isOpen={showEnhancedPaymentModal}
        onClose={() => {
          setShowEnhancedPaymentModal(false)
          setSelectedPlan(null)
        }}
        plan={selectedPlan ? availablePlans.find(p => p.id === selectedPlan) || null : null}
        billingCycle={billingCycle}
        onConfirm={handleSubscribe}
        loading={loading}
      />

      <PaymentMethodModal
        isOpen={showPaymentMethodModal}
        onClose={() => setShowPaymentMethodModal(false)}
        onUpdate={handleUpdatePaymentMethod}
        loading={loading}
      />

      <BillingContactModal
        isOpen={showBillingContactModal}
        onClose={() => setShowBillingContactModal(false)}
        clubInfo={clubInfo}
        onUpdate={handleUpdateBillingContact}
        loading={loading}
      />
    </div>
    </div>
  )
}

export default ClubMembership