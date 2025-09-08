import React from 'react'
import { useNavigate } from 'react-router-dom'

const CourtsCTA: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-teal-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Play?
        </h2>
        <p className="text-xl mb-8 text-green-100">
          Join the federation to access the best courts across Mexico
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Join Federation
          </button>
          <button
            onClick={() => navigate('/login')}
            className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Login to Book Courts
          </button>
        </div>
      </div>
    </section>
  )
}

export default CourtsCTA