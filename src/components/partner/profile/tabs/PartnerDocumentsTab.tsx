import React from 'react'
import { useNavigate } from 'react-router-dom'

export const PartnerDocumentsTab: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Documents & Invoices</h3>
        <button
          onClick={() => navigate('/partner/documents')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Manage Documents
        </button>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-medium text-orange-900 mb-2">Document Management Center</h4>
            <p className="text-orange-700 mb-4">
              Upload, download, and manage important documents including contracts, invoices, 
              agreements, and official federation paperwork.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-orange-100">
                <h5 className="font-medium text-gray-900 mb-2">📄 Document Types</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Partnership agreements</li>
                  <li>• Service contracts</li>
                  <li>• Insurance certificates</li>
                  <li>• Business licenses</li>
                  <li>• Tax documentation</li>
                  <li>• Safety certifications</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-orange-100">
                <h5 className="font-medium text-gray-900 mb-2">🧾 Invoice Management</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Monthly membership fees</li>
                  <li>• Premium subscription</li>
                  <li>• Tournament fees</li>
                  <li>• Platform commissions</li>
                  <li>• Payment history</li>
                  <li>• Download receipts</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-orange-100 text-center">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h6 className="font-medium text-gray-900">Upload Documents</h6>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG formats</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-orange-100 text-center">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h6 className="font-medium text-gray-900">Digital Signatures</h6>
                <p className="text-xs text-gray-500 mt-1">Sign documents online</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-orange-100 text-center">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h6 className="font-medium text-gray-900">Download Center</h6>
                <p className="text-xs text-gray-500 mt-1">Access all files</p>
              </div>
            </div>

            <div className="bg-orange-100 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium text-orange-900">Document Security</span>
              </div>
              <p className="text-orange-800 text-sm">
                All documents are encrypted and stored securely. Access is logged for audit purposes. 
                Share documents safely with federation administrators when required.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/partner/documents')}
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Access Document Center
              </button>
              <button
                onClick={() => navigate('/partner/documents?tab=invoices')}
                className="inline-flex items-center px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                View Invoices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}