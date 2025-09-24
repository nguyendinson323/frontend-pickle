import React, { useState, useEffect } from 'react'
import { CoachCertification } from '../../../types/coach'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import {
  FiX,
  FiEdit3,
  FiPlus,
  FiType,
  FiHome,
  FiCalendar,
  FiClock,
  FiUpload,
  FiSave,
  FiCheckCircle
} from 'react-icons/fi'

interface CertificationFormModalProps {
  isOpen: boolean
  certification: CoachCertification | null
  onClose: () => void
  onSubmit: (data: Partial<CoachCertification>) => void
}

const CertificationFormModal: React.FC<CertificationFormModalProps> = ({
  isOpen,
  certification,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    certificate_url: '',
    has_expiry: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (certification) {
      setFormData({
        name: certification.name,
        issuer: certification.issuer,
        issue_date: certification.issue_date,
        expiry_date: certification.expiry_date || '',
        certificate_url: certification.certificate_url,
        has_expiry: !!certification.expiry_date
      })
    } else {
      setFormData({
        name: '',
        issuer: '',
        issue_date: '',
        expiry_date: '',
        certificate_url: '',
        has_expiry: false
      })
    }
  }, [certification, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.issuer || !formData.issue_date || !formData.certificate_url) {
      return
    }

    setIsSubmitting(true)

    try {
      const submitData: Partial<CoachCertification> = {
        name: formData.name.trim(),
        issuer: formData.issuer.trim(),
        issue_date: formData.issue_date,
        certificate_url: formData.certificate_url.trim(),
        expiry_date: formData.has_expiry && formData.expiry_date ? formData.expiry_date : null
      }

      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('Error submitting certification:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCertificateUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      certificate_url: url
    }))
  }

  const isEditing = !!certification

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl max-w-3xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold flex items-center">
                {isEditing ? (
                  <FiEdit3 className="h-8 w-8 mr-4" />
                ) : (
                  <FiPlus className="h-8 w-8 mr-4" />
                )}
                {isEditing ? 'Edit Certification' : 'Add New Certification'}
              </h2>
              <p className="text-indigo-100 font-medium mt-2">
                {isEditing ? 'Update your certification details' : 'Add a new professional certification or license'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-white hover:text-gray-200 rounded-2xl hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <FiType className="h-5 w-5 mr-2 text-blue-600" />
              Basic Information
            </h3>
            <div className="space-y-6">
              {/* Certification Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-3">
                  Certification Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Certified Pickleball Instructor"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                  required
                />
              </div>

              {/* Issuer */}
              <div>
                <label htmlFor="issuer" className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                  <FiHome className="h-4 w-4 mr-2 text-blue-600" />
                  Issuing Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="issuer"
                  value={formData.issuer}
                  onChange={(e) => handleInputChange('issuer', e.target.value)}
                  placeholder="e.g., USA Pickleball Association"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <FiCalendar className="h-5 w-5 mr-2 text-green-600" />
              Certification Dates
            </h3>
            <div className="space-y-6">
              {/* Issue Date */}
              <div>
                <label htmlFor="issue_date" className="block text-sm font-bold text-gray-900 mb-3">
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="issue_date"
                  value={formData.issue_date}
                  onChange={(e) => handleInputChange('issue_date', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
                  required
                />
              </div>

              {/* Has Expiry Date Checkbox */}
              <div className="bg-white border border-green-200 rounded-2xl p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="has_expiry"
                    checked={formData.has_expiry}
                    onChange={(e) => handleInputChange('has_expiry', e.target.checked)}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-2 border-gray-300 rounded-lg"
                  />
                  <label htmlFor="has_expiry" className="ml-3 text-sm font-bold text-gray-900 flex items-center">
                    <FiClock className="h-4 w-4 mr-2 text-green-600" />
                    This certification has an expiry date
                  </label>
                </div>
              </div>

              {/* Expiry Date (conditional) */}
              {formData.has_expiry && (
                <div>
                  <label htmlFor="expiry_date" className="block text-sm font-bold text-gray-900 mb-3">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    id="expiry_date"
                    value={formData.expiry_date}
                    onChange={(e) => handleInputChange('expiry_date', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Certificate Upload Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <FiUpload className="h-5 w-5 mr-2 text-purple-600" />
              Certificate File <span className="text-red-500">*</span>
            </h3>
            <div className="space-y-4">
              <SimpleImageUpload
                fieldName="certificate_url"
                fileType="document"
                value={formData.certificate_url}
                onChange={handleCertificateUpload}
                title="Upload Certificate"
                className="w-full"
              />
              {formData.certificate_url && (
                <div className="bg-white border border-green-200 rounded-xl p-4 flex items-center">
                  <FiCheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm font-bold text-green-700">Certificate file uploaded successfully</span>
                </div>
              )}
              <div className="bg-white border border-purple-200 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700">
                  Upload your certificate file (PDF, PNG, or JPG). The file will be securely stored in the cloud.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-6 pt-8 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-bold bg-white hover:bg-gray-50 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
              disabled={isSubmitting}
            >
              <FiX className="w-5 h-5 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:transform hover:scale-105 flex items-center"
              disabled={isSubmitting || !formData.name || !formData.issuer || !formData.issue_date || !formData.certificate_url}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5 mr-2" />
                  {isEditing ? 'Update Certification' : 'Add Certification'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CertificationFormModal