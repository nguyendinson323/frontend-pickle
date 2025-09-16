import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBriefcase, FiDollarSign, FiStar, FiShield, FiCheck } from 'react-icons/fi'
import { useDispatch as useReduxDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'
import { registerPartner } from '../../../store/slices/authSlice'
import { fetchCommonData } from '../../../store/slices/commonSlice'
import { PartnerRegisterRequest } from '../../../types'
import SimpleImageUpload from '../../../components/common/SimpleImageUpload'
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

  // Immediate upload handler for Redux state updates
  const handleBusinessLogoUpload = (url: string) => {
    // Update form data for registration
    setFormData(prev => ({ ...prev, businessLogoUrl: url }))
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-300 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/4 right-20 w-48 h-48 bg-red-300 rounded-full blur-2xl animate-bounce opacity-20" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-orange-400 rounded-full blur-xl animate-ping opacity-25" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-red-400 rounded-full blur-lg animate-pulse opacity-30" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-orange-200 to-red-200 rounded-full blur-3xl animate-spin opacity-10" style={{ animationDuration: '20s' }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <PartnerRegisterHeader />

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-orange-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <FiBriefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-orange-700">Partner Registration</span>
            </div>
            <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <FiCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-orange-700">Business Setup</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-orange-200">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-red-600 text-white p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                  <FiBriefcase className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Complete Your Partner Profile</h2>
                  <p className="text-orange-100 text-lg">Join as a business partner and offer pickleball services</p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FiDollarSign className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Revenue Generation</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FiStar className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Event Hosting</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FiShield className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Premium Features</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
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

            {/* Enhanced Logo Upload */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
              <SimpleImageUpload
                fieldName="business_logo_url"
                fileType="image"
                value={formData.businessLogoUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, businessLogoUrl: url }))}
                required={false}
                title="Business Logo"
                enableCropping={true}
                aspectRatio={1}
              />
            </div>

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