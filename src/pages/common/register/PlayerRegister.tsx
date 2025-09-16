import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiUser, FiCamera, FiFileText, FiCheck } from 'react-icons/fi'
import { loginSuccess } from '../../../store/slices/authSlice'
import { startLoading, stopLoading } from '../../../store/slices/loadingSlice'
import api from '../../../services/api'
import { fetchCommonData } from '../../../store/slices/commonSlice'
import { PlayerRegisterRequest } from '../../../types'
import { RootState, AppDispatch } from '../../../store'
import SimpleImageUpload from '../../../components/common/SimpleImageUpload'
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
  const { user: reduxUser } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState<PlayerRegisterRequest>({
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

  // Upload handlers are no longer needed - uploads handle Redux updates automatically


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      dispatch(startLoading('Creating your player account...'))

      // Get the latest uploaded file URLs from Redux (temporarily stored in user during registration)
      const latestProfilePhotoUrl = (reduxUser as any)?.profile_photo_url || formData.profilePhotoUrl
      const latestDocumentUrl = (reduxUser as any)?.id_document_url || formData.idDocumentUrl

      // Based on database schema, prepare data for backend
      // Backend expects: { userData: {...}, profileData: {...} }
      const registrationData = {
        userData: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'player' as const,
          phone: formData.phoneNumber
        },
        profileData: {
          full_name: formData.fullName,
          birth_date: formData.birthDate,
          gender: formData.gender,
          state_id: parseInt(formData.state),
          curp: formData.curp,
          nrtp_level: parseFloat(formData.nrtpLevel.toString()),
          profile_photo_url: latestProfilePhotoUrl,
          id_document_url: latestDocumentUrl,
          nationality: formData.nationality || 'Mexico'
        }
      }

      console.log('🚀 Starting player registration with correct schema:', {
        userData: registrationData.userData,
        profileData: registrationData.profileData,
        uploadedUrls: {
          profile_photo_url: latestProfilePhotoUrl,
          id_document_url: latestDocumentUrl
        }
      })

      // Call the backend registration API directly with correct schema
      const response = await api.post('/api/auth/register', registrationData)

      // Handle successful registration same as registerPlayer
      dispatch(loginSuccess(response.data as any))
      console.log('✅ Registration successful:', response.data)

      // Check if registration was successful
      if (response.data && (response.data as any).user) {
        console.log('🎉 Registration successful, navigating to dashboard')
        navigate('/player/dashboard')
      } else {
        console.error('❌ Registration failed: No user data returned')
        alert('Registration failed. Please try again.')
      }
    } catch (error: any) {
      console.error('❌ Registration failed:', error)

      let errorMessage = 'Registration failed. Please try again.'
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.message) {
        errorMessage = error.message
      }

      alert(errorMessage)
    } finally {
      dispatch(stopLoading())
    }
  }

  const getValidationErrors = () => {
    const errors = []
    const latestProfilePhotoUrl = (reduxUser as any)?.profile_photo_url || formData.profilePhotoUrl
    const latestDocumentUrl = (reduxUser as any)?.id_document_url || formData.idDocumentUrl

    // if (!formData.username.trim()) errors.push('Username is required')
    // if (!formData.email.trim()) errors.push('Email is required')
    // if (!formData.password.trim()) errors.push('Password is required')
    // if (!formData.confirmPassword.trim()) errors.push('Password confirmation is required')
    // if (formData.password !== formData.confirmPassword) errors.push('Passwords do not match')
    // if (!formData.phoneNumber.trim()) errors.push('Phone number is required')
    // if (!formData.fullName.trim()) errors.push('Full name is required')
    // if (!formData.birthDate) errors.push('Birth date is required')
    // if (!formData.state) errors.push('State selection is required')
    // if (!latestProfilePhotoUrl) errors.push('Profile photo is required')
    // if (!latestDocumentUrl) errors.push('ID document is required')
    // if (!formData.privacyPolicyAccepted) errors.push('Privacy policy acceptance is required')

    return errors
  }

  const isFormValid = () => {
    return getValidationErrors().length === 0
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
        <PlayerRegisterHeader />

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-700">Player Registration</span>
            </div>
            <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <FiCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-700">Account Setup</span>
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
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Complete Your Player Profile</h2>
                  <p className="text-blue-100 text-lg">Join the federation and access tournaments, courts, and community</p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FiUser className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Tournament Access</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FiCamera className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Court Reservations</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FiFileText className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Player Network</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            <PlayerAccountInfoSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <PlayerPersonalInfoSection
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
    </div>
  )
}

export default PlayerRegisterPage