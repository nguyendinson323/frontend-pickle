import React from 'react'

interface MembersHeaderProps {
  activeTab: 'all' | 'players' | 'coaches' | 'clubs' | 'partners'
  setActiveTab: (tab: 'all' | 'players' | 'coaches' | 'clubs' | 'partners') => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  skillLevelFilter: string
  setSkillLevelFilter: (level: string) => void
  certificationFilter: string
  setCertificationFilter: (cert: string) => void
}

const MembersHeader: React.FC<MembersHeaderProps> = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  skillLevelFilter,
  setSkillLevelFilter,
  certificationFilter,
  setCertificationFilter
}) => {
  const tabs = [
    { id: 'all', label: 'All Members' },
    { id: 'players', label: 'Players' },
    { id: 'coaches', label: 'Coaches' },
    { id: 'clubs', label: 'Clubs' },
    { id: 'partners', label: 'Partners' }
  ]

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]

  const skillLevels = [
    { value: '', label: 'All NRTP Levels' },
    { value: '1.0', label: '1.0 - Beginner' },
    { value: '2.0', label: '2.0 - Novice' },
    { value: '3.0', label: '3.0 - Intermediate' },
    { value: '4.0', label: '4.0 - Advanced' },
    { value: '5.0', label: '5.0 - Professional' }
  ]

  const certificationLevels = [
    { value: '', label: 'All Certifications' },
    { value: 'basic', label: 'Basic' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'master', label: 'Master' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Member Management</h1>
            <p className="text-gray-600 mt-1">Manage players, coaches, clubs, and partners in your state</p>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-0">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {(activeTab === 'all' || activeTab === 'players') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Level
              </label>
              <select
                value={skillLevelFilter}
                onChange={(e) => setSkillLevelFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {skillLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'coaches') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certification
              </label>
              <select
                value={certificationFilter}
                onChange={(e) => setCertificationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {certificationLevels.map(cert => (
                  <option key={cert.value} value={cert.value}>
                    {cert.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
                setSkillLevelFilter('')
                setCertificationFilter('')
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MembersHeader