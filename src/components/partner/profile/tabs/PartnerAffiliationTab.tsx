import React from 'react'
import { AffiliationStatus } from '../../../../store/slices/partnerProfileSlice'

interface PartnerAffiliationTabProps {
  affiliationStatus: AffiliationStatus | null
}

export const PartnerAffiliationTab: React.FC<PartnerAffiliationTabProps> = ({ affiliationStatus }) => {
  if (!affiliationStatus) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  const isPremium = affiliationStatus.is_premium
  const isExpiringSoon = affiliationStatus.days_until_expiry !== null && affiliationStatus.days_until_expiry <= 30

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Affiliation Status</h3>
        {!isPremium && (
          <button
            onClick={() => window.location.href = '/partner/membership'}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Upgrade to Premium
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Current Status */}
        <div className={`rounded-lg p-6 ${isPremium ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isPremium ? 'bg-purple-100' : 'bg-gray-100'}`}>
              <svg className={`w-6 h-6 ${isPremium ? 'text-purple-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isPremium ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
            </div>
            <div className="flex-1">
              <h4 className={`text-lg font-medium mb-2 ${isPremium ? 'text-purple-900' : 'text-gray-900'}`}>
                {isPremium ? 'Premium Partner' : 'Standard Partner'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Business Name</label>
                  <p className="text-gray-900">{affiliationStatus.business_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                  <p className="text-gray-900">{new Date(affiliationStatus.member_since).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    affiliationStatus.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {affiliationStatus.status === 'active' ? 'Active' : 'Expired'}
                  </span>
                </div>
                {isPremium && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Premium Expires</label>
                    <p className="text-gray-900">
                      {affiliationStatus.premium_expires_at 
                        ? new Date(affiliationStatus.premium_expires_at).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Benefits */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Premium Benefits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h5 className="font-medium text-gray-800">🌟 Core Features</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className={`w-4 h-4 mr-2 ${isPremium ? 'text-green-500' : 'text-gray-400'}`}>✓</span>
                  Custom microsite configuration
                </li>
                <li className="flex items-center">
                  <span className={`w-4 h-4 mr-2 ${isPremium ? 'text-green-500' : 'text-gray-400'}`}>✓</span>
                  Court booking management
                </li>
                <li className="flex items-center">
                  <span className={`w-4 h-4 mr-2 ${isPremium ? 'text-green-500' : 'text-gray-400'}`}>✓</span>
                  Tournament creation & management
                </li>
                <li className="flex items-center">
                  <span className={`w-4 h-4 mr-2 ${isPremium ? 'text-green-500' : 'text-gray-400'}`}>✓</span>
                  Online payment processing
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="font-medium text-gray-800">📊 Analytics & Tools</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className={`w-4 h-4 mr-2 ${isPremium ? 'text-green-500' : 'text-gray-400'}`}>✓</span>
                  Advanced statistics & reporting
                </li>
                <li className="flex items-center">
                  <span className={`w-4 h-4 mr-2 ${isPremium ? 'text-green-500' : 'text-gray-400'}`}>✓</span>
                  Revenue tracking & analytics
                </li>
                <li className="flex items-center">
                  <span className={`w-4 h-4 mr-2 ${isPremium ? 'text-green-500' : 'text-gray-400'}`}>✓</span>
                  Customer management tools
                </li>
                <li className="flex items-center">
                  <span className={`w-4 h-4 mr-2 ${isPremium ? 'text-green-500' : 'text-gray-400'}`}>✓</span>
                  Priority support
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Expiry Warning */}
        {isPremium && isExpiringSoon && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Premium Membership Expiring Soon
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Your premium membership expires in {affiliationStatus.days_until_expiry} days 
                    ({affiliationStatus.premium_expires_at && new Date(affiliationStatus.premium_expires_at).toLocaleDateString()}). 
                    Renew now to avoid interruption of services.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.href = '/partner/membership'}
                    className="bg-yellow-100 px-3 py-2 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                  >
                    Renew Membership
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade CTA for Standard Members */}
        {!isPremium && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-semibold mb-2">Upgrade to Premium</h4>
                <p className="text-purple-100 mb-4">
                  Unlock all features including microsite customization, tournament management, 
                  and revenue tracking tools.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span>✨ Advanced Analytics</span>
                  <span>🏆 Tournament Tools</span>
                  <span>💰 Revenue Management</span>
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => window.location.href = '/partner/membership'}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Upgrade Now
                </button>
                <p className="text-purple-100 text-sm mt-2">Starting at $29/month</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment History */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Payment History</h4>
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No payment history available</p>
            <p className="text-sm text-gray-400 mt-1">Payment records will appear here once available</p>
          </div>
        </div>
      </div>
    </div>
  )
}