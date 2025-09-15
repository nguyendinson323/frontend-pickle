import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLogIn } from 'react-icons/fi'
import { IoTrophyOutline } from 'react-icons/io5'

const TournamentsCTA: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="relative py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden opacity-0 animate-fade-in-up">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-300/20 rounded-full blur-xl animate-spin-slow" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-300/20 rounded-full blur-lg animate-bounce" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
        <div className="space-y-8 opacity-0 animate-fade-in-up [animation-delay:0.2s]">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 opacity-0 animate-fade-in-up [animation-delay:0.4s]">
            Ready to Compete?
          </h2>

          <p className="text-xl mb-8 text-indigo-100 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up [animation-delay:0.6s]">
            Register for tournaments and compete with players across Mexico
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center opacity-0 animate-fade-in-up [animation-delay:0.8s]">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 transform hover:scale-105"
            >
              <IoTrophyOutline className="w-5 h-5" />
              Join Federation
            </button>

            <button
              onClick={() => navigate('/login')}
              className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-sm flex items-center gap-3 transform hover:scale-105"
            >
              <FiLogIn className="w-5 h-5" />
              Login to Register
            </button>
          </div>

          <div className="mt-8 opacity-0 animate-fade-in-up [animation-delay:1s]">
            <p className="text-sm text-indigo-100">
              Join 1000+ players • 50+ tournaments yearly • All skill levels welcome
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TournamentsCTA