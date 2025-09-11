import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch as useReduxDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'
import { registerPartner } from '../../../store/slices/authSlice'
import { fetchCommonData } from '../../../store/slices/commonSlice'
import { PartnerRegisterRequest } from '../../../types'
import CentralizedImageUpload from '../../../components/common/CentralizedImageUpload'
import {
  PartnerRegisterHeader,
  AccountInfoSection,
  BusinessInfoSection,
  PartnerTypeSection,
  PartnerBenefitsSection,
  PrivacyPolicySection,
  PartnerRegisterActions
} from '../../../components/common/register/PartnerRegister'

const PartnerRegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useReduxDispatch<AppDispatch>()
  const { isLoading } = useSelector((state: RootState) => state.loading)
  const { data: commonData } = useSelector((state: RootState) => state.common)

  const [formData, setFormData] = useState<PartnerRegisterRequest>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    businessName: '',
    contactPersonName: '',
    partnerType: 'hotel',
    state: '',
    rfc: '',
    businessLogoUrl: '',
    privacyPolicyAccepted: false
  })


  useEffect(() => {
    if (!commonData) {
      dispatch(fetchCommonData())
    }
  }, [dispatch, commonData])

  const states = commonData?.states || []

  const partnerTypes = [
    { value: 'hotel', label: 'Hotel/Resort', description: 'Hotels and resorts with pickleball facilities', icon: '🏨' },
    { value: 'sports_center', label: 'Sports Center', description: 'Dedicated sports facilities with courts', icon: '🏟️' },
    { value: 'country_club', label: 'Country Club', description: 'Private clubs with recreational facilities', icon: '⛳' },
    { value: 'business', label: 'Business', description: 'Other businesses offering pickleball services', icon: '🏢' }
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await dispatch(registerPartner(formData))
      navigate('/partner/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  const handleBackToSelect = () => {
    navigate('/register')
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PartnerRegisterHeader />

          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-orange-600 text-white p-6">
              <h2 className="text-xl font-semibold mb-2">Complete Your Partner Profile</h2>
              <p className="text-orange-100">Join as a business partner and offer pickleball services</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              <AccountInfoSection 
                formData={formData}
                onInputChange={handleInputChange}
              />

              <BusinessInfoSection 
                formData={formData}
                onInputChange={handleInputChange}
                states={states}
              />

              <PartnerTypeSection 
                formData={formData}
                onInputChange={handleInputChange}
                partnerTypes={partnerTypes}
              />

              {/* Partner Logo Upload */}
              <CentralizedImageUpload
                uploadType="partner-logo"
                value={formData.businessLogoUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, businessLogoUrl: url }))}
                required={false}
                title="Business Logo"
                color="orange"
              />

              <PartnerBenefitsSection />

              <PrivacyPolicySection 
                formData={formData}
                onInputChange={handleInputChange}
              />

              <PartnerRegisterActions 
                isLoading={isLoading}
                onBackToSelect={handleBackToSelect}
              />
            </form>
          </div>
        </div>
        
    </div>
  )
}

export default PartnerRegisterPage