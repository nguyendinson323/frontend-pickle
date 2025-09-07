import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const CourtRegistry: React.FC = () => {
  const { courts, loading } = useSelector((state: RootState) => state.admin)
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedOwnerType, setSelectedOwnerType] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  if (loading) {
    return <div className="p-4">Loading court registry...</div>
  }

  // Filter courts based on selected filters
  const filteredCourts = (courts || []).filter(court => {
    if (selectedState && court.state_id !== parseInt(selectedState)) return false
    if (selectedOwnerType && court.owner_type !== selectedOwnerType) return false
    if (selectedStatus && court.status !== selectedStatus) return false
    return true
  })

  const courtStats = {
    total: (courts || []).length,
    active: (courts || []).filter(c => c.status === 'active').length,
    maintenance: (courts || []).filter(c => c.status === 'maintenance').length,
    inactive: (courts || []).filter(c => c.status === 'inactive').length,
    clubOwned: (courts || []).filter(c => c.owner_type === 'club').length,
    partnerOwned: (courts || []).filter(c => c.owner_type === 'partner').length,
    indoor: (courts || []).filter(c => c.indoor).length,
    outdoor: (courts || []).filter(c => !c.indoor).length,
    withLights: (courts || []).filter(c => c.lights).length
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Court Registry</h2>
          <p className="text-gray-600">Monitor and manage all registered courts across the federation</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <span>📊</span>
          <span>Export Report</span>
        </button>
      </div>

      {/* Court Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-blue-600">🏟️</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{courtStats.total}</div>
              <div className="text-sm text-gray-600">Total Courts</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-green-600">✅</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-900">{courtStats.active}</div>
              <div className="text-sm text-green-700">Active</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-yellow-600">🔧</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-yellow-900">{courtStats.maintenance}</div>
              <div className="text-sm text-yellow-700">Maintenance</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-purple-600">🏢</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-purple-900">{courtStats.clubOwned}</div>
              <div className="text-sm text-purple-700">Club Owned</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-orange-600">🤝</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-orange-900">{courtStats.partnerOwned}</div>
              <div className="text-sm text-orange-700">Partner Owned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Indoor Courts</div>
          <div className="text-xl font-bold text-gray-900">{courtStats.indoor}</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Outdoor Courts</div>
          <div className="text-xl font-bold text-gray-900">{courtStats.outdoor}</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">With Lights</div>
          <div className="text-xl font-bold text-gray-900">{courtStats.withLights}</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Inactive Courts</div>
          <div className="text-xl font-bold text-red-600">{courtStats.inactive}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All States</option>
              {/* States will be populated from Redux */}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Type</label>
            <select
              value={selectedOwnerType}
              onChange={(e) => setSelectedOwnerType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Owners</option>
              <option value="club">Club Owned</option>
              <option value="partner">Partner Owned</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedState('')
                setSelectedOwnerType('')
                setSelectedStatus('')
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Courts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Court Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specifications
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCourts && filteredCourts.length > 0 ? filteredCourts.map((court) => (
              <tr key={court.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{court.name}</div>
                  <div className="text-sm text-gray-500">
                    {court.court_count} court{court.court_count > 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-gray-400">ID: {court.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">{court.owner_type}</div>
                  <div className="text-sm text-gray-500">Owner ID: {court.owner_id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{court.state?.name}</div>
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {court.address || 'Address not provided'}
                  </div>
                  {court.latitude && court.longitude && (
                    <div className="text-xs text-blue-600">
                      📍 {court.latitude}, {court.longitude}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {court.surface_type || 'Surface not specified'}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      court.indoor 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {court.indoor ? 'Indoor' : 'Outdoor'}
                    </span>
                    {court.lights && (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        Lights
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    court.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : court.status === 'maintenance'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {court.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>Reservations: {court.reservation_count || 0}</div>
                  <div>Utilization: {court.utilization_rate || 0}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    View Details
                  </button>
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Performance
                  </button>
                  <button className="text-yellow-600 hover:text-yellow-900">
                    Flag Issue
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No courts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CourtRegistry