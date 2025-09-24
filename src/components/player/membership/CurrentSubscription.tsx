import React, { useState } from 'react'
import {
  FiCheckCircle,
  FiX,
  FiCalendar,
  FiDollarSign,
  FiRefreshCw,
  FiCreditCard,
  FiClipboard
} from 'react-icons/fi'

interface SubscriptionPlan {
  id: number
  name: string
  description: string
  for_role: string
  monthly_price: number
  yearly_price: number
  features: string
  is_active: boolean
  created_at: string
}

interface Subscription {
  id: number
  user_id: number
  plan_id: number
  start_date: string
  end_date: string
  status: 'active' | 'canceled' | 'expired'
  auto_renew: boolean
  stripe_subscription_id: string | null
  payment_id: number | null
  created_at: string
  updated_at: string
  plan: SubscriptionPlan
}

interface CurrentSubscriptionProps {
  subscription: Subscription | null
  onCancel: () => void
  onRenew: (planId: number, billingCycle: 'monthly' | 'yearly') => void
  onUpdatePaymentMethod: () => void
}

const CurrentSubscription: React.FC<CurrentSubscriptionProps> = ({
  subscription,
  onCancel,
  onRenew,
  onUpdatePaymentMethod
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [renewalCycle, setRenewalCycle] = useState<'monthly' | 'yearly'>('monthly')

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const parseFeatures = (features: string) => {
    try {
      return JSON.parse(features) as string[]
    } catch {
      return features.split('\n').filter(Boolean)
    }
  }

  const handleCancel = () => {
    onCancel()
    setShowCancelConfirm(false)
  }

  const handleRenew = () => {
    if (subscription) {
      onRenew(subscription.plan_id, renewalCycle)
    }
  }

  if (!subscription) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mr-4">
            <FiClipboard className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Current Subscription</h2>
        </div>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiClipboard className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No Active Subscription</h3>
          <p className="text-gray-600 font-medium">You don't have an active membership subscription.</p>
        </div>
      </div>
    )
  }

  const features = parseFeatures(subscription.plan.features)

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8 mb-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center mr-4">
          <FiCheckCircle className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Current Subscription</h2>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
          <div className="mb-4 lg:mb-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{subscription.plan.name}</h3>
            <p className="text-gray-600 font-medium">{subscription.plan.description}</p>
          </div>
          <div className="text-right bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
            <div className="text-3xl font-bold text-indigo-600 mb-1">
              ${subscription.plan.monthly_price}/month
            </div>
            <div className="text-sm font-medium text-gray-500">
              or ${subscription.plan.yearly_price}/year
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center mb-2">
              <FiCalendar className="w-5 h-5 text-blue-500 mr-2" />
              <label className="text-sm font-bold text-gray-700">Start Date</label>
            </div>
            <div className="text-lg font-bold text-gray-900">{formatDate(subscription.start_date)}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center mb-2">
              <FiCalendar className="w-5 h-5 text-red-500 mr-2" />
              <label className="text-sm font-bold text-gray-700">End Date</label>
            </div>
            <div className="text-lg font-bold text-gray-900">{formatDate(subscription.end_date)}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center mb-2">
              <FiCheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <label className="text-sm font-bold text-gray-700">Status</label>
            </div>
            <div className={`inline-flex px-3 py-1 text-sm font-bold rounded-full border ${
              subscription.status === 'active'
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-200 text-green-800'
                : subscription.status === 'canceled'
                ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-200 text-yellow-800'
                : 'bg-gradient-to-r from-red-100 to-pink-100 border-red-200 text-red-800'
            }`}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center mb-2">
              <FiRefreshCw className="w-5 h-5 text-purple-500 mr-2" />
              <label className="text-sm font-bold text-gray-700">Auto Renewal</label>
            </div>
            <div className="text-lg font-bold text-gray-900">{subscription.auto_renew ? 'Enabled' : 'Disabled'}</div>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Features Included:</h4>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm font-medium text-gray-700">
                  <FiCheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {subscription.status === 'active' && (
            <>
              <button
                onClick={onUpdatePaymentMethod}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
              >
                <FiCreditCard className="w-5 h-5 mr-2" />
                Update Payment Method
              </button>

              <button
                onClick={() => setShowCancelConfirm(true)}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
              >
                <FiX className="w-5 h-5 mr-2" />
                Cancel Subscription
              </button>
            </>
          )}

          {(subscription.status === 'canceled' || subscription.status === 'expired') && (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <select
                value={renewalCycle}
                onChange={(e) => setRenewalCycle(e.target.value as 'monthly' | 'yearly')}
                className="px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold text-gray-900"
              >
                <option value="monthly">Monthly Billing</option>
                <option value="yearly">Yearly Billing</option>
              </select>

              <button
                onClick={handleRenew}
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
              >
                <FiRefreshCw className="w-5 h-5 mr-2" />
                Renew Subscription
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Subscription</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CurrentSubscription