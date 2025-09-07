import React from 'react'

interface CallToActionProps {
  onRegisterClick: () => void
}

const CallToAction: React.FC<CallToActionProps> = ({ onRegisterClick }) => {
  return (
    <div className="py-24 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-8">
          Ready to Join the Mexican Pickleball Community?
        </h2>
        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
          Whether you're a player, coach, club owner, or business partner, 
          there's a place for you in our growing federation. Join thousands of 
          pickleball enthusiasts across Mexico and be part of something amazing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🏓</div>
            <h3 className="font-semibold mb-2 text-yellow-400">Players</h3>
            <p className="text-sm text-gray-400">Compete, improve, and connect with fellow players</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">👨‍🏫</div>
            <h3 className="font-semibold mb-2 text-yellow-400">Coaches</h3>
            <p className="text-sm text-gray-400">Get certified and grow your coaching business</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🏢</div>
            <h3 className="font-semibold mb-2 text-yellow-400">Clubs</h3>
            <p className="text-sm text-gray-400">Host tournaments and build local communities</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="font-semibold mb-2 text-yellow-400">Partners</h3>
            <p className="text-sm text-gray-400">Support the sport and grow with the community</p>
          </div>
        </div>

        <div className="space-y-6">
          <button
            onClick={onRegisterClick}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold py-4 px-12 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Your Registration
          </button>
          
          <div className="text-gray-400 text-sm">
            <p>✓ Quick and easy registration process</p>
            <p>✓ Choose your membership type during signup</p>
            <p>✓ Instant access to federation resources</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 pt-12 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-white mb-2">Email Us</h4>
              <p className="text-gray-400 text-sm">info@mexicanpickleball.org</p>
            </div>
            
            <div>
              <div className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h4 className="font-semibold text-white mb-2">Call Us</h4>
              <p className="text-gray-400 text-sm">+52 55 1234-5678</p>
            </div>
            
            <div>
              <div className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-white mb-2">Visit Us</h4>
              <p className="text-gray-400 text-sm">Mexico City, CDMX</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallToAction