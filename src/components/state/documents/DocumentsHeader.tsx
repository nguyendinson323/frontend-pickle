import React from 'react'

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
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documents & Invoices</h1>
            <p className="text-gray-600 mt-1">Manage documents, invoices, and templates</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            {activeTab === 'documents' && (
              <button
                onClick={onUploadDocument}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Document
              </button>
            )}
            {activeTab === 'invoices' && (
              <button
                onClick={onCreateInvoice}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Invoice
              </button>
            )}
            {activeTab === 'templates' && (
              <button
                onClick={onCreateTemplate}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Template
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-6 py-0">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'invoices'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Invoices
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Templates
          </button>
        </nav>
      </div>
    </div>
  )
}

export default DocumentsHeader