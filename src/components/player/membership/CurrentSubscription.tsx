import React, { useState } from 'react'

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
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Current Subscription</h2>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            <div className="text-4xl mb-2">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
            <p className="text-gray-600">You don't have an active membership subscription.</p>
          </div>
        </div>
      </div>
    )
  }

  const features = parseFeatures(subscription.plan.features)

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Current Subscription</h2>
      
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{subscription.plan.name}</h3>
            <p className="text-gray-600 mt-1">{subscription.plan.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">
              ${subscription.plan.monthly_price}/month
            </div>
            <div className="text-sm text-gray-500">
              or ${subscription.plan.yearly_price}/year
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <div className="text-gray-900">{formatDate(subscription.start_date)}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <div className="text-gray-900">{formatDate(subscription.end_date)}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              subscription.status === 'active' 
                ? 'bg-green-100 text-green-800'
                : subscription.status === 'canceled'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Auto Renewal</label>
            <div className="text-gray-900">{subscription.auto_renew ? 'Enabled' : 'Disabled'}</div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Features Included:</h4>
          <ul className="space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          {subscription.status === 'active' && (
            <>
              <button
                onClick={onUpdatePaymentMethod}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Update Payment Method
              </button>
              
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Cancel Subscription
              </button>
            </>
          )}

          {(subscription.status === 'canceled' || subscription.status === 'expired') && (
            <div className="flex items-center space-x-4">
              <select
                value={renewalCycle}
                onChange={(e) => setRenewalCycle(e.target.value as 'monthly' | 'yearly')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="monthly">Monthly Billing</option>
                <option value="yearly">Yearly Billing</option>
              </select>
              
              <button
                onClick={handleRenew}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
              >
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