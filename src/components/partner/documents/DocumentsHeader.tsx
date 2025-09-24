import React from 'react'
import { DocumentsStats } from '../../../store/slices/partnerDocumentsSlice'
import {
  FiFileText,
  FiEdit,
  FiAlertCircle,
  FiDollarSign,
  FiUpload,
  FiFile
} from 'react-icons/fi'

interface DocumentsHeaderProps {
  stats: DocumentsStats | null
  onUploadDocument: () => void
  loading: boolean
}

const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({
  stats,
  onUploadDocument,
  loading
}) => {
  const StatCard: React.FC<{
    title: string
    value: number | string
    icon: React.ReactNode
    color: string
    bgColor: string
    borderColor: string
    subtitle?: string
  }> = ({ title, value, icon, color, bgColor, borderColor, subtitle }) => (
    <div className={`bg-gradient-to-br ${bgColor} border ${borderColor} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 shadow-md`}>
      <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-sm font-bold text-gray-700">{title}</div>
      {subtitle && (
        <div className="text-xs font-medium text-gray-600 mt-1">{subtitle}</div>
      )}
    </div>
  )

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="flex items-center mb-4 lg:mb-0">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
            <FiFile className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents & Invoices</h1>
            <p className="text-gray-600 font-medium">
              Manage your contracts, agreements, and billing information
            </p>
          </div>
        </div>

        <div className="mt-4 lg:mt-0">
          <button
            onClick={onUploadDocument}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <FiUpload className="w-5 h-5 mr-2" />
            Upload Document
          </button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Documents"
            value={stats.total_documents}
            icon={<FiFileText className="w-8 h-8" />}
            color="from-blue-600 to-indigo-700"
            bgColor="from-blue-50 to-indigo-50"
            borderColor="border-blue-200"
          />

          <StatCard
            title="Pending Signatures"
            value={stats.pending_signatures}
            icon={<FiEdit className="w-8 h-8" />}
            color="from-green-600 to-emerald-700"
            bgColor="from-green-50 to-emerald-50"
            borderColor="border-green-200"
          />

          <StatCard
            title="Expiring Soon"
            value={stats.expiring_soon}
            subtitle="next 30 days"
            icon={<FiAlertCircle className="w-8 h-8" />}
            color="from-yellow-600 to-orange-700"
            bgColor="from-yellow-50 to-orange-50"
            borderColor="border-yellow-200"
          />

          <StatCard
            title="Outstanding Invoices"
            value={stats.pending_invoices + stats.overdue_invoices}
            subtitle={`$${(stats.total_invoice_amount - stats.paid_invoice_amount).toLocaleString()}`}
            icon={<FiDollarSign className="w-8 h-8" />}
            color="from-red-600 to-pink-700"
            bgColor="from-red-50 to-pink-50"
            borderColor="border-red-200"
          />
        </div>
      )}
    </div>
  )
}

export default DocumentsHeader