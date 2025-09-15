import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlay, FiLogIn } from 'react-icons/fi'

const CourtsCTA: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="relative py-20 bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 text-white overflow-hidden opacity-0 animate-fade-in-up">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-300/20 rounded-full blur-xl animate-spin-slow" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-300/20 rounded-full blur-lg animate-bounce" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
        <div className="space-y-8 opacity-0 animate-fade-in-up [animation-delay:0.2s]">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 opacity-0 animate-fade-in-up [animation-delay:0.4s]">
            Ready to Play?
          </h2>

          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up [animation-delay:0.6s]">
            Join the federation to access the best courts across Mexico
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center opacity-0 animate-fade-in-up [animation-delay:0.8s]">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 hover:scale-105 active:scale-95"
            >
              <FiPlay className="w-5 h-5" />
              Join Federation
            </button>

            <button
              onClick={() => navigate('/login')}
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-sm flex items-center gap-3 hover:scale-105 active:scale-95"
            >
              <FiLogIn className="w-5 h-5" />
              Login to Book Courts
            </button>
          </div>

          <div className="mt-8 opacity-0 animate-fade-in-up [animation-delay:1s]">
            <p className="text-sm text-green-100">
              Over 500+ courts available • Instant booking • Secure payments
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourtsCTA