import React from 'react'
import { useNavigate } from 'react-router-dom'

const RegisterSelect: React.FC = () => {
  const navigate = useNavigate()

  const userTypes = [
    {
      type: 'player',
      title: 'Player Registration',
      description: 'Join as a pickleball player to compete in tournaments, track rankings, and connect with the community.',
      icon: '🏓',
      features: [
        'Participate in sanctioned tournaments',
        'Official ranking tracking',
        'Court booking and reservations',
        'Connect with other players',
        'Access to coaching resources'
      ],
      buttonText: 'Register as Player',
      bgColor: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      type: 'coach',
      title: 'Coach Registration',
      description: 'Become a certified pickleball coach and help grow the sport while building your coaching business.',
      icon: '👨‍🏫',
      features: [
        'Coach certification programs',
        'List your coaching services',
        'Access to training resources',
        'Student management tools',
        'Professional development'
      ],
      buttonText: 'Register as Coach',
      bgColor: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    },
    {
      type: 'club',
      title: 'Club Registration',
      description: 'Register your pickleball club to host tournaments, manage members, and promote local play.',
      icon: '🏢',
      features: [
        'Host sanctioned tournaments',
        'Member management system',
        'Court facility listing',
        'Event organization tools',
        'Community building resources'
      ],
      buttonText: 'Register Club',
      bgColor: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700'
    },
    {
      type: 'partner',
      title: 'Business Partner',
      description: 'Partner with us as a business to support the sport and reach the growing pickleball community.',
      icon: '🤝',
      features: [
        'Sponsor tournaments and events',
        'Advertise to pickleball community',
        'Provide courts and facilities',
        'Business networking opportunities',
        'Partnership benefits program'
      ],
      buttonText: 'Become Partner',
      bgColor: 'from-orange-500 to-orange-600',
      hoverColor: 'from-orange-600 to-orange-700'
    },
    {
      type: 'state',
      title: 'State Committee',
      description: 'Establish or join a state committee to oversee pickleball development in your region.',
      icon: '🏛️',
      features: [
        'Govern state-level activities',
        'Organize regional tournaments',
        'Develop local infrastructure',
        'Coordinate with federation',
        'Support local clubs and players'
      ],
      buttonText: 'Register Committee',
      bgColor: 'from-red-500 to-red-600',
      hoverColor: 'from-red-600 to-red-700'
    }
  ]

  const handleUserTypeSelect = (userType: string) => {
    navigate(`/register/${userType}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Join the Mexican Pickleball Federation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose your membership type to get started. Each membership provides unique benefits 
            and access to different features of our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {userTypes.map((userType) => (
            <div 
              key={userType.type} 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${userType.bgColor} text-white p-6`}>
                <div className="text-4xl mb-4">{userType.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{userType.title}</h3>
                <p className="text-blue-100 leading-relaxed">
                  {userType.description}
                </p>
              </div>
              
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">What's Included:</h4>
                <ul className="space-y-2 mb-6">
                  {userType.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleUserTypeSelect(userType.type)}
                  className={`w-full bg-gradient-to-r ${userType.bgColor} hover:${userType.hoverColor} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg`}
                >
                  {userType.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Questions About Registration?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Need Help Choosing?</h4>
              <p className="text-gray-600 text-sm">
                Contact our support team for guidance on which membership type is right for you.
              </p>
            </div>
            
            <div>
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure Registration</h4>
              <p className="text-gray-600 text-sm">
                Your information is protected with industry-standard security measures.
              </p>
            </div>
            
            <div>
              <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Quick Process</h4>
              <p className="text-gray-600 text-sm">
                Registration takes just a few minutes and you'll have instant access to benefits.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              By registering, you agree to our Terms of Service and Privacy Policy. 
              All memberships are subject to federation approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterSelect