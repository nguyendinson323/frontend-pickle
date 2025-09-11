import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerPlayer } from '../../../store/slices/authSlice'
import { fetchCommonData } from '../../../store/slices/commonSlice'
import { PlayerRegisterRequest } from '../../../types'
import { RootState, AppDispatch } from '../../../store'
import CentralizedImageUpload from '../../../components/common/CentralizedImageUpload'
import {
  PlayerRegisterHeader,
  PlayerAccountInfoSection,
  PlayerPersonalInfoSection,
  PlayerPrivacyPolicySection,
  PlayerRegisterActions
} from '../../../components/common/register/PlayerRegister'

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

          {/* Player Photo Upload */}
          <CentralizedImageUpload
            uploadType="player-photo"
            value={formData.profilePhotoUrl}
            onChange={(url) => setFormData(prev => ({ ...prev, profilePhotoUrl: url }))}
            required={true}
            title="Profile Photo"
            color="blue"
          />

          {/* Player Document Upload */}
          <CentralizedImageUpload
            uploadType="player-document"
            value={formData.idDocumentUrl}
            onChange={(url) => setFormData(prev => ({ ...prev, idDocumentUrl: url }))}
            required={true}
            title="ID Document"
            color="blue"
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
        
      </div>
    </div>
  )
}

export default PlayerRegisterPage