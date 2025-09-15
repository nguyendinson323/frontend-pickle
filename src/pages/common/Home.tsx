import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  FiUsers,
  FiMapPin,
  FiCalendar,
  FiStar,
  FiTarget,
  FiAward,
  FiPlay,
  FiArrowRight,
  FiTrendingUp
} from 'react-icons/fi'
import { IoTrophyOutline } from 'react-icons/io5'
import { RootState, AppDispatch } from '../../store'
import { fetchCommonData } from '../../store/slices/commonSlice'
import { LoadingSpinner } from '../../components/common'

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { data: commonData, isLoading } = useSelector((state: RootState) => state.common)

  useEffect(() => {
    if (!commonData) {
      dispatch(fetchCommonData())
    }
  }, [dispatch, commonData])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    )
  }

  const features = [
    {
      icon: FiUsers,
      title: "Player Network",
      description: "Connect with players across Mexico, find partners, and build your pickleball community.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FiMapPin,
      title: "Court Finder",
      description: "Discover courts near you, reserve playing time, and explore new venues.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: IoTrophyOutline,
      title: "Tournaments",
      description: "Join official tournaments, track rankings, and compete at all skill levels.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: FiAward,
      title: "Digital Credentials",
      description: "Official federation credentials with QR codes for quick verification.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: FiTarget,
      title: "Skill Development",
      description: "NRTP level tracking, coaching connections, and performance analytics.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: FiStar,
      title: "Premium Features",
      description: "Enhanced tools for clubs, partners, and serious competitors.",
      color: "from-pink-500 to-pink-600"
    }
  ]

  const stats = [
    {
      value: commonData?.federation_statistics?.total_players?.toLocaleString() || '1,000+',
      label: 'Active Players',
      sublabel: 'Registered nationwide',
      icon: FiUsers,
      color: 'text-blue-600'
    },
    {
      value: commonData?.federation_statistics?.total_courts?.toLocaleString() || '200+',
      label: 'Courts',
      sublabel: 'Available for play',
      icon: FiMapPin,
      color: 'text-green-600'
    },
    {
      value: commonData?.federation_statistics?.total_tournaments?.toLocaleString() || '50+',
      label: 'Tournaments',
      sublabel: 'This year',
      icon: IoTrophyOutline,
      color: 'text-purple-600'
    },
    {
      value: '32',
      label: 'States',
      sublabel: 'Nationwide coverage',
      icon: FiTrendingUp,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm animate-bounce" />
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-yellow-400/20 rounded-full backdrop-blur-sm animate-pulse" />
          <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-green-400/20 rounded-full backdrop-blur-sm animate-ping" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8 opacity-0 animate-fade-in-left">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium opacity-0 animate-fade-in-up [animation-delay:0.2s]">
                  <FiStar className="w-4 h-4 mr-2" />
                  Official Mexican Federation
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight opacity-0 animate-fade-in-up [animation-delay:0.4s]">
                  Official Mexican
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                    Pickleball Federation
                  </span>
                </h1>
              </div>

              <p className="text-xl text-gray-100 max-w-lg mx-auto lg:mx-0 leading-relaxed opacity-0 animate-fade-in-up [animation-delay:0.6s]">
                Join Mexico's official pickleball community. Connect with players,
                find courts, compete in tournaments, and grow the sport nationwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start opacity-0 animate-fade-in-up [animation-delay:0.8s]">
                <button
                  onClick={() => navigate('/register')}
                  className="group inline-flex items-center justify-center px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  Join Federation
                  <FiArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  Learn More
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 opacity-0 animate-fade-in-up [animation-delay:1s]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {commonData?.federation_statistics?.total_players || '1,000+'}
                  </div>
                  <div className="text-sm text-gray-300">Active Players</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {commonData?.federation_statistics?.total_courts || '200+'}
                  </div>
                  <div className="text-sm text-gray-300">Courts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {commonData?.federation_statistics?.total_tournaments || '50+'}
                  </div>
                  <div className="text-sm text-gray-300">Tournaments</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:block opacity-0 animate-fade-in-right [animation-delay:0.4s]">
              <div className="relative">
                <div className="w-full h-96 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 flex items-center justify-center">
                  <div className="text-center animate-spin-slow">
                    <FiPlay className="w-20 h-20 text-white mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Pickleball in Action</h3>
                    <p className="text-gray-300 text-sm">Experience the fastest growing sport in Mexico</p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400 rounded-full opacity-80"></div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-green-400 rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      {commonData?.federation_statistics && (
        <section className="py-20 bg-white opacity-0 animate-fade-in-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 opacity-0 animate-fade-in-up [animation-delay:0.2s]">
                Growing Community
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-up [animation-delay:0.4s]">
                Join thousands of players, clubs, and organizations that make up
                Mexico's thriving pickleball federation.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 opacity-0 animate-fade-in-up`}
                  style={{animationDelay: `${0.6 + index * 0.1}s`}}
                >
                  <div className={clsx("inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4",
                    stat.color.includes('blue') && 'bg-blue-100',
                    stat.color.includes('green') && 'bg-green-100',
                    stat.color.includes('purple') && 'bg-purple-100',
                    stat.color.includes('orange') && 'bg-orange-100'
                  )}>
                    <stat.icon className={clsx("w-6 h-6", stat.color)} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-700 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 opacity-0 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 opacity-0 animate-fade-in-up [animation-delay:0.2s]">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-up [animation-delay:0.4s]">
              From beginners to professionals, our platform provides all the tools
              to play, compete, and grow in pickleball.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 opacity-0 animate-fade-in-up`}
                style={{animationDelay: `${0.6 + index * 0.1}s`}}
              >
                <div className={clsx(
                  "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-r",
                  feature.color
                )}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      {commonData?.upcoming_tournaments && commonData.upcoming_tournaments.length > 0 && (
        <section className="py-20 bg-white opacity-0 animate-fade-in-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 opacity-0 animate-fade-in-up [animation-delay:0.2s]">
                Upcoming Tournaments
              </h2>
              <p className="text-xl text-gray-600 opacity-0 animate-fade-in-up [animation-delay:0.4s]">
                Join official federation tournaments and compete at your skill level.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {commonData.upcoming_tournaments.slice(0, 6).map((tournament, index) => (
                <div
                  key={index}
                  className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 opacity-0 animate-fade-in-up`}
                  style={{animationDelay: `${0.6 + index * 0.1}s`}}
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Tournament
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {tournament.status || 'Open'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tournament.name || 'Tournament Name'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Mexico City, Mexico
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      {tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : 'TBD'}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/tournaments')}
                    className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center opacity-0 animate-fade-in-up [animation-delay:1.2s]">
              <button
                onClick={() => navigate('/tournaments')}
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                View All Tournaments
                <IoTrophyOutline className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 relative overflow-hidden opacity-0 animate-fade-in-up">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 opacity-0 animate-fade-in-up [animation-delay:0.2s]">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Join the Federation?
              </h2>
              <p className="text-xl text-gray-100 max-w-2xl mx-auto">
                Whether you're a player, coach, club, or business partner,
                there's a place for you in Mexico's pickleball community.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started Today
                <FiArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/courts')}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                Find Courts
              </button>
            </div>

            <p className="text-sm text-gray-300">
              Join over {commonData?.federation_statistics?.total_players?.toLocaleString() || '1,000'} players nationwide
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage