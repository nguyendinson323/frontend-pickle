import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const MicrositeManagement: React.FC = () => {
  const { microsites, loading } = useSelector((state: RootState) => state.admin)
  const [selectedOwnerType, setSelectedOwnerType] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  if (loading) {
    return <div className="p-4">Loading microsites...</div>
  }

  const filteredMicrosites = microsites.filter(microsite => {
    if (selectedOwnerType && microsite.owner_type !== selectedOwnerType) return false
    if (selectedStatus === 'active' && !microsite.is_active) return false
    if (selectedStatus === 'inactive' && microsite.is_active) return false
    return true
  })

  const micrositeStats = {
    total: microsites.length,
    active: microsites.filter(m => m.is_active).length,
    inactive: microsites.filter(m => !m.is_active).length,
    stateOwned: microsites.filter(m => m.owner_type === 'state').length,
    clubOwned: microsites.filter(m => m.owner_type === 'club').length,
    partnerOwned: microsites.filter(m => m.owner_type === 'partner').length
  }

  const handleDeactivateMicrosite = (micrositeId: number) => {
    // TODO: Implement deactivate microsite functionality
    console.log('Deactivating microsite:', micrositeId)
  }

  const handleModerateMicrosite = (micrositeId: number) => {
    // TODO: Implement moderate microsite functionality
    console.log('Moderating microsite:', micrositeId)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Microsite Management</h2>
          <p className="text-gray-600">Supervise and manage club, partner, and state committee microsites</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <span>📊</span>
            <span>Export Report</span>
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <span>🚫</span>
            <span>Bulk Moderate</span>
          </button>
        </div>
      </div>

      {/* Microsite Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-blue-600">🌐</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{micrositeStats.total}</div>
              <div className="text-sm text-gray-600">Total Microsites</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-green-600">✅</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-900">{micrositeStats.active}</div>
              <div className="text-sm text-green-700">Active</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-red-600">❌</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-red-900">{micrositeStats.inactive}</div>
              <div className="text-sm text-red-700">Inactive</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-purple-600">🏛️</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-purple-900">{micrositeStats.stateOwned}</div>
              <div className="text-sm text-purple-700">State</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-blue-600">🏢</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-blue-900">{micrositeStats.clubOwned}</div>
              <div className="text-sm text-blue-700">Club</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-orange-600">🤝</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-orange-900">{micrositeStats.partnerOwned}</div>
              <div className="text-sm text-orange-700">Partner</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Type</label>
              <select
                value={selectedOwnerType}
                onChange={(e) => setSelectedOwnerType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="state">State Committee</option>
                <option value="club">Club</option>
                <option value="partner">Partner</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedOwnerType('')
                  setSelectedStatus('')
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">View:</span>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Microsite Display */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Microsite
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMicrosites && filteredMicrosites.length > 0 ? filteredMicrosites.map((microsite) => (
                <tr key={microsite.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {microsite.logo_url && (
                        <img 
                          src={microsite.logo_url} 
                          alt="Logo" 
                          className="h-10 w-10 rounded-full mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{microsite.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {microsite.description || 'No description'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      microsite.owner_type === 'state' 
                        ? 'bg-purple-100 text-purple-800'
                        : microsite.owner_type === 'club'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {microsite.owner_type}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">ID: {microsite.owner_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-600 hover:text-blue-800">
                      {microsite.subdomain ? (
                        <a href={`https://${microsite.subdomain}.pickleballfed.com`} target="_blank" rel="noopener noreferrer">
                          {microsite.subdomain}.pickleballfed.com
                        </a>
                      ) : (
                        <span className="text-gray-500">No subdomain</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      microsite.is_active 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {microsite.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(microsite.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      View
                    </button>
                    <button 
                      onClick={() => handleModerateMicrosite(microsite.id)}
                      className="text-yellow-600 hover:text-yellow-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeactivateMicrosite(microsite.id)}
                      className={`${microsite.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                    >
                      {microsite.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No microsites found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMicrosites && filteredMicrosites.length > 0 ? filteredMicrosites.map((microsite) => (
            <div key={microsite.id} className="bg-white rounded-lg shadow overflow-hidden">
              {microsite.banner_url && (
                <img 
                  src={microsite.banner_url} 
                  alt="Banner" 
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {microsite.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    microsite.is_active 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {microsite.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {microsite.description || 'No description available'}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                    microsite.owner_type === 'state' 
                      ? 'bg-purple-100 text-purple-800'
                      : microsite.owner_type === 'club'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {microsite.owner_type}
                  </span>
                  <div className="text-xs text-gray-500">
                    Updated: {new Date(microsite.updated_at).toLocaleDateString()}
                  </div>
                </div>
                
                {microsite.subdomain && (
                  <div className="text-xs text-blue-600 hover:text-blue-800 mb-3">
                    <a href={`https://${microsite.subdomain}.pickleballfed.com`} target="_blank" rel="noopener noreferrer">
                      {microsite.subdomain}.pickleballfed.com
                    </a>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded">
                    View
                  </button>
                  <button 
                    onClick={() => handleModerateMicrosite(microsite.id)}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeactivateMicrosite(microsite.id)}
                    className={`flex-1 text-xs px-3 py-2 rounded ${
                      microsite.is_active 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {microsite.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No microsites found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MicrositeManagement