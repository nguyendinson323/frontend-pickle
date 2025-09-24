import React from 'react'
import { CoachCertification, CertificationFilters } from '../../../types/coach'
import {
  FiSliders,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiHome
} from 'react-icons/fi'

interface CertificationsFiltersProps {
  filters: CertificationFilters
  certifications: CoachCertification[]
  onFiltersChange: (filters: Partial<CertificationFilters>) => void
  onClearFilters: () => void
  onAddNew: () => void
}

const CertificationsFilters: React.FC<CertificationsFiltersProps> = ({
  filters,
  certifications,
  onFiltersChange,
  onClearFilters,
  onAddNew
}) => {
  const hasActiveFilters = filters.status !== 'all' || filters.issuer || filters.search

  // Get unique issuers for the filter dropdown
  const uniqueIssuers = Array.from(
    new Set(certifications.map(cert => cert.issuer).filter(issuer => issuer))
  ).sort()

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl shadow-xl p-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <FiSliders className="h-6 w-6 mr-3 text-indigo-600" />
            Manage Certifications
          </h3>
          <p className="text-gray-600 font-medium">Filter and organize your professional credentials</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center px-4 py-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-2xl transition-all duration-200"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Clear filters
            </button>
          )}
          <button
            onClick={onAddNew}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Add Certification
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Filter */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <label htmlFor="status" className="block text-sm font-bold text-gray-900 mb-4 flex items-center">
            <FiFilter className="h-4 w-4 mr-2 text-blue-600" />
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => onFiltersChange({ status: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Issuer Filter */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
          <label htmlFor="issuer" className="block text-sm font-bold text-gray-900 mb-4 flex items-center">
            <FiHome className="h-4 w-4 mr-2 text-purple-600" />
            Issuer
          </label>
          <select
            id="issuer"
            value={filters.issuer}
            onChange={(e) => onFiltersChange({ issuer: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-400"
          >
            <option value="">All Issuers</option>
            {uniqueIssuers.map((issuer) => (
              <option key={issuer} value={issuer}>
                {issuer}
              </option>
            ))}
          </select>
        </div>

        {/* Search Filter */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <label htmlFor="search" className="block text-sm font-bold text-gray-900 mb-4 flex items-center">
            <FiSearch className="h-4 w-4 mr-2 text-green-600" />
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search certifications..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
          />
        </div>
      </div>
    </div>
  )
}

export default CertificationsFilters