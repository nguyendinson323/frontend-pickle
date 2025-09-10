import React from 'react'
import { useNavigate } from 'react-router-dom'

export const PartnerManagementTab: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Tournament & Court Management</h3>
        <button
          onClick={() => navigate('/partner/management')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Access Management Tools
        </button>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-medium text-indigo-900 mb-2">Management Center</h4>
            <p className="text-indigo-700 mb-4">
              Manage your courts, tournaments, events, and reservations from a centralized dashboard. 
              Create tournaments, schedule events, and track facility utilization.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Court Management</h5>
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Add/edit court details</li>
                  <li>• Set availability schedules</li>
                  <li>• Configure pricing tiers</li>
                  <li>• Manage court amenities</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Tournament Creation</h5>
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Create tournament brackets</li>
                  <li>• Set registration deadlines</li>
                  <li>• Configure entry fees</li>
                  <li>• Manage participants</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Reservation System</h5>
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Online booking system</li>
                  <li>• Calendar management</li>
                  <li>• Payment processing</li>
                  <li>• Confirmation emails</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Event Scheduling</h5>
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Schedule private events</li>
                  <li>• Corporate bookings</li>
                  <li>• League management</li>
                  <li>• Recurring events</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Revenue Tracking</h5>
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Financial reporting</li>
                  <li>• Revenue analytics</li>
                  <li>• Payment tracking</li>
                  <li>• Commission management</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Customer Management</h5>
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Customer database</li>
                  <li>• Booking history</li>
                  <li>• Communication tools</li>
                  <li>• Loyalty programs</li>
                </ul>
              </div>
            </div>

            <div className="bg-indigo-100 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0h-2m9-6h2m-2 0h2m-2 0v2m0-2v-2M9 3v2m0 0v2M9 5h2M9 5H7m6 5a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-indigo-900">Premium Management Features</span>
              </div>
              <p className="text-indigo-800 text-sm">
                Access advanced management tools with a premium membership. Create tournaments, 
                manage multiple courts, and track revenue with comprehensive analytics and reporting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <h5 className="font-medium text-gray-900 mb-2">🏆 Tournament Features</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Single/double elimination brackets</li>
                  <li>• Round-robin tournaments</li>
                  <li>• Automatic seeding and matchmaking</li>
                  <li>• Live scoring and updates</li>
                  <li>• Prize money distribution</li>
                  <li>• Registration management</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <h5 className="font-medium text-gray-900 mb-2">⚙️ Advanced Tools</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Multi-court scheduling</li>
                  <li>• Automated notifications</li>
                  <li>• Integration with payment systems</li>
                  <li>• Custom reporting dashboards</li>
                  <li>• API access for third-party tools</li>
                  <li>• Bulk operations and imports</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/partner/management')}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Access Management Center
              </button>
              <button
                onClick={() => navigate('/partner/management/tournaments')}
                className="inline-flex items-center px-4 py-2 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Tournament
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}