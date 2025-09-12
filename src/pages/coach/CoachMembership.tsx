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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your coaching membership information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
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
        <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Coach Membership Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎓</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Certification Access</h3>
              <p className="text-gray-600">Access to official coaching certifications and training materials</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Management</h3>
              <p className="text-gray-600">Advanced tools to track student progress and manage coaching sessions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Earning Opportunities</h3>
              <p className="text-gray-600">Access to premium coaching opportunities and higher earning potential</p>
            </div>
          </div>
        </div>

        {/* Professional Development */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 shadow-sm rounded-lg p-6 mt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Professional Development</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-2">Continuous Learning</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Monthly coaching webinars and workshops</li>
                <li>• Access to latest coaching methodologies</li>
                <li>• Peer networking opportunities</li>
                <li>• Performance analytics and insights</li>
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-2">Career Growth</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Professional coaching profile</li>
                <li>• Student referral system</li>
                <li>• Tournament coaching opportunities</li>
                <li>• Elite coaching program access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachMembershipPage