import React from 'react'
import { useNavigate } from 'react-router-dom'

const AboutCTA: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Join Our Federation?
        </h2>
        <p className="text-xl mb-8 text-gray-300">
          Become part of the official pickleball community in Mexico and access 
          all the benefits of federation membership.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Registration
          </button>
          <button
            onClick={() => navigate('/tournaments')}
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            View Tournaments
          </button>
        </div>
      </div>
    </section>
  )
}

export default AboutCTA