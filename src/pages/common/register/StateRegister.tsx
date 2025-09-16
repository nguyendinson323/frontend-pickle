import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiShield, FiImage, FiFileText, FiCheck } from 'react-icons/fi'
import { registerState } from '../../../store/slices/authSlice'
import { fetchCommonData } from '../../../store/slices/commonSlice'
import { StateRegisterRequest } from '../../../types'
import { RootState, AppDispatch } from '../../../store'
import SimpleImageUpload from '../../../components/common/SimpleImageUpload'
import {
  StateRegisterHeader,
  StateAccountInfoSection,
  StateCommitteeInfoSection,
  StateInstitutionalDetailsSection,
  StateResponsibilitiesSection,
  StatePrivacyPolicySection,
  StateRegisterActions
} from '../../../components/common/register/StateRegister'

const StateRegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading } = useSelector((state: RootState) => state.loading)
  const { data: commonData } = useSelector((state: RootState) => state.common)

  const [formData, setFormData] = useState<StateRegisterRequest>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    committeeName: '',
    presidentName: '',
    stateCoverage: '',
    rfc: '',
    institutionalDetails: '',
    committeeLogoUrl: '',
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

  // Immediate upload handler for Redux state updates
  const handleCommitteeLogoUpload = (url: string) => {
    // Update form data for registration
    setFormData(prev => ({ ...prev, committeeLogoUrl: url }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      console.log('Starting state registration with data:', formData)
      const result = await dispatch(registerState(formData))
      console.log('Registration result:', result)
      
      // Since registerState is a thunk that returns response.data directly
      if (result && (result as any).user) {
        console.log('Registration successful, navigating to dashboard')
        navigate('/state/dashboard')
      } else {
        console.error('Registration failed: No user data returned')
        alert('Registration failed. Please try again.')
      }
    } catch (error: any) {
      console.error('Registration failed:', error)
      alert(`Registration failed: ${error?.response?.data?.message || error?.message || 'Please try again.'}`)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-300 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/4 right-20 w-48 h-48 bg-emerald-300 rounded-full blur-2xl animate-bounce opacity-20" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-green-400 rounded-full blur-xl animate-ping opacity-25" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-emerald-400 rounded-full blur-lg animate-pulse opacity-30" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-3xl animate-spin opacity-10" style={{ animationDuration: '20s' }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <StateRegisterHeader />

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <FiShield className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-green-700">State Registration</span>
            </div>
            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <FiCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-green-700">Committee Setup</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-green-200">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 text-white p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                  <FiShield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Complete Your State Committee Profile</h2>
                  <p className="text-green-100 text-lg">Manage and promote pickleball across your entire state</p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FiShield className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">State Management</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FiImage className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Tournament Organization</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FiFileText className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Official Authority</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            <StateAccountInfoSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <StateCommitteeInfoSection
              formData={formData}
              onInputChange={handleInputChange}
              states={states}
            />

            <StateInstitutionalDetailsSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            {/* Enhanced Logo Upload */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <SimpleImageUpload
                fieldName="committee_logo_url"
                fileType="image"
                value={formData.committeeLogoUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, committeeLogoUrl: url }))}
                required={false}
                title="State Committee Logo"
                enableCropping={true}
                aspectRatio={1}
              />
            </div>

            <StateResponsibilitiesSection />

            <StatePrivacyPolicySection
              privacyAccepted={formData.privacyPolicyAccepted}
              onPrivacyAcceptedChange={(accepted) =>
                setFormData(prev => ({ ...prev, privacyPolicyAccepted: accepted }))
              }
            />

            <StateRegisterActions isLoading={isLoading} />
          </form>
        </div>
      </div>
    </div>
  )
}

export default StateRegisterPage