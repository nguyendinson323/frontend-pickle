import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiHome, FiUsers, FiStar, FiShield, FiCheck } from 'react-icons/fi'
import { registerClub } from '../../../store/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { fetchCommonData } from '../../../store/slices/commonSlice'
import SimpleImageUpload from '../../../components/common/SimpleImageUpload'
import { ClubRegisterRequest } from '../../../types'
import {
  ClubRegisterHeader,
  AccountInfoSection,
  ClubInfoSection,
  ClubTypeSection,
  PrivacyPolicySection,
  ClubRegisterActions
} from '../../../components/common/register/ClubRegister'

const ClubRegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading } = useSelector((state: RootState) => state.loading)
  const { data: commonData } = useSelector((state: RootState) => state.common)

  const [formData, setFormData] = useState<ClubRegisterRequest>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    clubName: '',
    managerName: '',
    state: '',
    clubType: 'recreational',
    rfc: '',
    logoUrl: '',
    privacyPolicyAccepted: false
  })

  useEffect(() => {
    if (!commonData) {
      dispatch(fetchCommonData())
    }
  }, [dispatch, commonData])

  const states = commonData?.states || []

  const clubTypes = [
    { value: 'recreational', label: 'Recreational Club', description: 'Focused on casual play and community building' },
    { value: 'competitive', label: 'Competitive Club', description: 'Emphasis on tournaments and competitive play' },
    { value: 'training', label: 'Training Club', description: 'Specialized in player development and coaching' },
    { value: 'social', label: 'Social Club', description: 'Community-oriented with social events and activities' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Immediate upload handler for Redux state updates
  const handleLogoUpload = (url: string) => {
    // Update form data for registration
    setFormData(prev => ({ ...prev, logoUrl: url }))
  }


  const isFormValid = () => {
    return !!(
      formData.username.trim() &&
      formData.email.trim() &&
      formData.password.trim() &&
      formData.password === formData.confirmPassword &&
      formData.clubName.trim() &&
      formData.managerName.trim() &&
      formData.state &&
      formData.privacyPolicyAccepted
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) {
      alert('Please fill in all required fields correctly')
      return
    }

    try {
      console.log('Starting club registration with data:', formData)
      const result = await dispatch(registerClub(formData))
      console.log('Registration result:', result)

      // Since registerClub is a thunk that returns response.data directly
      if (result && (result as any).user) {
        console.log('Registration successful, navigating to dashboard')
        navigate('/club/dashboard')
      } else {
        console.error('Registration failed: No user data returned')
        alert('Registration failed. Please try again.')
      }
    } catch (error: any) {
      console.error('Registration failed:', error)
      alert(`Registration failed: ${error?.response?.data?.message || error?.message || 'Please try again.'}`)
    }
  }

  const handleBackToSelect = () => {
    navigate('/register')
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-300 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/4 right-20 w-48 h-48 bg-pink-300 rounded-full blur-2xl animate-bounce opacity-20" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-400 rounded-full blur-xl animate-ping opacity-25" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-pink-400 rounded-full blur-lg animate-pulse opacity-30" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl animate-spin opacity-10" style={{ animationDuration: '20s' }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ClubRegisterHeader />

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-purple-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <FiHome className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-purple-700">Club Registration</span>
            </div>
            <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <FiCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-purple-700">Account Setup</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-purple-200">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                  <FiHome className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Complete Your Club Profile</h2>
                  <p className="text-purple-100 text-lg">Unite players and organize club activities</p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FiUsers className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Member Management</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FiStar className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Tournament Organization</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FiShield className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Verified Club Status</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            <AccountInfoSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <ClubInfoSection
              formData={formData}
              onInputChange={handleInputChange}
              states={states}
            />

            <ClubTypeSection
              formData={formData}
              onInputChange={handleInputChange}
              clubTypes={clubTypes}
            />

            {/* Enhanced Club Logo Upload */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <SimpleImageUpload
                fieldName="logo_url"
                fileType="image"
                value={formData.logoUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
                required={false}
                title="Club Logo"
                enableCropping={true}
                aspectRatio={1}
              />
            </div>

            <PrivacyPolicySection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <ClubRegisterActions
              isFormValid={isFormValid}
              isLoading={isLoading}
              onBackToSelect={handleBackToSelect}
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ClubRegisterPage