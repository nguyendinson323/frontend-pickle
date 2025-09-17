import React, { useState } from 'react'
import {
  FiTool,
  FiPlus,
  FiEdit2,
  FiPlay,
  FiCheck,
  FiX,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiClock,
  FiInfo,
  FiFilter,
  FiSave,
  FiFileText,
  FiCheckCircle
} from 'react-icons/fi'

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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          className: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
          icon: FiCheckCircle
        }
      case 'in_progress':
        return {
          className: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200',
          icon: FiPlay
        }
      case 'scheduled':
        return {
          className: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200',
          icon: FiClock
        }
      default:
        return {
          className: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-200',
          icon: FiClock
        }
    }
  }

  // Filter maintenance records
  const filteredMaintenance = statusFilter === 'all' 
    ? maintenance 
    : maintenance.filter(item => item.status === statusFilter)

  return (
    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-orange-50 to-yellow-100 px-8 py-6 border-b-2 border-orange-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiTool className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Maintenance Management</h3>
              <p className="text-orange-700 font-medium">{filteredMaintenance.length} maintenance record{filteredMaintenance.length !== 1 ? 's' : ''} found</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-yellow-700 text-white font-bold rounded-2xl hover:from-orange-700 hover:to-yellow-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <FiPlus className="h-5 w-5 mr-2" />
            Add Maintenance
          </button>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-2xl p-4 border-2 border-orange-200 shadow-lg">
          <div className="flex items-center mb-3">
            <FiFilter className="h-5 w-5 text-orange-600 mr-2" />
            <h4 className="text-lg font-bold text-gray-900">Filter by Status</h4>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium transition-all duration-200 w-full md:w-auto"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="bg-gradient-to-r from-orange-600 to-yellow-700 text-white p-8 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                    {editingMaintenance ? <FiEdit2 className="h-6 w-6" /> : <FiPlus className="h-6 w-6" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      {editingMaintenance ? 'Edit Maintenance Record' : 'Add New Maintenance'}
                    </h2>
                    <p className="text-orange-100 font-medium">
                      {editingMaintenance ? 'Update maintenance details and status' : 'Schedule new maintenance work'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-3">
                    <FiInfo className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                      <FiMapPin className="h-4 w-4 mr-2" />
                      Court
                    </label>
                    <select
                      value={formData.court_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, court_id: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all duration-200"
                      required
                    >
                      <option value="">Select Court</option>
                      {courts.map(court => (
                        <option key={court.id} value={court.id}>{court.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                      <FiTool className="h-4 w-4 mr-2" />
                      Maintenance Type
                    </label>
                    <input
                      type="text"
                      value={formData.maintenance_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, maintenance_type: e.target.value }))}
                      placeholder="e.g., Surface repair, Net replacement"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-100 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-3">
                    <FiFileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Description & Details</h3>
                </div>
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                    <FiFileText className="h-4 w-4 mr-2" />
                    Maintenance Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of maintenance work required"
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none font-medium transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mr-3">
                    <FiCalendar className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Schedule & Budget</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                      <FiCalendar className="h-4 w-4 mr-2" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                      <FiCalendar className="h-4 w-4 mr-2" />
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                      <FiDollarSign className="h-4 w-4 mr-2" />
                      Cost ($)
                    </label>
                    <input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-2xl p-6 border-2 border-yellow-200">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-white mr-3">
                    <FiInfo className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Additional Notes</h3>
                </div>
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                    <FiInfo className="h-4 w-4 mr-2" />
                    Notes & Comments
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes, special requirements, or important information"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none font-medium transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-6 bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t-2 border-gray-200 rounded-b-2xl">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 inline-flex items-center justify-center px-6 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <FiX className="h-5 w-5 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-600 to-yellow-700 text-white font-bold rounded-2xl hover:from-orange-700 hover:to-yellow-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <FiSave className="h-5 w-5 mr-2" />
                  {editingMaintenance ? 'Update' : 'Add'} Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Maintenance List */}
      {filteredMaintenance.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <FiTool className="h-12 w-12 text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No Maintenance Records</h3>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            {statusFilter === 'all'
              ? 'No maintenance records found. Add your first maintenance record to track court upkeep.'
              : `No ${statusFilter} maintenance records found. Try adjusting the filter or add new records.`}
          </p>
        </div>
      ) : (
        <div className="divide-y-2 divide-gray-100">
          {filteredMaintenance.map((item, index) => {
            const statusInfo = getStatusInfo(item.status)
            const StatusIcon = statusInfo.icon

            return (
              <div key={item.id} className="p-8 hover:bg-gradient-to-r hover:from-gray-50 hover:to-orange-50 transition-all duration-200 animate-table-row" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <FiTool className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <h4 className="text-xl font-bold text-gray-900">{item.maintenance_type}</h4>
                        <div className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-2xl border-2 ${statusInfo.className} shadow-sm`}>
                          <StatusIcon className="h-4 w-4 mr-2" />
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <FiMapPin className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-bold text-gray-700">Court:</span>
                              <p className="text-sm font-medium text-gray-900">{item.court.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <FiCalendar className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-bold text-gray-700">Period:</span>
                              <p className="text-sm font-medium text-gray-900">{formatDate(item.start_date)} - {formatDate(item.end_date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <FiDollarSign className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-bold text-gray-700">Cost:</span>
                              <p className="text-sm font-medium text-gray-900">${item.cost.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                          <FiFileText className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="text-sm font-bold text-gray-700">Description:</span>
                            <p className="text-sm font-medium text-gray-900">{item.description}</p>
                          </div>
                        </div>
                        {item.notes && (
                          <div className="flex items-start p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <FiInfo className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <span className="text-sm font-bold text-gray-700">Notes:</span>
                              <p className="text-sm font-medium text-gray-900">{item.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-3 ml-6">
                    <button
                      onClick={() => handleEdit(item)}
                      className="inline-flex items-center px-4 py-2 text-sm font-bold text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-blue-200 rounded-xl hover:from-blue-200 hover:to-blue-300 hover:border-blue-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiEdit2 className="h-4 w-4 mr-2" />
                      Edit
                    </button>

                    {item.status === 'scheduled' && (
                      <button
                        onClick={() => handleStatusUpdate(item.id, 'in_progress')}
                        className="inline-flex items-center px-4 py-2 text-sm font-bold text-yellow-700 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-200 rounded-xl hover:from-yellow-200 hover:to-orange-200 hover:border-yellow-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        <FiPlay className="h-4 w-4 mr-2" />
                        Start
                      </button>
                    )}

                    {item.status === 'in_progress' && (
                      <button
                        onClick={() => handleStatusUpdate(item.id, 'completed')}
                        className="inline-flex items-center px-4 py-2 text-sm font-bold text-green-700 bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-200 rounded-xl hover:from-green-200 hover:to-green-300 hover:border-green-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <FiCheck className="h-4 w-4 mr-2" />
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MaintenanceManager