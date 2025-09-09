import React from 'react'

const AboutHero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900  text-white py-20 overflow-hidden">
      <div className="absolute inset-0 bg-black/30 z-0"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
          About the
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Mexican Pickleball Federation
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto animate-fade-in-up animation-delay-200">
          The official governing body for pickleball development and regulation in Mexico, 
          dedicated to promoting the sport at all levels across the nation.
        </p>
      </div>
    </section>
  )
}

export default AboutHero