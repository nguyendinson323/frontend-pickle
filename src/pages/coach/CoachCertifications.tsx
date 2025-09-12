import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { 
  fetchCoachCertificationsData, 
  setFilters, 
  setError,
  addCoachCertification,
  updateCoachCertification,
  deleteCoachCertification,
  downloadCertificate
} from '../../store/slices/coachCertificationsSlice'
import { 
  CertificationsHeader,
  CertificationsList,
  CertificationsFilters,
  CertificationFormModal,
  DeleteConfirmationModal
} from '../../components/coach/certifications'

import { CoachCertification } from '../../types/coach'

const CoachCertificationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { certifications, stats, filters, isLoading, error } = useSelector((state: RootState) => state.coachCertifications)
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingCertification, setEditingCertification] = useState<CoachCertification | null>(null)
  const [deletingCertification, setDeletingCertification] = useState<CoachCertification | null>(null)

  useEffect(() => {
    dispatch(fetchCoachCertificationsData())
  }, [dispatch])

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters))
  }

  const handleClearFilters = () => {
    dispatch(setFilters({
      status: 'all',
      issuer: '',
      search: ''
    }))
  }

  const handleAddNew = () => {
    setEditingCertification(null)
    setIsFormModalOpen(true)
  }

  const handleEdit = (certification: CoachCertification) => {
    setEditingCertification(certification)
    setIsFormModalOpen(true)
  }

  const handleDelete = (certification: CoachCertification) => {
    setDeletingCertification(certification)
    setIsDeleteModalOpen(true)
  }

  const handleDownload = (certificationId: number) => {
    dispatch(downloadCertificate(certificationId))
  }

  const handleFormSubmit = (data: Partial<CoachCertification>) => {
    if (editingCertification) {
      dispatch(updateCoachCertification(editingCertification.id, data))
    } else {
      dispatch(addCoachCertification(data))
    }
    setIsFormModalOpen(false)
    setEditingCertification(null)
  }

  const handleDeleteConfirm = (certificationId: number) => {
    dispatch(deleteCoachCertification(certificationId))
    setIsDeleteModalOpen(false)
    setDeletingCertification(null)
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setEditingCertification(null)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeletingCertification(null)
  }

  if (isLoading && certifications.length === 0) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your certifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => dispatch(setError(null))}
                  className="text-red-400 hover:text-red-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Header */}
        {stats && (
          <CertificationsHeader
            totalCertifications={stats.total_certifications}
            activeCertifications={stats.active_certifications}
            expiredCertifications={stats.expired_certifications}
            expiringSoon={stats.expiring_soon}
          />
        )}

        {/* Filters */}
        <CertificationsFilters
          filters={filters}
          certifications={certifications}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          onAddNew={handleAddNew}
        />

        {/* Certifications List */}
        <CertificationsList
          certifications={certifications}
          filters={filters}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />

        {/* Form Modal */}
        <CertificationFormModal
          isOpen={isFormModalOpen}
          certification={editingCertification}
          onClose={handleCloseFormModal}
          onSubmit={handleFormSubmit}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          certification={deletingCertification}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteConfirm}
        />

        {/* Expiring Soon Alert */}
        {stats && stats.expiring_soon > 0 && (
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Attention:</strong> You have {stats.expiring_soon} certification{stats.expiring_soon > 1 ? 's' : ''} expiring within the next 30 days. 
                  Consider renewing them to maintain your credentials.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {stats && certifications.length > 0 && (
          <div className="mt-6 bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Certification Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Status Distribution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active</span>
                    <span className="text-sm font-medium text-green-600">
                      {stats.active_certifications} ({Math.round((stats.active_certifications / stats.total_certifications) * 100)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expiring Soon</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {stats.expiring_soon} ({Math.round((stats.expiring_soon / stats.total_certifications) * 100)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expired</span>
                    <span className="text-sm font-medium text-red-600">
                      {stats.expired_certifications} ({Math.round((stats.expired_certifications / stats.total_certifications) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
                <div className="text-sm text-gray-600">
                  {certifications.length > 0 ? (
                    <div>
                      Most recent certification: {certifications
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
                        .name}
                    </div>
                  ) : (
                    <div>No certifications added yet</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoachCertificationsPage