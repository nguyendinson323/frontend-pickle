import React from 'react'
import { CoachCertification, CertificationFilters } from '../../../types/coach'

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
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Manage Certifications</h3>
        <div className="flex space-x-3">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
            >
              Clear filters
            </button>
          )}
          <button
            onClick={onAddNew}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Add Certification
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => onFiltersChange({ status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Issuer Filter */}
        <div>
          <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 mb-2">
            Issuer
          </label>
          <select
            id="issuer"
            value={filters.issuer}
            onChange={(e) => onFiltersChange({ issuer: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search certifications..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  )
}

export default CertificationsFilters