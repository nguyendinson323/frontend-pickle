import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  FiUsers,
  FiMapPin,
  FiAward,
  FiShield,
  FiTrendingUp,
  FiGlobe,
  FiHeart,
  FiCheckCircle
} from 'react-icons/fi'
import { IoTrophyOutline } from 'react-icons/io5'
import { RootState, AppDispatch } from '../../store'
import { fetchCommonData } from '../../store/slices/commonSlice'

const AboutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { data: commonData } = useSelector((state: RootState) => state.common)

  useEffect(() => {
    // Set page title and meta description for SEO
    document.title = 'About - Mexican Pickleball Federation'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about the Mexican Pickleball Federation - the official governing body for pickleball development and regulation in Mexico, dedicated to promoting the sport nationwide.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Learn about the Mexican Pickleball Federation - the official governing body for pickleball development and regulation in Mexico, dedicated to promoting the sport nationwide.'
      document.head.appendChild(meta)
    }

    if (!commonData) {
      dispatch(fetchCommonData())
    }
  }, [dispatch, commonData])

  const federationFunctions = [
    {
      icon: FiShield,
      title: "Official Regulation",
      description: "Establish and maintain official rules, standards, and regulations for pickleball in Mexico."
    },
    {
      icon: IoTrophyOutline,
      title: "Tournament Organization",
      description: "Organize national championships, sanctioned tournaments, and ranking systems."
    },
    {
      icon: FiUsers,
      title: "Player Development",
      description: "Provide training programs, coaching certification, and skill development resources."
    },
    {
      icon: FiAward,
      title: "Digital Credentials",
      description: "Issue official digital credentials and maintain player verification systems."
    },
    {
      icon: FiTrendingUp,
      title: "Sport Growth",
      description: "Promote pickleball growth through education, marketing, and community outreach."
    },
    {
      icon: FiGlobe,
      title: "International Relations",
      description: "Represent Mexico in international pickleball organizations and competitions."
    }
  ]

  const organizationStructure = [
    {
      title: "National Federation",
      description: "Central governing body overseeing all pickleball activities nationwide",
      icon: FiGlobe
    },
    {
      title: "State Committees",
      description: "Regional representatives managing local tournaments and player development",
      icon: FiMapPin
    },
    {
      title: "Club Network",
      description: "Affiliated clubs providing facilities and organizing community events",
      icon: FiUsers
    },
    {
      title: "Partner Program",
      description: "Business partnerships with venues, sponsors, and service providers",
      icon: FiHeart
    }
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden opacity-0 animate-fade-in-up">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl animate-bounce" />
          <div className="absolute bottom-40 right-20 w-40 h-40 bg-purple-300/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-200/30 rounded-full blur-lg animate-ping" />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left opacity-0 animate-fade-in-left [animation-delay:0.2s]">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 opacity-0 animate-fade-in-up [animation-delay:0.4s]">
                About the
                <br />
                <span className="text-yellow-300 bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                  Mexican Pickleball Federation
                </span>
              </h1>

              <p className="text-xl text-gray-100 max-w-2xl mb-8 leading-relaxed opacity-0 animate-fade-in-up [animation-delay:0.6s]">
                We are the official governing body for pickleball in Mexico, dedicated to
                promoting, developing, and regulating the sport at all levels across the nation.
                Our mission is to unite players, clubs, and communities through the fastest
                growing sport in the country.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start opacity-0 animate-fade-in-up [animation-delay:0.8s]">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-yellow-400 text-gray-800 font-bold rounded-full text-lg transition-all duration-300 hover:bg-yellow-300 shadow-lg transform hover:scale-105 hover:shadow-2xl"
                >
                  Join Our Community
                </button>
                <button
                  onClick={() => navigate('/tournaments')}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full text-lg transition-all duration-300 hover:bg-white/20 backdrop-blur-sm transform hover:scale-105"
                >
                  View Tournaments
                </button>
              </div>
            </div>

            <div className="flex-1 hidden lg:block opacity-0 animate-fade-in-right [animation-delay:0.6s]">
              <div className="w-full h-96 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 hover:scale-105 hover:rotate-1 transition-all duration-300">
                <div className="text-center text-white">
                  <div className="animate-spin-slow">
                    <FiShield className="w-20 h-20 mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Official Federation
                  </h3>
                  <p className="text-sm opacity-80">
                    Established to govern and grow pickleball in Mexico
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50 opacity-0 animate-fade-in-up">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group opacity-0 animate-fade-in-left [animation-delay:0.2s]">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform duration-200">
                    Our Mission
                  </span>
                  <h3 className="text-3xl font-bold text-gray-800">
                    Growing Pickleball Nationwide
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  To promote, develop, and regulate pickleball throughout Mexico by
                  providing official governance, organizing tournaments, maintaining
                  standards, and creating opportunities for players of all skill levels
                  to participate and excel in the sport.
                </p>
                <div className="space-y-3">
                  {[
                    'Establish official rules and regulations',
                    'Organize national tournaments and championships',
                    'Develop player ranking and certification systems'
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 opacity-0 animate-fade-in-left"
                      style={{animationDelay: `${0.4 + (index * 0.1)}s`}}
                    >
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiCheckCircle className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group opacity-0 animate-fade-in-right [animation-delay:0.4s]">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform duration-200">
                    Our Vision
                  </span>
                  <h3 className="text-3xl font-bold text-gray-800">
                    Leading Pickleball Excellence
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  To make Mexico a leading nation in pickleball, with a thriving
                  community of players, coaches, and facilities that represent
                  excellence in the sport while fostering inclusivity, sportsmanship,
                  and healthy competition at every level.
                </p>
                <div className="space-y-3">
                  {[
                    'Build world-class training facilities',
                    'Develop internationally competitive players',
                    'Create sustainable growth nationwide'
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 opacity-0 animate-fade-in-right"
                      style={{animationDelay: `${0.6 + (index * 0.1)}s`}}
                    >
                      <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiCheckCircle className="w-3 h-3 text-purple-600" />
                      </div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Federation Functions */}
      <section className="py-20 bg-white opacity-0 animate-fade-in-up">
        <div className="container mx-auto px-6">
          <div className="space-y-16">
            <div className="text-center space-y-4 opacity-0 animate-fade-in-up [animation-delay:0.2s]">
              <h2 className="text-4xl font-bold text-gray-800">
                What We Do
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                As Mexico's official pickleball federation, we provide comprehensive
                services to players, clubs, and the broader pickleball community.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {federationFunctions.map((func, index) => {
                const gradients = [
                  'from-blue-500 to-purple-600',
                  'from-green-500 to-blue-600',
                  'from-purple-500 to-pink-600',
                  'from-orange-500 to-red-600',
                  'from-teal-500 to-green-600',
                  'from-indigo-500 to-purple-600'
                ]

                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100 hover:-translate-y-2 hover:scale-105 opacity-0 animate-fade-in-up"
                    style={{animationDelay: `${0.4 + (index * 0.1)}s`}}
                  >
                    <div className="space-y-4">
                      <div
                        className={clsx(
                          'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-white transform hover:scale-110 hover:rotate-6 transition-all duration-300',
                          gradients[index % gradients.length]
                        )}
                      >
                        <func.icon className="w-7 h-7" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {func.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {func.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Organization Structure */}
      <section className="py-20 bg-gray-50 opacity-0 animate-fade-in-up">
        <div className="container mx-auto px-6">
          <div className="space-y-16">
            <div className="text-center space-y-4 opacity-0 animate-fade-in-up [animation-delay:0.2s]">
              <h2 className="text-4xl font-bold text-gray-800">
                Organization Structure
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our federation operates through a structured network of organizations
                working together to promote and develop pickleball across Mexico.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {organizationStructure.map((org, index) => {
                const colors = [
                  { bg: 'bg-blue-100', icon: 'text-blue-600', border: 'border-blue-200' },
                  { bg: 'bg-green-100', icon: 'text-green-600', border: 'border-green-200' },
                  { bg: 'bg-purple-100', icon: 'text-purple-600', border: 'border-purple-200' },
                  { bg: 'bg-orange-100', icon: 'text-orange-600', border: 'border-orange-200' }
                ]

                return (
                  <div
                    key={index}
                    className={clsx(
                      'bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 hover:scale-105 hover:-translate-y-1 opacity-0',
                      colors[index % colors.length].border,
                      index % 2 === 0 ? 'animate-fade-in-left' : 'animate-fade-in-right'
                    )}
                    style={{animationDelay: `${0.4 + (index * 0.2)}s`}}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={clsx(
                          'w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 hover:scale-110 hover:rotate-6 transition-all duration-300',
                          colors[index % colors.length].bg
                        )}
                      >
                        <org.icon className={clsx('w-8 h-8', colors[index % colors.length].icon)} />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {org.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {org.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      {commonData?.federation_statistics && (
        <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 opacity-0 animate-fade-in-up">
          <div className="container mx-auto px-6">
            <div className="space-y-16">
              <div className="text-center space-y-4 opacity-0 animate-fade-in-up [animation-delay:0.2s]">
                <h2 className="text-4xl font-bold text-gray-800">
                  Our Impact
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  See how we're growing the pickleball community across Mexico
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    value: commonData.federation_statistics.total_players?.toLocaleString() || '1,000+',
                    label: 'Registered Players',
                    color: 'text-blue-600',
                    bg: 'bg-blue-100',
                    icon: FiUsers
                  },
                  {
                    value: commonData.federation_statistics.total_courts?.toLocaleString() || '200+',
                    label: 'Active Courts',
                    color: 'text-green-600',
                    bg: 'bg-green-100',
                    icon: FiMapPin
                  },
                  {
                    value: commonData.federation_statistics.total_tournaments?.toLocaleString() || '50+',
                    label: 'Annual Tournaments',
                    color: 'text-purple-600',
                    bg: 'bg-purple-100',
                    icon: IoTrophyOutline
                  },
                  {
                    value: '32',
                    label: 'States Covered',
                    color: 'text-orange-600',
                    bg: 'bg-orange-100',
                    icon: FiGlobe
                  }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 hover:scale-105 opacity-0 animate-fade-in-up"
                    style={{animationDelay: `${0.4 + (index * 0.1)}s`}}
                  >
                    <div className="space-y-4">
                      <div
                        className={clsx(
                          'w-12 h-12 rounded-full mx-auto flex items-center justify-center hover:scale-125 hover:rotate-12 transition-all duration-300',
                          stat.bg
                        )}
                      >
                        <stat.icon className={clsx('w-6 h-6', stat.color)} />
                      </div>
                      <div>
                        <div
                          className={clsx('text-3xl font-bold mb-2 opacity-0 animate-fade-in-up', stat.color)}
                          style={{animationDelay: `${0.6 + (index * 0.1)}s`}}
                        >
                          {stat.value}
                        </div>
                        <p className="text-gray-600 font-medium text-sm">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden opacity-0 animate-fade-in-up">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-300/20 rounded-full blur-xl animate-spin-slow" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-300/20 rounded-full blur-xl animate-pulse" />
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
          <div className="space-y-8">
            <div className="space-y-4 opacity-0 animate-fade-in-up [animation-delay:0.2s]">
              <h2 className="text-4xl font-bold">
                Be Part of Mexico's Pickleball Future
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
                Join our growing federation and help shape the future of pickleball
                in Mexico. Whether you're a player, coach, club, or business,
                there's a place for you in our community.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap opacity-0 animate-fade-in-up [animation-delay:0.4s]">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-yellow-400 text-gray-800 font-bold rounded-full text-lg transition-all duration-300 hover:bg-yellow-300 shadow-lg transform hover:scale-105 hover:shadow-2xl"
              >
                Join Federation
              </button>
              <button
                onClick={() => navigate('/courts')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full text-lg transition-all duration-300 hover:bg-white/20 backdrop-blur-sm transform hover:scale-105"
              >
                Find Courts
              </button>
              <button
                onClick={() => navigate('/tournaments')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full text-lg transition-all duration-300 hover:bg-white/20 backdrop-blur-sm transform hover:scale-105"
              >
                View Tournaments
              </button>
            </div>

            <p className="text-sm opacity-0 animate-fade-in-up [animation-delay:0.6s]">
              Contact us: info@pickleballfederation.mx | +52 (55) 1234-5678
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage