import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerPlayer } from '../../../store/slices/authSlice'
import { fetchCommonData } from '../../../store/slices/commonSlice'
import { PlayerRegisterRequest } from '../../../types'
import { RootState, AppDispatch } from '../../../store'
import { uploadPlayerPhoto, uploadPlayerDocument } from '../../../services/playerUpload'
import {
  PlayerRegisterHeader,
  PlayerAccountInfoSection,
  PlayerPersonalInfoSection,
  PlayerDocumentUploadsSection,
  PlayerPrivacyPolicySection,
  PlayerRegisterActions
} from '../../../components/common/register/PlayerRegister'
import ImageCropModal from '../../../components/common/ImageCropModal'

const PlayerRegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading } = useSelector((state: RootState) => state.loading)
  const { data: commonData } = useSelector((state: RootState) => state.common)

  const [formData, setFormData] = useState<PlayerRegisterRequest>({
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
    nrtpLevel: '1.0',
    profilePhotoUrl: '',
    idDocumentUrl: '',
    nationality: 'Mexico',
    privacyPolicyAccepted: false
  })

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
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

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setCropSrc(result)
      setShowCropModal(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsUploading(true)
    
    try {
      const uploadResponse = await uploadPlayerPhoto(croppedBlob)
      setFormData(prev => ({ ...prev, profilePhotoUrl: uploadResponse.secure_url }))
      setPhotoPreview(uploadResponse.secure_url)
      setShowCropModal(false)
      setCropSrc(null)
    } catch (error) {
      console.error('Upload failed:', error)
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

    setIsUploading(true)
    
    try {
      const uploadResponse = await uploadPlayerDocument(file)
      setFormData(prev => ({ ...prev, idDocumentUrl: uploadResponse.secure_url }))
    } catch (error) {
      console.error('Document upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handlePhotoRemove = () => {
    setPhotoPreview(null)
    setFormData(prev => ({ ...prev, profilePhotoUrl: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await dispatch(registerPlayer(formData))
      navigate('/player/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  const isFormValid = () => {
    return !!(
      formData.username.trim() &&
      formData.email.trim() &&
      formData.password.trim() &&
      formData.password === formData.confirmPassword &&
      formData.fullName.trim() &&
      formData.birthDate &&
      formData.state &&
      formData.profilePhotoUrl &&
      formData.idDocumentUrl &&
      formData.privacyPolicyAccepted
    )
  }

  return (
    <div className="min-h-screen  py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PlayerRegisterHeader />

        <form onSubmit={handleSubmit} className="space-y-8">

          <PlayerAccountInfoSection
            formData={formData}
            onInputChange={handleInputChange}
          />

          <PlayerPersonalInfoSection
            formData={formData}
            onInputChange={handleInputChange}
            states={states}
          />

          <PlayerDocumentUploadsSection
            formData={formData}
            photoPreview={photoPreview}
            onPhotoSelect={handlePhotoSelect}
            onPhotoRemove={handlePhotoRemove}
            onDocumentUpload={handleDocumentUpload}
            isUploading={isUploading}
          />

          <PlayerPrivacyPolicySection
            privacyAccepted={formData.privacyPolicyAccepted}
            onPrivacyAcceptedChange={(accepted) => 
              setFormData(prev => ({ ...prev, privacyPolicyAccepted: accepted }))
            }
          />

          <PlayerRegisterActions
            isFormValid={isFormValid}
            isLoading={isLoading}
          />
        </form>
        
        {/* Image Crop Modal */}
        {showCropModal && cropSrc && (
          <ImageCropModal
            src={cropSrc}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
            aspectRatio={1}
            cropShape="round"
            isUploading={isUploading}
          />
        )}
      </div>
    </div>
  )
}

export default PlayerRegisterPage