import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiAward, FiStar, FiShield, FiCheck } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { registerCoach } from '../../../store/slices/authSlice'
import { fetchCommonData } from '../../../store/slices/commonSlice'
import { CoachRegisterRequest } from '../../../types'
import { RootState, AppDispatch } from '../../../store'
import SimpleImageUpload from '../../../components/common/SimpleImageUpload'
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
  const { user: reduxUser } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState<CoachRegisterRequest>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    fullName: '',
    birthDate: '',
    gender: 'Male',
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

  // Upload handlers are no longer needed - uploads handle Redux updates automatically


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await dispatch(registerCoach(formData))
    navigate('/coach/dashboard')
  }

  const handleBackToSelect = () => {
    navigate('/register')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/4 right-20 w-48 h-48 bg-indigo-300 rounded-full blur-2xl animate-bounce opacity-20" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-400 rounded-full blur-xl animate-ping opacity-25" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-indigo-400 rounded-full blur-lg animate-pulse opacity-30" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full blur-3xl animate-spin opacity-10" style={{ animationDuration: '20s' }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <CoachRegisterHeader />

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-700">Coach Registration</span>
            </div>
            <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <FiCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-700">Certification Setup</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-blue-200">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                  <FiUser className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Complete Your Coach Profile</h2>
                  <p className="text-blue-100 text-lg">Provide coaching qualifications and certification details</p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FiAward className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Coaching Certification</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FiStar className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Student Management</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FiShield className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Verified Coach Status</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            <CoachAccountInfoSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <CoachPersonalInfoSection
              formData={formData}
              onInputChange={handleInputChange}
              states={states}
            />

            {/* Enhanced Photo Upload */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <SimpleImageUpload
                fieldName="profile_photo_url"
                fileType="image"
                value={formData.profilePhotoUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, profilePhotoUrl: url }))}
                required={true}
                title="Profile Photo"
                enableCropping={true}
                aspectRatio={1}
              />
            </div>

            {/* Enhanced Document Upload */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <SimpleImageUpload
                fieldName="id_document_url"
                fileType="document"
                value={formData.idDocumentUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, idDocumentUrl: url }))}
                required={true}
                title="ID Document"
                enableCropping={false}
              />
            </div>

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