import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { 
  fetchPlayerMembershipData,
  subscribeToPlan,
  cancelPlayerSubscription,
  renewSubscription,
  updatePaymentMethod
} from '../../store/slices/playerMembershipSlice'
import { 
  MembershipHeader,
  CurrentSubscription,
  AvailablePlans,
  PaymentHistory,
  PaymentMethodModal
} from '../../components/player/membership'

const PlayerMembershipPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { currentSubscription, availablePlans, paymentHistory, stats, loading, error } = useSelector((state: RootState) => state.playerMembership)
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    dispatch(fetchPlayerMembershipData())
  }, [dispatch])

  const handleSubscribe = async (planId: number, billingCycle: 'monthly' | 'yearly') => {
    try {
      await dispatch(subscribeToPlan(planId, {
        payment_method: 'credit_card', // In real implementation, this would come from payment form
        billing_cycle: billingCycle
      }))
      setSuccessMessage('Successfully subscribed to plan!')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      console.error('Subscription failed:', error)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      await dispatch(cancelPlayerSubscription())
      setSuccessMessage('Subscription canceled successfully')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      console.error('Cancellation failed:', error)
    }
  }

  const handleRenewSubscription = async (planId: number, billingCycle: 'monthly' | 'yearly') => {
    try {
      await dispatch(renewSubscription(planId, {
        payment_method: 'credit_card',
        billing_cycle: billingCycle
      }))
      setSuccessMessage('Subscription renewed successfully!')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      console.error('Renewal failed:', error)
    }
  }

  const handleUpdatePaymentMethod = async (paymentData: { payment_method: string; stripe_payment_method_id?: string }) => {
    try {
      await dispatch(updatePaymentMethod(paymentData))
      setSuccessMessage('Payment method updated successfully!')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      console.error('Payment method update failed:', error)
    }
  }

  if (loading && !currentSubscription && availablePlans.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your membership information...</p>
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
          <MembershipHeader
            membershipStatus={stats.status}
            daysRemaining={stats.days_remaining}
            totalSpent={stats.total_spent}
            membershipSince={stats.membership_since}
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

        {/* Membership Benefits */}
        <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Membership Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tournament Access</h3>
              <p className="text-gray-600">Participate in federation-sanctioned tournaments and events</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Official Rankings</h3>
              <p className="text-gray-600">Track your progress with official NRTP ratings and rankings</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🤝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Access</h3>
              <p className="text-gray-600">Connect with other players and access coaching resources</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerMembershipPage