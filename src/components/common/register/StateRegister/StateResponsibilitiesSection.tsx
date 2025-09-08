import React from 'react'

const StateResponsibilitiesSection: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start">
        <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 className="font-semibold text-blue-900 mb-2">State Committee Responsibilities & Benefits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h5 className="font-semibold mb-1">Responsibilities:</h5>
              <ul className="space-y-1">
                <li>• Manage state-wide pickleball development</li>
                <li>• Organize regional tournaments and championships</li>
                <li>• Oversee club and player registrations in your state</li>
                <li>• Coordinate with the national federation</li>
                <li>• Promote pickleball growth and participation</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-1">Benefits:</h5>
              <ul className="space-y-1">
                <li>• State management dashboard and tools</li>
                <li>• Official state microsite</li>
                <li>• Player oversight and ranking system access</li>
                <li>• Tournament organization platform</li>
                <li>• Committee administration features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StateResponsibilitiesSection