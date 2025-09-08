import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerPlayer } from '../../../store/slices/authSlice'
import { fetchCommonData } from '../../../store/slices/commonSlice'
import { PlayerRegisterRequest } from '../../../types'
import { RootState, AppDispatch } from '../../../store'
import {
  PlayerRegisterHeader,
  PlayerAccountInfoSection,
  PlayerPersonalInfoSection,
  PlayerDocumentUploadsSection,
  PlayerPrivacyPolicySection,
  PlayerRegisterActions
} from '../../../components/common/register/PlayerRegister'

const PlayerRegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'profilePhotoUrl' | 'idDocumentUrl') => {
    const file = e.target.files?.[0]
    if (!file) return

    const uploadData = new FormData()
    uploadData.append('file', file)
    uploadData.append('upload_preset', 'your_upload_preset')

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
        method: 'POST',
        body: uploadData
      })
      
      const data = await response.json()
      
      setFormData(prev => ({ ...prev, [fieldName]: data.secure_url }))
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await dispatch(registerPlayer(formData))
    navigate('/player/dashboard')
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
    <div className="min-h-screen bg-gray-50 py-12">
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
            onFileUpload={handleFileUpload}
          />

          <PlayerPrivacyPolicySection
            privacyAccepted={formData.privacyPolicyAccepted}
            onPrivacyAcceptedChange={(accepted) => 
              setFormData(prev => ({ ...prev, privacyPolicyAccepted: accepted }))
            }
          />

          <PlayerRegisterActions
            isFormValid={isFormValid}
            isLoading={false}
          />
        </form>
      </div>
    </div>
  )
}

export default PlayerRegisterPage