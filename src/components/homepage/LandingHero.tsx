import React from 'react'

interface LandingHeroProps {
  onRegisterClick: () => void
  onExploreClick: (page: string) => void
}

const LandingHero: React.FC<LandingHeroProps> = ({ onRegisterClick, onExploreClick }) => {
  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Welcome to the
              <span className="block text-yellow-400">Mexican Pickleball Federation</span>
            </h1>
            <p className="text-xl leading-relaxed mb-8 text-blue-100">
              Join the fastest-growing sport in Mexico. Connect with players, compete in tournaments, 
              find courts, and be part of our vibrant pickleball community across all Mexican states.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onRegisterClick}
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg"
              >
                Join the Federation
              </button>
              <button
                onClick={() => onExploreClick('tournaments')}
                className="border-2 border-white hover:bg-white hover:text-blue-900 font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200"
              >
                Explore Tournaments
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">32</div>
                  <div className="text-sm text-blue-100">States</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">15K+</div>
                  <div className="text-sm text-blue-100">Players</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">500+</div>
                  <div className="text-sm text-blue-100">Tournaments</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">1,200+</div>
                  <div className="text-sm text-blue-100">Courts</div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-green-400/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingHero