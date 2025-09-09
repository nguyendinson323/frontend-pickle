import React from 'react'

const FederationFunctions: React.FC = () => {
  const federationFunctions = [
    {
      title: 'Regulation and Governance',
      description: 'Establish official rules, standards, and guidelines for fair play and competition.',
      icon: '⚖️'
    },
    {
      title: 'Athlete Registration',
      description: 'Maintain official records of players, rankings, and categories by age or skill level.',
      icon: '📋'
    },
    {
      title: 'Club and Association Management',
      description: 'Recognize and coordinate regional associations, clubs, and institutions.',
      icon: '🏢'
    },
    {
      title: 'Event Organization',
      description: 'Oversee local, state, and national tournaments and championships.',
      icon: '🏆'
    },
    {
      title: 'Ranking System',
      description: 'Define transparent point-based ranking system to evaluate and classify players.',
      icon: '📊'
    },
    {
      title: 'Training and Certification',
      description: 'Promote training programs and certify coaches, referees, and officials.',
      icon: '🎓'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What is a Sports Federation?
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 mb-6">
              A sports federation is a governing body that oversees the promotion, regulation, and development 
              of a specific sport within a country or region. Federations are typically recognized by national 
              or international institutions and act as the primary authority for organizing competitions and 
              setting rules for the sport.
            </p>
            <p className="text-lg text-gray-600">
              Our federation is responsible for organizing and promoting pickleball at a national level, 
              establishing official standards, and serving as the central authority for players, clubs, 
              tournaments, and regional associations throughout Mexico.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {federationFunctions.map((func, index) => (
            <div
              key={func.title}
              className={` p-6 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up animation-delay-${index * 100}`}
            >
              <div className="text-4xl mb-4">{func.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {func.title}
              </h3>
              <p className="text-gray-600">
                {func.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FederationFunctions