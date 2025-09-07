import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const PaymentsMemberships: React.FC = () => {
  const { payments, subscriptions, loading } = useSelector((state: RootState) => state.admin)
  const [activeTab, setActiveTab] = useState<'payments' | 'memberships'>('payments')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')

  if (loading) {
    return <div className="p-4">Loading financial data...</div>
  }

  const paymentStats = {
    totalRevenue: payments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
    completedPayments: payments.filter(p => p.status === 'completed').length,
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    failedPayments: payments.filter(p => p.status === 'failed').length,
    refundedPayments: payments.filter(p => p.status === 'refunded').length,
    thisMonthRevenue: payments
      .filter(p => new Date(p.transaction_date).getMonth() === new Date().getMonth())
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
  }

  const membershipStats = {
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
    expiredSubscriptions: subscriptions.filter(s => s.status === 'expired').length,
    canceledSubscriptions: subscriptions.filter(s => s.status === 'canceled').length,
    premiumUsers: subscriptions.filter(s => s.subscription_plan?.name?.includes('Premium')).length
  }

  const filteredPayments = payments.filter(payment => {
    if (selectedStatus && payment.status !== selectedStatus) return false
    if (selectedType && payment.payment_type !== selectedType) return false
    return true
  })

  const filteredSubscriptions = subscriptions.filter(subscription => {
    if (selectedStatus && subscription.status !== selectedStatus) return false
    return true
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payments & Memberships</h2>
          <p className="text-gray-600">Financial overview and membership management</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <span>📊</span>
            <span>Export Report</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <span>💳</span>
            <span>Process Refund</span>
          </button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-green-600">💰</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                ${paymentStats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-blue-600">📈</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                ${paymentStats.thisMonthRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-green-600">✅</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-900">{paymentStats.completedPayments}</div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-yellow-600">⏳</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-yellow-900">{paymentStats.pendingPayments}</div>
              <div className="text-sm text-yellow-700">Pending</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-red-600">❌</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-red-900">{paymentStats.failedPayments}</div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600">Active Subscriptions</div>
          <div className="text-2xl font-bold text-blue-900">{membershipStats.activeSubscriptions}</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-600">Premium Users</div>
          <div className="text-2xl font-bold text-purple-900">{membershipStats.premiumUsers}</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-sm text-orange-600">Expired</div>
          <div className="text-2xl font-bold text-orange-900">{membershipStats.expiredSubscriptions}</div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-sm text-red-600">Canceled</div>
          <div className="text-2xl font-bold text-red-900">{membershipStats.canceledSubscriptions}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              💳 Payments ({payments.length})
            </button>
            <button
              onClick={() => setActiveTab('memberships')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'memberships'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              👥 Memberships ({subscriptions.length})
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                {activeTab === 'payments' ? (
                  <>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </>
                ) : (
                  <>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="canceled">Canceled</option>
                  </>
                )}
              </select>
            </div>
            
            {activeTab === 'payments' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="affiliation">Affiliation</option>
                  <option value="premium">Premium</option>
                  <option value="tournament">Tournament</option>
                  <option value="court_rental">Court Rental</option>
                </select>
              </div>
            )}
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedStatus('')
                  setSelectedType('')
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'payments' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments && filteredPayments.length > 0 ? filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.user?.username || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.user?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${payment.amount} {payment.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {payment.payment_type || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {payment.payment_method || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : payment.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      View
                    </button>
                    {payment.status === 'completed' && (
                      <button className="text-red-600 hover:text-red-900">
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auto Renew
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions && filteredSubscriptions.length > 0 ? filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subscription.user?.username || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {subscription.user?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subscription.subscription_plan?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${subscription.subscription_plan?.price || 0}/{subscription.subscription_plan?.billing_cycle || 'month'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      subscription.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : subscription.status === 'expired'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {subscription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscription.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscription.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subscription.auto_renew ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      View
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-900">
                      Extend
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No subscriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default PaymentsMemberships