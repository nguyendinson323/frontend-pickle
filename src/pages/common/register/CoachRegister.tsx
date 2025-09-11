import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerCoach } from '../../../store/slices/authSlice'
import { fetchCommonData } from '../../../store/slices/commonSlice'
import { CoachRegisterRequest } from '../../../types'
import { RootState, AppDispatch } from '../../../store'
import { uploadFile } from '../../../services/upload'
import {
  CoachRegisterHeader,
  CoachAccountInfoSection,
  CoachPersonalInfoSection,
  CoachDocumentUploadsSection,
  CoachPrivacyPolicySection,
  CoachRegisterActions
} from '../../../components/common/register/CoachRegister'
import ImageCropModal from '../../../components/common/ImageCropModal'

const CoachRegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { data: commonData } = useSelector((state: RootState) => state.common)

  const [formData, setFormData] = useState<CoachRegisterRequest>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    fullName: '',
    birthDate: '',
    gender: 'male',
    state: '',
    curp: '',
    nrtpLevel: 1.0,
    profilePhotoUrl: '',
    idDocumentUrl: '',
    privacyPolicyAccepted: false
  })

  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)
  const [idDocumentPreview, setIdDocumentPreview] = useState<string | null>(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (!commonData) {
      dispatch(fetchCommonData())
    }
  }, [dispatch, commonData])

  const states = commonData?.states || []

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB')
      return
    }

    
    // Create preview URL for cropping
    const reader = new FileReader()
    reader.onload = (event) => {
      setCropSrc(event.target?.result as string)
      setShowCropModal(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsUploading(true)
    try {
      const data = await uploadFile(croppedBlob, 'profile-photo.png')
      
      setFormData(prev => ({ ...prev, profilePhotoUrl: data.secure_url }))
      setProfilePhotoPreview(data.secure_url)
      setShowCropModal(false)
      setCropSrc(null)
    } catch (error: any) {
      console.error('Upload failed:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
      alert(`Failed to upload photo: ${errorMessage}. Please try again.`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCropCancel = () => {
    setShowCropModal(false)
    setCropSrc(null)
  }

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG) or PDF document')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should not exceed 10MB')
      return
    }

    setIsUploading(true)
    try {
      const data = await uploadFile(file, 'id-document')
      
      setFormData(prev => ({ ...prev, idDocumentUrl: data.secure_url }))
      setIdDocumentPreview(data.secure_url)
    } catch (error: any) {
      console.error('Upload failed:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
      alert(`Failed to upload document: ${errorMessage}. Please try again.`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await dispatch(registerCoach(formData))
    navigate('/coach/dashboard')
  }

  const handleBackToSelect = () => {
    navigate('/register')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <CoachRegisterHeader />

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h2 className="text-xl font-semibold mb-2">Complete Your Coach Profile</h2>
            <p className="text-blue-100">Provide coaching qualifications and certification details</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">

            <CoachAccountInfoSection 
              formData={formData}
              onInputChange={handleInputChange}
            />

            <CoachPersonalInfoSection 
              formData={formData}
              onInputChange={handleInputChange}
              states={states}
            />


            <CoachDocumentUploadsSection 
              profilePhotoPreview={profilePhotoPreview}
              idDocumentPreview={idDocumentPreview}
              onPhotoSelect={handleFileSelect}
              onDocumentUpload={handleDocumentUpload}
              isUploading={isUploading}
            />

            <CoachPrivacyPolicySection 
              formData={formData}
              onInputChange={handleInputChange}
            />

            <CoachRegisterActions 
              isLoading={false}
              onBackToSelect={handleBackToSelect}
            />
          </form>
        </div>
      </div>

      {/* Image Crop Modal */}
      {showCropModal && cropSrc && (
        <ImageCropModal
          src={cropSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={1} // Square aspect ratio for profile photo
          cropShape="round" // Circular crop for profile photo
          isUploading={isUploading}
        />
      )}
    </div>
  )
}

export default CoachRegisterPage