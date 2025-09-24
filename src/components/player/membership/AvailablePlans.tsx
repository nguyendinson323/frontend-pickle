import React, { useState } from 'react'
import {
  FiCheck,
  FiPackage,
  FiStar,
  FiCreditCard,
  FiCalendar,
  FiDollarSign,
  FiGift,
  FiZap
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
      <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-3xl border-2 border-gray-100 p-8 mb-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiPackage className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Plans</h2>
        </div>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiPackage className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No Plans Available</h3>
          <p className="text-gray-600 font-medium">No subscription plans available at this time.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-3xl border-2 border-gray-100 p-8 mb-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FiPackage className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Membership Plans</h2>
        <p className="text-gray-600 font-medium">Choose the perfect plan for your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const features = parseFeatures(plan.features)
          const billingCycle = selectedBilling[plan.id] || 'monthly'
          const { savings, percentage } = calculateYearlySavings(plan.monthly_price, plan.yearly_price)
          const isCurrentPlan = currentPlanId === plan.id

          return (
            <div
              key={plan.id}
              className={`bg-gradient-to-br from-white to-gray-50 border-2 rounded-3xl p-8 relative transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105 ${
                isCurrentPlan
                  ? 'border-indigo-400 ring-2 ring-indigo-200 shadow-lg'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              {isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg flex items-center">
                    <FiStar className="w-4 h-4 mr-2" />
                    Current Plan
                  </div>
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mt-1 text-sm">{plan.description}</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-3">
                  <FiDollarSign className="w-6 h-6 text-indigo-600 mr-2" />
                  <div className="text-4xl font-bold text-indigo-600">
                    {billingCycle === 'monthly' ? plan.monthly_price : plan.yearly_price}
                  </div>
                </div>
                <div className="text-base font-medium text-gray-600">
                  per {billingCycle === 'monthly' ? 'month' : 'year'}
                </div>
                {billingCycle === 'yearly' && percentage > 0 && (
                  <div className="inline-flex items-center mt-2 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-full">
                    <FiGift className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-sm font-bold text-green-700">
                      Save ${savings.toFixed(2)} ({percentage}%)
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <div className="bg-gray-100 rounded-2xl p-2 border border-gray-200">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => setBillingCycle(plan.id, 'monthly')}
                      className={`flex items-center justify-center py-3 px-4 text-sm font-bold rounded-xl transition-all duration-300 ${
                        billingCycle === 'monthly'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                      }`}
                    >
                      <FiCalendar className="w-4 h-4 mr-2" />
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle(plan.id, 'yearly')}
                      className={`flex items-center justify-center py-3 px-4 text-sm font-bold rounded-xl transition-all duration-300 ${
                        billingCycle === 'yearly'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                      }`}
                    >
                      <FiZap className="w-4 h-4 mr-2" />
                      Yearly
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center">
                  <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                  What's included:
                </h4>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start bg-green-50 border border-green-200 rounded-2xl p-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <FiCheck className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrentPlan}
                className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center ${
                  isCurrentPlan
                    ? 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl hover:transform hover:scale-105'
                }`}
              >
                {isCurrentPlan ? (
                  <>
                    <FiCheck className="w-5 h-5 mr-2" />
                    Current Plan
                  </>
                ) : (
                  <>
                    <FiCreditCard className="w-5 h-5 mr-2" />
                    Subscribe Now
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AvailablePlans