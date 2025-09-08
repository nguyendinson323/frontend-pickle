import React from 'react'

const TournamentOrganization: React.FC = () => {
  const tournaments = [
    {
      level: 'National Level',
      organizer: 'Mexican Pickleball Federation',
      events: ['National Tournaments', 'National Tour', 'National League', 'Mexican Open', 'National Championship'],
      color: 'bg-gradient-to-r from-indigo-600 to-purple-600'
    },
    {
      level: 'State Level', 
      organizer: 'State Committees',
      events: ['State Tournaments', 'Municipal Championship', 'State League', 'State Championship'],
      color: 'bg-gradient-to-r from-red-500 to-pink-500'
    },
    {
      level: 'Local Level',
      organizer: 'Clubs & Partners',
      events: ['Local Tournaments', 'Club Championships', 'Community Events', 'Training Camps'],
      color: 'bg-gradient-to-r from-green-500 to-teal-500'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Tournament Organization
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our three-tier tournament system ensures competitions at every level, 
            from local community events to national championships.
          </p>
        </div>

        <div className="space-y-8">
          {tournaments.map((tournament, index) => (
            <div
              key={tournament.level}
              className={`rounded-lg overflow-hidden shadow-lg animate-fade-in-up animation-delay-${index * 200}`}
            >
              <div className={`${tournament.color} text-white p-6`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{tournament.level}</h3>
                    <p className="text-lg opacity-90">Organized by {tournament.organizer}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {tournament.events.map((event, idx) => (
                    <div key={idx} className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 font-medium">{event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TournamentOrganization