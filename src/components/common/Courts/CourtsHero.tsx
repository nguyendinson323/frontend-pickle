import React from 'react'
import { FiMapPin, FiCalendar, FiClock } from 'react-icons/fi'

const CourtsHero: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 text-white overflow-hidden opacity-0 animate-fade-in-up">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-bounce" />
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-green-200/30 rounded-full blur-lg animate-ping" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 flex items-center min-h-screen">
        <div className="flex flex-col lg:flex-row items-center gap-12 w-full">
          <div className="flex-1 text-center lg:text-left opacity-0 animate-fade-in-left [animation-delay:0.2s]">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 opacity-0 animate-fade-in-up [animation-delay:0.4s]">
              <span className="bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                Pickleball
              </span>
              <br />
              <span className="text-yellow-300">
                Courts
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-100 max-w-2xl mb-8 leading-relaxed opacity-0 animate-fade-in-up [animation-delay:0.6s]">
              Find and reserve pickleball courts across Mexico. Play at the best facilities nationwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-8 opacity-0 animate-fade-in-up [animation-delay:0.8s]">
              {[
                { icon: FiMapPin, text: "Courts in 32 States", color: "text-green-300" },
                { icon: FiCalendar, text: "Book Instantly", color: "text-yellow-300" },
                { icon: FiClock, text: "24/7 Availability", color: "text-blue-300" }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 opacity-0 animate-fade-in-left"
                  style={{animationDelay: `${1 + (index * 0.1)}s`}}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <span className="text-lg font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 hidden lg:block opacity-0 animate-fade-in-right [animation-delay:0.6s]">
            <div className="relative hover:scale-105 hover:rotate-1 transition-all duration-300">
              <div className="w-full h-96 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20">
                <div className="text-center">
                  <div className="text-8xl mb-6 animate-spin-slow">
                    🏓
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Premium Courts
                  </h3>
                  <p className="text-lg opacity-80">
                    Professional facilities across Mexico
                  </p>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
                ⭐
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center text-xl animate-pulse">
                🎾
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourtsHero