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
import {
  FiLoader,
  FiAlertCircle,
  FiX,
  FiAlertTriangle,
  FiTrendingUp,
  FiBarChart2
} from 'react-icons/fi'

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-indigo-600 mx-auto mb-6">
              <FiLoader className="h-8 w-8 text-transparent" />
            </div>
            <p className="text-gray-600 font-medium text-lg">Loading your certifications...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your professional credentials</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl shadow-lg overflow-hidden">
            <div className="flex items-center p-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                  <FiAlertCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-1">Something went wrong</h3>
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() => dispatch(setError(null))}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200"
                >
                  <FiX className="w-5 h-5" />
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
          <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-3xl shadow-lg overflow-hidden">
            <div className="flex items-center p-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  <FiAlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-yellow-900 mb-1">Attention Required</h3>
                <p className="text-sm font-medium text-yellow-800">
                  You have <span className="font-bold">{stats.expiring_soon}</span> certification{stats.expiring_soon > 1 ? 's' : ''} expiring within the next 30 days.
                  Consider renewing them to maintain your credentials.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {stats && certifications.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FiBarChart2 className="h-6 w-6 mr-3 text-indigo-600" />
              Certification Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FiTrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Status Distribution
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white rounded-xl p-3 border border-green-200">
                    <span className="text-sm font-medium text-gray-700">Active</span>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-xl">
                      {stats.active_certifications} ({Math.round((stats.active_certifications / stats.total_certifications) * 100)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-xl p-3 border border-yellow-200">
                    <span className="text-sm font-medium text-gray-700">Expiring Soon</span>
                    <span className="text-sm font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-xl">
                      {stats.expiring_soon} ({Math.round((stats.expiring_soon / stats.total_certifications) * 100)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-xl p-3 border border-red-200">
                    <span className="text-sm font-medium text-gray-700">Expired</span>
                    <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-xl">
                      {stats.expired_certifications} ({Math.round((stats.expired_certifications / stats.total_certifications) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FiBarChart2 className="h-5 w-5 mr-2 text-purple-600" />
                  Recent Activity
                </h4>
                <div className="bg-white rounded-xl p-4 border border-purple-200">
                  {certifications.length > 0 ? (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Most recent certification:</div>
                      <div className="text-base font-bold text-purple-900">
                        {certifications
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
                          .name}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 font-medium">No certifications added yet</div>
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