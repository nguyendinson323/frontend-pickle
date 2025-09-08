import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Layout } from '../../../components/layout'
import { registerCoach } from '../../../store/slices/authSlice'
import { fetchCommonData } from '../../../store/slices/commonSlice'
import { CoachRegisterRequest } from '../../../types'
import { RootState, AppDispatch } from '../../../store'
import {
  CoachRegisterHeader,
  CoachAccountInfoSection,
  CoachPersonalInfoSection,
  CoachDocumentUploadsSection,
  CoachPrivacyPolicySection,
  CoachRegisterActions
} from '../../../components/common/register/CoachRegister'

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
    profilePhotoUrl: '',
    idDocumentUrl: '',
    privacyPolicyAccepted: false
  })

  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)
  const [idDocumentPreview, setIdDocumentPreview] = useState<string | null>(null)

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

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'your_upload_preset')

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      setFormData(prev => ({ ...prev, [fieldName]: data.secure_url }))
      
      if (fieldName === 'profilePhotoUrl') {
        setProfilePhotoPreview(data.secure_url)
      } else {
        setIdDocumentPreview(data.secure_url)
      }
    } catch (error) {
      console.error('Upload failed:', error)
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
    <Layout>
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
                onFileUpload={handleFileUpload}
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
      </div>
    </Layout>
  )
}

export default CoachRegisterPage