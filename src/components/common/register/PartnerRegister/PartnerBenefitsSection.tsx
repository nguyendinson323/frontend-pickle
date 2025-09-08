import React from 'react'

const PartnerBenefitsSection: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start">
        <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 className="font-semibold text-blue-900 mb-2">Partner Benefits & Features</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Court rental management system</li>
            <li>• Event hosting and tournament organization</li>
            <li>• Business microsite with federation integration</li>
            <li>• Revenue tracking and reporting tools</li>
            <li>• Partner directory listing and promotion</li>
            <li>• Access to federation player database</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PartnerBenefitsSection