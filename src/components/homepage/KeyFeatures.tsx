import React from 'react'

interface KeyFeaturesProps {
  onExploreClick: (page: string) => void
}

const KeyFeatures: React.FC<KeyFeaturesProps> = ({ onExploreClick }) => {
  const features = [
    {
      title: 'Tournament Directory',
      description: 'Discover and register for sanctioned tournaments across Mexico. From local competitions to national championships.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      page: 'tournaments',
      buttonText: 'View Tournaments'
    },
    {
      title: 'Court Finder',
      description: 'Find pickleball courts near you with detailed information about facilities, availability, and booking options.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      page: 'courts',
      buttonText: 'Find Courts'
    },
    {
      title: 'National Rankings',
      description: 'Track official player rankings and see how you stack up against the best players in Mexico.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      page: 'ranking',
      buttonText: 'View Rankings'
    },
    {
      title: 'State Activities',
      description: 'Explore pickleball activity across all 32 Mexican states. Find local clubs, players, and events near you.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      ),
      page: 'states',
      buttonText: 'Browse States'
    },
    {
      title: 'Official Rules',
      description: 'Access the complete official pickleball rules and regulations as adopted by the Mexican Federation.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      page: 'rules',
      buttonText: 'Read Rules'
    },
    {
      title: 'Community Network',
      description: 'Connect with players, coaches, clubs, and partners throughout Mexico. Build lasting relationships.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      page: 'register',
      buttonText: 'Join Community'
    }
  ]

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Everything You Need for Pickleball</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and resources you need to enjoy, 
            compete, and grow in the sport of pickleball.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {feature.description}
              </p>
              <button
                onClick={() => onExploreClick(feature.page)}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                {feature.buttonText}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Additional Benefits Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-6">Benefits of Federation Membership</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl mb-4">🏆</div>
              <h4 className="text-xl font-semibold mb-2">Compete Officially</h4>
              <p className="text-blue-100">Participate in sanctioned tournaments and earn official rankings</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🎓</div>
              <h4 className="text-xl font-semibold mb-2">Professional Development</h4>
              <p className="text-blue-100">Access coaching certifications and training programs</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🌟</div>
              <h4 className="text-xl font-semibold mb-2">Exclusive Access</h4>
              <p className="text-blue-100">Premium features, early tournament registration, and special events</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KeyFeatures