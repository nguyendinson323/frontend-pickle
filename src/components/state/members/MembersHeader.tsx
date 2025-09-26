import React from 'react'
import { FiUsers, FiSearch, FiFilter, FiX, FiUserCheck, FiUsers as FiUsersGroup, FiHome, FiActivity } from 'react-icons/fi'

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
    <div className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 rounded-3xl shadow-2xl border border-gray-200/50 mb-8 backdrop-blur-lg">
      <div className="px-8 py-6 border-b border-gray-200/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg">
              <FiUsers className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">Member Management</h1>
              <p className="text-gray-600 mt-2 text-lg">Manage players, coaches, clubs, and partners in your state</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-8 py-0">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const getTabIcon = (tabId: string) => {
              switch (tabId) {
                case 'all': return <FiUsers className="w-5 h-5 mr-2" />
                case 'players': return <FiUserCheck className="w-5 h-5 mr-2" />
                case 'coaches': return <FiUsersGroup className="w-5 h-5 mr-2" />
                case 'clubs': return <FiHome className="w-5 h-5 mr-2" />
                case 'partners': return <FiActivity className="w-5 h-5 mr-2" />
                default: return <FiUsers className="w-5 h-5 mr-2" />
              }
            }

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 flex items-center hover:scale-105 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50 rounded-t-xl px-4'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50 rounded-t-xl px-4'
                }`}
              >
                {getTabIcon(tab.id)}
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="px-8 py-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-blue-50/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FiSearch className="w-4 h-4 mr-2 text-blue-600" />
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FiFilter className="w-4 h-4 mr-2 text-green-600" />
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all duration-200 bg-white/80 backdrop-blur-sm"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <FiFilter className="w-4 h-4 mr-2 text-purple-600" />
                Skill Level
              </label>
              <select
                value={skillLevelFilter}
                onChange={(e) => setSkillLevelFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all duration-200 bg-white/80 backdrop-blur-sm"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <FiFilter className="w-4 h-4 mr-2 text-orange-600" />
                Certification
              </label>
              <select
                value={certificationFilter}
                onChange={(e) => setCertificationFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all duration-200 bg-white/80 backdrop-blur-sm"
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
              className="px-6 py-3 text-sm text-gray-600 hover:text-gray-800 transition-all duration-200 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl shadow-sm hover:shadow-md hover:scale-105 flex items-center space-x-2 font-semibold"
            >
              <FiX className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MembersHeader