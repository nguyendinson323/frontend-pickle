import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  FiMapPin,
  FiSettings,
  FiCalendar,
  FiTool,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi'
import {
  fetchClubCourtsData,
  createCourt,
  updateCourtInfo,
  deleteCourtInfo,
  updateReservationStatusInfo,
  createCourtMaintenance,
  updateMaintenanceInfo,
  updateCourtScheduleInfo,
  setSelectedCourt
} from '../../store/slices/clubCourtsSlice'
import {
  CourtsHeader,
  CourtsList,
  CourtFormModal,
  ReservationsManager,
  MaintenanceManager
} from '../../components/club/courts'
import CourtScheduleManager from '../../components/club/courts/CourtScheduleManager'

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
  const { courts, courtSchedules, reservations, maintenance, stats, selectedCourt, loading, error } = useSelector((state: RootState) => state.clubCourts)

  const [activeTab, setActiveTab] = useState<'courts' | 'reservations' | 'maintenance' | 'schedules'>('courts')
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
    dispatch(setSelectedCourt(court))
    setActiveTab('schedules')
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

  const handleUpdateSchedule = async (scheduleId: number, scheduleData: any) => {
    try {
      await dispatch(updateCourtScheduleInfo(scheduleId, scheduleData))
      showSuccessMessage('Court schedule updated successfully!')
    } catch (error) {
      console.error('Error updating schedule:', error)
    }
  }

  if (loading && courts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-6">
            <FiLoader className="animate-spin h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Your Courts</h3>
          <p className="text-gray-600 font-medium">Please wait while we fetch your court information</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                <FiCheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-green-900 mb-1">Success!</h4>
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                <FiAlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-red-900 mb-1">Error</h4>
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
        <div className="bg-white shadow-2xl rounded-3xl mb-8 border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex p-4">
              <button
                onClick={() => setActiveTab('courts')}
                className={`flex items-center py-4 px-8 border-b-2 font-bold text-sm rounded-t-2xl transition-all duration-200 ${
                  activeTab === 'courts'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FiMapPin className="h-5 w-5 mr-2" />
                My Courts ({courts.length})
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`flex items-center py-4 px-8 border-b-2 font-bold text-sm rounded-t-2xl transition-all duration-200 ml-2 ${
                  activeTab === 'reservations'
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FiCalendar className="h-5 w-5 mr-2" />
                Reservations ({reservations.length})
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`flex items-center py-4 px-8 border-b-2 font-bold text-sm rounded-t-2xl transition-all duration-200 ml-2 ${
                  activeTab === 'maintenance'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FiTool className="h-5 w-5 mr-2" />
                Maintenance ({maintenance.length})
              </button>
              <button
                onClick={() => setActiveTab('schedules')}
                className={`flex items-center py-4 px-8 border-b-2 font-bold text-sm rounded-t-2xl transition-all duration-200 ml-2 ${
                  activeTab === 'schedules'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FiSettings className="h-5 w-5 mr-2" />
                Schedules ({courtSchedules.length})
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

        {activeTab === 'schedules' && (
          <CourtScheduleManager
            schedules={courtSchedules}
            courts={courts}
            selectedCourtId={selectedCourt?.id}
            onUpdateSchedule={handleUpdateSchedule}
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