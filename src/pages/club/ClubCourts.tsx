import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { 
  fetchClubCourtsData,
  createCourt,
  updateCourtInfo,
  deleteCourtInfo,
  updateReservationStatusInfo,
  createCourtMaintenance,
  updateMaintenanceInfo,
  setSelectedCourt
} from '../../store/slices/clubCourtsSlice'
import { 
  CourtsHeader,
  CourtsList,
  CourtFormModal,
  ReservationsManager,
  MaintenanceManager
} from '../../components/club/courts'

interface Court {
  id: number
  name: string
  owner_type: string
  owner_id: number
  address: string
  state_id: number
  court_count: number
  surface_type: string
  indoor: boolean
  lights: boolean
  amenities: string
  description: string
  status: 'active' | 'maintenance' | 'inactive'
  created_at: string
  updated_at: string
}

const ClubCourtsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { courts, reservations, maintenance, stats, selectedCourt, loading, error } = useSelector((state: RootState) => state.clubCourts)
  
  const [activeTab, setActiveTab] = useState<'courts' | 'reservations' | 'maintenance'>('courts')
  const [isCourtFormOpen, setIsCourtFormOpen] = useState(false)
  const [editingCourt, setEditingCourt] = useState<Court | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    dispatch(fetchClubCourtsData())
  }, [dispatch])

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 5000)
  }

  const handleAddCourt = () => {
    setEditingCourt(null)
    setIsCourtFormOpen(true)
  }

  const handleEditCourt = (court: Court) => {
    setEditingCourt(court)
    setIsCourtFormOpen(true)
  }

  const handleSubmitCourt = async (courtData: any) => {
    try {
      if (editingCourt) {
        await dispatch(updateCourtInfo(editingCourt.id, courtData))
        showSuccessMessage('Court updated successfully!')
      } else {
        await dispatch(createCourt(courtData))
        showSuccessMessage('Court added successfully!')
      }
      setIsCourtFormOpen(false)
      setEditingCourt(null)
    } catch (error) {
      console.error('Error saving court:', error)
    }
  }

  const handleDeleteCourt = async (courtId: number) => {
    try {
      await dispatch(deleteCourtInfo(courtId))
      showSuccessMessage('Court deleted successfully!')
    } catch (error) {
      console.error('Error deleting court:', error)
    }
  }

  const handleManageSchedule = (court: Court) => {
    // Navigate to court schedule management (could be a separate page or modal)
    dispatch(setSelectedCourt(court))
    showSuccessMessage(`Schedule management for ${court.name} - Feature coming soon!`)
  }

  const handleViewReservations = (court: Court) => {
    dispatch(setSelectedCourt(court))
    setActiveTab('reservations')
  }

  const handleUpdateReservationStatus = async (reservationId: number, status: string) => {
    try {
      await dispatch(updateReservationStatusInfo(reservationId, status))
      showSuccessMessage('Reservation status updated successfully!')
    } catch (error) {
      console.error('Error updating reservation:', error)
    }
  }

  const handleAddMaintenance = async (maintenanceData: any) => {
    try {
      await dispatch(createCourtMaintenance(maintenanceData))
      showSuccessMessage('Maintenance record added successfully!')
    } catch (error) {
      console.error('Error adding maintenance:', error)
    }
  }

  const handleUpdateMaintenance = async (maintenanceId: number, maintenanceData: any) => {
    try {
      await dispatch(updateMaintenanceInfo(maintenanceId, maintenanceData))
      showSuccessMessage('Maintenance record updated successfully!')
    } catch (error) {
      console.error('Error updating maintenance:', error)
    }
  }

  if (loading && courts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your courts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        {stats && (
          <CourtsHeader
            totalCourts={stats.total_courts}
            totalReservations={stats.total_reservations}
            monthlyRevenue={stats.monthly_revenue}
            occupancyRate={stats.occupancy_rate}
            upcomingMaintenance={stats.upcoming_maintenance}
          />
        )}

        {/* Tab Navigation */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('courts')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'courts'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Courts ({courts.length})
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'reservations'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reservations ({reservations.length})
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'maintenance'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Maintenance ({maintenance.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'courts' && (
          <CourtsList
            courts={courts}
            onEditCourt={handleEditCourt}
            onDeleteCourt={handleDeleteCourt}
            onAddCourt={handleAddCourt}
            onManageSchedule={handleManageSchedule}
            onViewReservations={handleViewReservations}
          />
        )}

        {activeTab === 'reservations' && (
          <ReservationsManager
            reservations={reservations}
            onUpdateStatus={handleUpdateReservationStatus}
            selectedCourtId={selectedCourt?.id}
          />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceManager
            maintenance={maintenance}
            courts={courts}
            onAddMaintenance={handleAddMaintenance}
            onUpdateMaintenance={handleUpdateMaintenance}
          />
        )}

        {/* Court Form Modal */}
        <CourtFormModal
          isOpen={isCourtFormOpen}
          onClose={() => {
            setIsCourtFormOpen(false)
            setEditingCourt(null)
          }}
          onSubmit={handleSubmitCourt}
          court={editingCourt}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default ClubCourtsPage