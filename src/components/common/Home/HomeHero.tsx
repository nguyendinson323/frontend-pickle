import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomeHero: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20 z-0"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Welcome to the Official
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Mexican Pickleball Federation
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            The official digital platform for pickleball development and regulation in Mexico. 
            Join thousands of players, coaches, and clubs in the fastest-growing sport.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Join Federation
            </button>
            <button
              onClick={() => navigate('/about')}
              className="border-2 border-white text-white hover:bg-white hover:text-indigo-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-400/20 rounded-full animate-pulse animation-delay-300"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-indigo-400/20 rounded-full animate-pulse animation-delay-600"></div>
      </div>
    </section>
  )
}

export default HomeHero