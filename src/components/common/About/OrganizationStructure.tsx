import React from 'react'

const OrganizationStructure: React.FC = () => {
  const organizationStructure = [
    {
      title: 'Players',
      description: 'Base level of the federation. Individuals who play pickleball and participate in tournaments.',
      color: 'bg-green-100 text-green-800',
      features: ['Annual membership fee', 'Tournament participation', 'Court reservations', 'Player connections']
    },
    {
      title: 'Coaches',
      description: 'Train other players and access certifications to improve their credentials.',
      color: 'bg-blue-100 text-blue-800',
      features: ['Training sessions', 'Certification programs', 'Referee opportunities', 'Student management']
    },
    {
      title: 'Clubs',
      description: 'Groups of players united to play together, some with courts and tournament capabilities.',
      color: 'bg-purple-100 text-purple-800',
      features: ['Member management', 'Court registration', 'Tournament organization', 'Club microsite']
    },
    {
      title: 'Partners',
      description: 'Hotels, resorts, and private companies that own courts and organize events for revenue.',
      color: 'bg-orange-100 text-orange-800',
      features: ['Court rental system', 'Event hosting', 'Revenue generation', 'Partnership benefits']
    },
    {
      title: 'State Committees',
      description: 'Manage and promote pickleball within entire states, organizing regional competitions.',
      color: 'bg-red-100 text-red-800',
      features: ['State management', 'Regional tournaments', 'State microsite', 'Player oversight']
    },
    {
      title: 'Federation',
      description: 'Top-level administrative entity with full platform capabilities and national tournament organization.',
      color: 'bg-indigo-100 text-indigo-800',
      features: ['National tournaments', 'System administration', 'Platform oversight', 'Rule governance']
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Federation Structure
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our federation is composed of various roles structured in a pyramid-like system, 
            each with specific responsibilities and benefits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {organizationStructure.map((role, index) => (
            <div
              key={role.title}
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up animation-delay-${index * 100}`}
            >
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${role.color}`}>
                {role.title}
              </div>
              <p className="text-gray-600 mb-4">
                {role.description}
              </p>
              <ul className="space-y-2">
                {role.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OrganizationStructure