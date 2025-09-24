import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchCoachMembershipData,
  subscribeToCoachPlan,
  cancelCoachSubscription,
  renewCoachSubscription,
  updateCoachPaymentMethod
} from '../../store/slices/coachMembershipSlice'
import {
  CoachMembershipHeader,
  CurrentSubscription,
  AvailablePlans,
  PaymentHistory,
  PaymentMethodModal
} from '../../components/coach/membership'
import {
  FiCheckCircle,
  FiX,
  FiAlertCircle,
  FiLoader,
  FiAward,
  FiUsers,
  FiDollarSign
} from 'react-icons/fi'

const CoachMembershipPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { currentSubscription, availablePlans, paymentHistory, stats, loading, error } = useSelector((state: RootState) => state.coachMembership)
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    dispatch(fetchCoachMembershipData())
  }, [dispatch])

  // Clear success message when error occurs
  useEffect(() => {
    if (error) {
      setSuccessMessage('')
    }
  }, [error])

  // Clear success message automatically
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const handleSubscribe = async (planId: number, billingCycle: 'monthly' | 'yearly') => {
    try {
      await dispatch(subscribeToCoachPlan(planId, {
        payment_method: 'credit_card',
        billing_cycle: billingCycle
      }))
      setSuccessMessage('Successfully subscribed to coaching plan!')
    } catch (error) {
      // Error is already handled in Redux slice and displayed in error state
      console.error('Subscription failed:', error)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      await dispatch(cancelCoachSubscription())
      setSuccessMessage('Coaching subscription canceled successfully')
    } catch (error) {
      // Error is already handled in Redux slice and displayed in error state
      console.error('Cancellation failed:', error)
    }
  }

  const handleRenewSubscription = async (planId: number, billingCycle: 'monthly' | 'yearly') => {
    try {
      await dispatch(renewCoachSubscription(planId, {
        payment_method: 'credit_card',
        billing_cycle: billingCycle
      }))
      setSuccessMessage('Coaching subscription renewed successfully!')
    } catch (error) {
      // Error is already handled in Redux slice and displayed in error state
      console.error('Renewal failed:', error)
    }
  }

  const handleUpdatePaymentMethod = async (paymentData: { payment_method: string; stripe_payment_method_id?: string }) => {
    try {
      await dispatch(updateCoachPaymentMethod(paymentData))
      setSuccessMessage('Payment method updated successfully!')
    } catch (error) {
      // Error is already handled in Redux slice and displayed in error state
      console.error('Payment method update failed:', error)
    }
  }

  if (loading && !currentSubscription && availablePlans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-indigo-600 mx-auto mb-6">
              <FiLoader className="h-8 w-8 text-transparent" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Membership</h3>
            <p className="text-gray-600 font-medium text-lg">Please wait while we load your coaching membership information...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-green-800">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="ml-auto text-green-400 hover:text-green-600 transition-colors duration-200"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        {stats && (
          <CoachMembershipHeader
            membershipStatus={stats.status}
            daysRemaining={stats.days_remaining}
            totalSpent={stats.total_spent}
            membershipSince={stats.membership_since}
            totalEarnings={stats.total_earnings}
            studentsCount={stats.students_taught}
            sessionsCompleted={stats.sessions_completed}
          />
        )}

        {/* Current Subscription */}
        <CurrentSubscription
          subscription={currentSubscription}
          onCancel={handleCancelSubscription}
          onRenew={handleRenewSubscription}
          onUpdatePaymentMethod={() => setIsPaymentModalOpen(true)}
        />

        {/* Available Plans */}
        <AvailablePlans
          plans={availablePlans}
          currentPlanId={currentSubscription?.plan_id || null}
          onSubscribe={handleSubscribe}
        />

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Payment History */}
          <PaymentHistory payments={paymentHistory} />
        </div>

        {/* Payment Method Modal */}
        <PaymentMethodModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSubmit={handleUpdatePaymentMethod}
        />

        {/* Coach Membership Benefits */}
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8 mt-6">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center mr-4">
              <FiAward className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Coach Membership Benefits</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiAward className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Certification Access</h3>
              <p className="text-gray-600 font-medium">Access to official coaching certifications and training materials</p>
            </div>
            <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Student Management</h3>
              <p className="text-gray-600 font-medium">Advanced tools to track student progress and manage coaching sessions</p>
            </div>
            <div className="text-center bg-gradient-to-br from-purple-50 to-purple-50 border border-purple-200 rounded-2xl p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiDollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Earning Opportunities</h3>
              <p className="text-gray-600 font-medium">Access to premium coaching opportunities and higher earning potential</p>
            </div>
          </div>
        </div>

        {/* Professional Development */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 shadow-2xl rounded-3xl p-8 mt-6">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Professional Development</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                  <FiAward className="w-4 h-4 text-white" />
                </div>
                Continuous Learning
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center"><FiCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Monthly coaching webinars and workshops</li>
                <li className="flex items-center"><FiCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Access to latest coaching methodologies</li>
                <li className="flex items-center"><FiCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Peer networking opportunities</li>
                <li className="flex items-center"><FiCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Performance analytics and insights</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <FiDollarSign className="w-4 h-4 text-white" />
                </div>
                Career Growth
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center"><FiCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Professional coaching profile</li>
                <li className="flex items-center"><FiCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Student referral system</li>
                <li className="flex items-center"><FiCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Tournament coaching opportunities</li>
                <li className="flex items-center"><FiCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Elite coaching program access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachMembershipPage