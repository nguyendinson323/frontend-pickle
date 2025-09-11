import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerState } from '../../../store/slices/authSlice'
import { fetchCommonData } from '../../../store/slices/commonSlice'
import { StateRegisterRequest } from '../../../types'
import { RootState, AppDispatch } from '../../../store'
import CentralizedImageUpload from '../../../components/common/CentralizedImageUpload'
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <StateRegisterHeader />

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-red-600 text-white p-6">
            <h2 className="text-xl font-semibold mb-2">Complete Your State Committee Profile</h2>
            <p className="text-red-100">Manage and promote pickleball across your entire state</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">

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

            {/* State Logo Upload */}
            <CentralizedImageUpload
              uploadType="state-logo"
              value={formData.committeeLogoUrl}
              onChange={(url) => setFormData(prev => ({ ...prev, committeeLogoUrl: url }))}
              required={false}
              title="State Committee Logo"
              color="green"
            />

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