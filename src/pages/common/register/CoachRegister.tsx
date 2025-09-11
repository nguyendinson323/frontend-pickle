import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerCoach } from '../../../store/slices/authSlice'
import { fetchCommonData } from '../../../store/slices/commonSlice'
import { CoachRegisterRequest } from '../../../types'
import { RootState, AppDispatch } from '../../../store'
import CentralizedImageUpload from '../../../components/common/CentralizedImageUpload'
import {
  CoachRegisterHeader,
  CoachAccountInfoSection,
  CoachPersonalInfoSection,
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
    nrtpLevel: 1.0,
    profilePhotoUrl: '',
    idDocumentUrl: '',
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


            {/* Coach Photo Upload */}
            <CentralizedImageUpload
              uploadType="coach-photo"
              value={formData.profilePhotoUrl}
              onChange={(url) => setFormData(prev => ({ ...prev, profilePhotoUrl: url }))}
              required={true}
              title="Profile Photo"
              color="blue"
            />

            {/* Coach Document Upload */}
            <CentralizedImageUpload
              uploadType="coach-document"
              value={formData.idDocumentUrl}
              onChange={(url) => setFormData(prev => ({ ...prev, idDocumentUrl: url }))}
              required={true}
              title="ID Document"
              color="blue"
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
  )
}

export default CoachRegisterPage