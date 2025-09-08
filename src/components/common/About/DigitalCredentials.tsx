import React from 'react'

const DigitalCredentials: React.FC = () => {
  const features = [
    'Official federation identification',
    'QR code for instant verification',
    'Real-time status updates',
    'Tournament eligibility confirmation',
    'Ranking and skill level display',
    'Affiliation status tracking'
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Digital Credentials & QR Verification
            </h2>
            <p className="text-xl text-indigo-100 mb-6">
              Every registered member receives official digital credentials that serve as their 
              identification within the federation. These credentials can be used to verify 
              status during tournaments, training sessions, and other official events.
            </p>
            <ul className="space-y-3">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 inline-block">
              <div className="bg-white text-gray-900 rounded-lg p-6 max-w-sm">
                <h3 className="font-bold text-lg mb-2">Digital credential</h3>
                <div className="border-2 border-gray-200 rounded p-4 mb-4">
                  <div className="w-24 h-24 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
                    <span className="text-xs">QR Code</span>
                  </div>
                  <p className="text-sm font-semibold">Player Name</p>
                  <p className="text-xs text-gray-600">NRTP Level 3.5</p>
                  <p className="text-xs text-gray-600">Active Member</p>
                </div>
                <p className="text-xs text-gray-500">Scan for verification</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DigitalCredentials