import React, { useState } from 'react'

interface CourtMaintenance {
  id: number
  court_id: number
  maintenance_type: string
  description: string
  start_date: string
  end_date: string
  status: 'scheduled' | 'in_progress' | 'completed'
  cost: number
  notes: string
  created_at: string
  court: {
    id: number
    name: string
  }
}

interface Court {
  id: number
  name: string
}

interface MaintenanceManagerProps {
  maintenance: CourtMaintenance[]
  courts: Court[]
  onAddMaintenance: (maintenanceData: any) => void
  onUpdateMaintenance: (maintenanceId: number, maintenanceData: any) => void
}

const MaintenanceManager: React.FC<MaintenanceManagerProps> = ({
  maintenance,
  courts,
  onAddMaintenance,
  onUpdateMaintenance
}) => {
  const [showForm, setShowForm] = useState(false)
  const [editingMaintenance, setEditingMaintenance] = useState<CourtMaintenance | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  const [formData, setFormData] = useState({
    court_id: '',
    maintenance_type: '',
    description: '',
    start_date: '',
    end_date: '',
    cost: 0,
    notes: ''
  })

  const resetForm = () => {
    setFormData({
      court_id: '',
      maintenance_type: '',
      description: '',
      start_date: '',
      end_date: '',
      cost: 0,
      notes: ''
    })
    setEditingMaintenance(null)
    setShowForm(false)
  }

  const handleEdit = (maintenanceItem: CourtMaintenance) => {
    setFormData({
      court_id: maintenanceItem.court_id.toString(),
      maintenance_type: maintenanceItem.maintenance_type,
      description: maintenanceItem.description,
      start_date: maintenanceItem.start_date,
      end_date: maintenanceItem.end_date,
      cost: maintenanceItem.cost,
      notes: maintenanceItem.notes || ''
    })
    setEditingMaintenance(maintenanceItem)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const maintenanceData = {
      ...formData,
      court_id: parseInt(formData.court_id),
      cost: Number(formData.cost)
    }

    if (editingMaintenance) {
      onUpdateMaintenance(editingMaintenance.id, maintenanceData)
    } else {
      onAddMaintenance(maintenanceData)
    }
    
    resetForm()
  }

  const handleStatusUpdate = (maintenanceId: number, status: string) => {
    onUpdateMaintenance(maintenanceId, { status })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter maintenance records
  const filteredMaintenance = statusFilter === 'all' 
    ? maintenance 
    : maintenance.filter(item => item.status === statusFilter)

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Maintenance Records ({filteredMaintenance.length})
          </h3>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Add Maintenance
          </button>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Maintenance Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingMaintenance ? 'Edit Maintenance' : 'Add Maintenance'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Court</label>
                  <select
                    value={formData.court_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, court_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Court</option>
                    {courts.map(court => (
                      <option key={court.id} value={court.id}>{court.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Type</label>
                  <input
                    type="text"
                    value={formData.maintenance_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, maintenance_type: e.target.value }))}
                    placeholder="e.g., Surface repair, Net replacement"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of maintenance work"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($)</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or comments"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover: transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                >
                  {editingMaintenance ? 'Update' : 'Add'} Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Maintenance List */}
      {filteredMaintenance.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">
            <div className="text-4xl mb-2">🔧</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Maintenance Records</h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? 'No maintenance records found. Add your first maintenance record.'
                : `No ${statusFilter} maintenance records found.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredMaintenance.map((item) => (
            <div key={item.id} className="p-6 hover: transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{item.maintenance_type}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center space-x-4">
                      <span>
                        <span className="font-medium">Court:</span> {item.court.name}
                      </span>
                      <span>
                        <span className="font-medium">Period:</span> {formatDate(item.start_date)} - {formatDate(item.end_date)}
                      </span>
                      <span>
                        <span className="font-medium">Cost:</span> ${item.cost.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Description:</span> {item.description}
                    </div>
                    {item.notes && (
                      <div>
                        <span className="font-medium">Notes:</span> {item.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  
                  {item.status === 'scheduled' && (
                    <button
                      onClick={() => handleStatusUpdate(item.id, 'in_progress')}
                      className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors duration-200"
                    >
                      Start
                    </button>
                  )}
                  
                  {item.status === 'in_progress' && (
                    <button
                      onClick={() => handleStatusUpdate(item.id, 'completed')}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MaintenanceManager