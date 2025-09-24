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
import {
  FiCheckCircle,
  FiAlertCircle,
  FiAward,
  FiBarChart2,
  FiUsers,
  FiLoader
} from 'react-icons/fi'

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
      await dispatch(subscribeToPlan({ 
        planId, 
        paymentData: {
          payment_method: 'credit_card', // In real implementation, this would come from payment form
          billing_cycle: billingCycle
        }
      })).unwrap()
      setSuccessMessage('Successfully subscribed to plan!')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      console.error('Subscription failed:', error)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      await dispatch(cancelPlayerSubscription()).unwrap()
      setSuccessMessage('Subscription canceled successfully')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      console.error('Cancellation failed:', error)
    }
  }

  const handleRenewSubscription = async (planId: number, billingCycle: 'monthly' | 'yearly') => {
    try {
      await dispatch(renewSubscription({ 
        planId, 
        paymentData: {
          payment_method: 'credit_card',
          billing_cycle: billingCycle
        }
      })).unwrap()
      setSuccessMessage('Subscription renewed successfully!')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      console.error('Renewal failed:', error)
    }
  }

  const handleUpdatePaymentMethod = async (paymentData: { payment_method: string; stripe_payment_method_id?: string }) => {
    try {
      await dispatch(updatePaymentMethod(paymentData)).unwrap()
      setSuccessMessage('Payment method updated successfully!')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      console.error('Payment method update failed:', error)
    }
  }

  if (loading && !currentSubscription && availablePlans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiLoader className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Membership</h3>
          <p className="text-gray-600 font-medium">Getting your membership information ready...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-base font-bold text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                  <FiAlertCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-base font-bold text-red-800">{error}</p>
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
        <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-3xl border-2 border-gray-100 p-8 mt-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiAward className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Membership Benefits</h2>
            <p className="text-gray-600 font-medium">Unlock exclusive features and opportunities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiAward className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tournament Access</h3>
              <p className="text-gray-700 font-medium">Participate in federation-sanctioned tournaments and events</p>
            </div>
            <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiBarChart2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Official Rankings</h3>
              <p className="text-gray-700 font-medium">Track your progress with official NRTP ratings and rankings</p>
            </div>
            <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Access</h3>
              <p className="text-gray-700 font-medium">Connect with other players and access coaching resources</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerMembershipPage