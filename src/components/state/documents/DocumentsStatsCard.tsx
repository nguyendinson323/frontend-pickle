import React from 'react'
import { DocumentsStats } from '../../../store/slices/stateDocumentsSlice'

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Documents</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total_documents.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-xs text-gray-500">
            {stats.recent_activity} new this week
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Invoices</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total_invoices.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs">
            <span className="text-green-600">Paid: {stats.invoices_by_status.paid}</span>
            <span className="text-red-600">Overdue: {stats.invoices_by_status.overdue}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Invoiced</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.financial_summary.total_invoiced)}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-xs text-green-600">
            Paid: {formatCurrency(stats.financial_summary.total_paid)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-red-100 rounded-lg">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Outstanding</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.financial_summary.total_outstanding)}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-xs text-red-600">
            Overdue: {formatCurrency(stats.financial_summary.overdue_amount)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentsStatsCard