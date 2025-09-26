import React from 'react'
import { DocumentsStats } from '../../../store/slices/stateDocumentsSlice'
import { FiFileText, FiDollarSign, FiAlertCircle, FiTrendingUp, FiEye, FiLock, FiUsers, FiClock, FiCheckCircle, FiActivity } from 'react-icons/fi'

interface DocumentsStatsCardProps {
  stats: DocumentsStats | null
}

const DocumentsStatsCard: React.FC<DocumentsStatsCardProps> = ({ stats }) => {
  if (!stats) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      {/* Total Documents Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-2xl border-2 border-blue-200/50 p-8 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-xl">
            <FiFileText className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center space-x-2 bg-white/60 rounded-2xl px-3 py-2 backdrop-blur-sm">
            <FiActivity className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-700">Active</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-blue-700 mb-2">Total Documents</p>
          <p className="text-4xl font-bold text-blue-900 mb-4">{stats.total_documents.toLocaleString()}</p>
          <div className="flex items-center space-x-2 bg-blue-600/10 rounded-2xl px-4 py-2">
            <FiTrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-blue-700">
              +{stats.recent_activity} this week
            </span>
          </div>
        </div>
      </div>

      {/* Total Invoices Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl shadow-2xl border-2 border-green-200/50 p-8 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl">
            <FiDollarSign className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center space-x-2 bg-white/60 rounded-2xl px-3 py-2 backdrop-blur-sm">
            <FiFileText className="w-4 h-4 text-green-600" />
            <span className="text-xs font-bold text-green-700">Billing</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-green-700 mb-2">Total Invoices</p>
          <p className="text-4xl font-bold text-green-900 mb-4">{stats.total_invoices.toLocaleString()}</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2 bg-green-600/10 rounded-2xl px-3 py-2">
              <FiCheckCircle className="w-3 h-3 text-green-600" />
              <div>
                <span className="text-xs font-bold text-green-700">Paid</span>
                <p className="text-sm font-bold text-green-900">{stats.invoices_by_status.paid}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-red-600/10 rounded-2xl px-3 py-2">
              <FiClock className="w-3 h-3 text-red-600" />
              <div>
                <span className="text-xs font-bold text-red-700">Overdue</span>
                <p className="text-sm font-bold text-red-900">{stats.invoices_by_status.overdue}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Invoiced Card */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-3xl shadow-2xl border-2 border-yellow-200/50 p-8 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl flex items-center justify-center shadow-xl">
            <FiDollarSign className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center space-x-2 bg-white/60 rounded-2xl px-3 py-2 backdrop-blur-sm">
            <FiTrendingUp className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-bold text-yellow-700">Revenue</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-yellow-700 mb-2">Total Invoiced</p>
          <p className="text-3xl font-bold text-yellow-900 mb-4">{formatCurrency(stats.financial_summary.total_invoiced)}</p>
          <div className="bg-green-600/10 rounded-2xl px-4 py-3">
            <div className="flex items-center space-x-2 mb-1">
              <FiCheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-bold text-green-700">Paid Amount</span>
            </div>
            <p className="text-lg font-bold text-green-900">
              {formatCurrency(stats.financial_summary.total_paid)}
            </p>
          </div>
        </div>
      </div>

      {/* Outstanding Amount Card */}
      <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-3xl shadow-2xl border-2 border-red-200/50 p-8 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl">
            <FiAlertCircle className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center space-x-2 bg-white/60 rounded-2xl px-3 py-2 backdrop-blur-sm">
            <FiClock className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-red-700">Pending</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-red-700 mb-2">Outstanding</p>
          <p className="text-3xl font-bold text-red-900 mb-4">{formatCurrency(stats.financial_summary.total_outstanding)}</p>
          <div className="bg-red-600/10 rounded-2xl px-4 py-3">
            <div className="flex items-center space-x-2 mb-1">
              <FiAlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-bold text-red-700">Overdue Amount</span>
            </div>
            <p className="text-lg font-bold text-red-900">
              {formatCurrency(stats.financial_summary.overdue_amount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentsStatsCard