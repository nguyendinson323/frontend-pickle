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

interface AvailablePlansProps {
  plans: SubscriptionPlan[]
  currentPlanId: number | null
  onSubscribe: (planId: number, billingCycle: 'monthly' | 'yearly') => void
}

const AvailablePlans: React.FC<AvailablePlansProps> = ({
  plans,
  currentPlanId,
  onSubscribe
}) => {
  const [selectedBilling, setSelectedBilling] = useState<{[key: number]: 'monthly' | 'yearly'}>({})

  const parseFeatures = (features: string) => {
    try {
      return JSON.parse(features) as string[]
    } catch {
      return features.split('\n').filter(Boolean)
    }
  }

  const setBillingCycle = (planId: number, cycle: 'monthly' | 'yearly') => {
    setSelectedBilling(prev => ({ ...prev, [planId]: cycle }))
  }

  const handleSubscribe = (planId: number) => {
    const billingCycle = selectedBilling[planId] || 'monthly'
    onSubscribe(planId, billingCycle)
  }

  const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyTotal = monthlyPrice * 12
    const savings = monthlyTotal - yearlyPrice
    const percentage = Math.round((savings / monthlyTotal) * 100)
    return { savings, percentage }
  }

  if (plans.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Available Plans</h2>
        <div className="text-center py-8">
          <div className="text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-gray-600">No subscription plans available at this time.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Available Membership Plans</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const features = parseFeatures(plan.features)
          const billingCycle = selectedBilling[plan.id] || 'monthly'
          const { savings, percentage } = calculateYearlySavings(plan.monthly_price, plan.yearly_price)
          const isCurrentPlan = currentPlanId === plan.id

          return (
            <div 
              key={plan.id} 
              className={`border rounded-lg p-6 relative ${
                isCurrentPlan 
                  ? 'border-indigo-500 ring-2 ring-indigo-200' 
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              {isCurrentPlan && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-indigo-600 text-white px-3 py-1 text-xs font-semibold rounded-full">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mt-1 text-sm">{plan.description}</p>
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-indigo-600">
                  ${billingCycle === 'monthly' ? plan.monthly_price : plan.yearly_price}
                </div>
                <div className="text-sm text-gray-500">
                  per {billingCycle === 'monthly' ? 'month' : 'year'}
                </div>
                {billingCycle === 'yearly' && percentage > 0 && (
                  <div className="text-xs text-green-600 mt-1">
                    Save ${savings.toFixed(2)} ({percentage}%)
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex border border-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setBillingCycle(plan.id, 'monthly')}
                    className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors duration-200 ${
                      billingCycle === 'monthly'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle(plan.id, 'yearly')}
                    className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors duration-200 ${
                      billingCycle === 'yearly'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">What's included:</h4>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrentPlan}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                  isCurrentPlan
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isCurrentPlan ? 'Current Plan' : 'Subscribe Now'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AvailablePlans