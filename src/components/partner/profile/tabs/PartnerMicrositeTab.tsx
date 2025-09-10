import React from 'react'
import { useNavigate } from 'react-router-dom'

export const PartnerMicrositeTab: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Microsite Configuration</h3>
        <button
          onClick={() => navigate('/partner/microsite')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Configure Microsite
        </button>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-medium text-purple-900 mb-2">Partner Microsite</h4>
            <p className="text-purple-700 mb-4">
              Create and customize your partner microsite where athletes can discover your facilities, 
              reserve courts, and register for tournaments. Your microsite is your digital presence 
              within the federation platform.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h5 className="font-medium text-gray-900 mb-2">🎨 Customization Features</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Custom banners and logos</li>
                  <li>• Brand colors and themes</li>
                  <li>• Business information display</li>
                  <li>• Contact details and location</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h5 className="font-medium text-gray-900 mb-2">🏟️ Court & Tournament Features</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Display available courts</li>
                  <li>• Show upcoming tournaments</li>
                  <li>• Enable online reservations</li>
                  <li>• Tournament registration forms</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h5 className="font-medium text-gray-900 mb-2">📄 Content Management</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Create custom pages</li>
                  <li>• Add facility descriptions</li>
                  <li>• Photo galleries</li>
                  <li>• News and announcements</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h5 className="font-medium text-gray-900 mb-2">💰 Revenue Features</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Online payment processing</li>
                  <li>• Booking confirmations</li>
                  <li>• Revenue tracking</li>
                  <li>• Customer management</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-100 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0h-2m9-6h2m-2 0h2m-2 0v2m0-2v-2M9 3v2m0 0v2M9 5h2M9 5H7m6 5a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-purple-900">Premium Feature</span>
              </div>
              <p className="text-purple-800 text-sm">
                The microsite feature requires a premium membership. Upgrade your account to unlock 
                the full potential of your partner presence and start generating revenue through the platform.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/partner/microsite')}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage Microsite
              </button>
              <button
                onClick={() => window.open('/partner/microsite/preview', '_blank')}
                className="inline-flex items-center px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview Site
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}