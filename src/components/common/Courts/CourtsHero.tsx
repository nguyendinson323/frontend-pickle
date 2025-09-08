import React from 'react'

const CourtsHero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-900 via-teal-800 to-blue-900 text-white py-20 overflow-hidden">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
          Pickleball Courts
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto animate-fade-in-up animation-delay-200">
          Find and reserve pickleball courts across Mexico. Play at the best facilities nationwide.
        </p>
      </div>
    </section>
  )
}

export default CourtsHero