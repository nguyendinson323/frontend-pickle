import React from 'react'
import { FiFileText, FiPlus, FiDollarSign, FiLayers, FiUsers, FiTrendingUp, FiActivity, FiFile } from 'react-icons/fi'

interface DocumentsHeaderProps {
  activeTab: 'documents' | 'invoices' | 'templates'
  setActiveTab: (tab: 'documents' | 'invoices' | 'templates') => void
  onUploadDocument: () => void
  onCreateInvoice: () => void
  onCreateTemplate: () => void
}

const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({
  activeTab,
  setActiveTab,
  onUploadDocument,
  onCreateInvoice,
  onCreateTemplate
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-2xl border-2 border-gray-200/50 mb-8 backdrop-blur-sm">
      <div className="p-8 border-b-2 border-gray-200/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <FiLayers className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-2">
                Documents & Invoices
              </h1>
              <p className="text-gray-600 text-lg font-medium">Manage documents, invoices, and templates with advanced features</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            {activeTab === 'documents' && (
              <button
                onClick={onUploadDocument}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <FiPlus className="w-5 h-5 mr-3" />
                Upload Document
              </button>
            )}
            {activeTab === 'invoices' && (
              <button
                onClick={onCreateInvoice}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <FiDollarSign className="w-5 h-5 mr-3" />
                Create Invoice
              </button>
            )}
            {activeTab === 'templates' && (
              <button
                onClick={onCreateTemplate}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <FiFile className="w-5 h-5 mr-3" />
                Create Template
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-8 py-4">
        <nav className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center space-x-3 px-8 py-4 font-bold text-sm rounded-3xl transition-all duration-300 shadow-lg transform hover:scale-105 ${
              activeTab === 'documents'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl'
                : 'bg-white text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 border-2 border-gray-200 hover:border-blue-200'
            }`}
          >
            <FiFileText className={`w-5 h-5 ${
              activeTab === 'documents' ? 'text-white' : 'text-blue-600'
            }`} />
            <span>Documents</span>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              activeTab === 'documents'
                ? 'bg-white/20 text-white'
                : 'bg-blue-100 text-blue-700'
            }`}>
              <FiActivity className="w-3 h-3 inline mr-1" />
              Active
            </div>
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center space-x-3 px-8 py-4 font-bold text-sm rounded-3xl transition-all duration-300 shadow-lg transform hover:scale-105 ${
              activeTab === 'invoices'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl'
                : 'bg-white text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 border-2 border-gray-200 hover:border-green-200'
            }`}
          >
            <FiDollarSign className={`w-5 h-5 ${
              activeTab === 'invoices' ? 'text-white' : 'text-green-600'
            }`} />
            <span>Invoices</span>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              activeTab === 'invoices'
                ? 'bg-white/20 text-white'
                : 'bg-green-100 text-green-700'
            }`}>
              <FiTrendingUp className="w-3 h-3 inline mr-1" />
              Billing
            </div>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center space-x-3 px-8 py-4 font-bold text-sm rounded-3xl transition-all duration-300 shadow-lg transform hover:scale-105 ${
              activeTab === 'templates'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl'
                : 'bg-white text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-700 border-2 border-gray-200 hover:border-purple-200'
            }`}
          >
            <FiFile className={`w-5 h-5 ${
              activeTab === 'templates' ? 'text-white' : 'text-purple-600'
            }`} />
            <span>Templates</span>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              activeTab === 'templates'
                ? 'bg-white/20 text-white'
                : 'bg-purple-100 text-purple-700'
            }`}>
              <FiUsers className="w-3 h-3 inline mr-1" />
              Shared
            </div>
          </button>
        </nav>
      </div>
    </div>
  )
}

export default DocumentsHeader