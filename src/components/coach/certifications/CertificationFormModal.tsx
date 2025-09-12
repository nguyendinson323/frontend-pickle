import React, { useState, useEffect } from 'react'
import { CoachCertification } from '../../../types/coach'

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

  const isEditing = !!certification

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Edit Certification' : 'Add New Certification'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Certification Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Certification Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Certified Pickleball Instructor"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Issuer */}
            <div>
              <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 mb-2">
                Issuing Organization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="issuer"
                value={formData.issuer}
                onChange={(e) => handleInputChange('issuer', e.target.value)}
                placeholder="e.g., USA Pickleball Association"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Issue Date */}
            <div>
              <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="issue_date"
                value={formData.issue_date}
                onChange={(e) => handleInputChange('issue_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Has Expiry Date Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="has_expiry"
                checked={formData.has_expiry}
                onChange={(e) => handleInputChange('has_expiry', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="has_expiry" className="ml-2 text-sm text-gray-700">
                This certification has an expiry date
              </label>
            </div>

            {/* Expiry Date (conditional) */}
            {formData.has_expiry && (
              <div>
                <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expiry_date"
                  value={formData.expiry_date}
                  onChange={(e) => handleInputChange('expiry_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            {/* Certificate URL */}
            <div>
              <label htmlFor="certificate_url" className="block text-sm font-medium text-gray-700 mb-2">
                Certificate File URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="certificate_url"
                value={formData.certificate_url}
                onChange={(e) => handleInputChange('certificate_url', e.target.value)}
                placeholder="https://example.com/certificate.pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload your certificate to a cloud service (like Cloudinary) and paste the URL here
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
              disabled={isSubmitting || !formData.name || !formData.issuer || !formData.issue_date || !formData.certificate_url}
            >
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Certification' : 'Add Certification')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CertificationFormModal