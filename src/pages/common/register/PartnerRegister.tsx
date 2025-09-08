import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch as useReduxDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'
import { registerPartner } from '../../../store/slices/authSlice'
import { PartnerRegisterRequest } from '../../../types'
import {
  PartnerRegisterHeader,
  AccountInfoSection,
  BusinessInfoSection,
  PartnerTypeSection,
  LogoUploadSection,
  PartnerBenefitsSection,
  PrivacyPolicySection,
  PartnerRegisterActions
} from '../../../components/common/register/PartnerRegister'

const PartnerRegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useReduxDispatch<AppDispatch>()
  const { isLoading } = useSelector((state: RootState) => state.loading)

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

  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const mexicanStates = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua',
    'Coahuila', 'Colima', 'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'México',
    'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro',
    'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
    'Veracruz', 'Yucatán', 'Zacatecas', 'Ciudad de México'
  ]

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const uploadData = new FormData()
    uploadData.append('file', file)
    uploadData.append('upload_preset', 'your_upload_preset')

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
        method: 'POST',
        body: uploadData
      })
      
      const data = await response.json()
      
      setFormData(prev => ({ ...prev, businessLogoUrl: data.secure_url }))
      setLogoPreview(data.secure_url)
    } catch (error) {
      console.error('Upload failed:', error)
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

  const handleLogoRemove = () => {
    setLogoPreview(null)
    setFormData(prev => ({ ...prev, businessLogoUrl: '' }))
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
                mexicanStates={mexicanStates}
              />

              <PartnerTypeSection 
                formData={formData}
                onInputChange={handleInputChange}
                partnerTypes={partnerTypes}
              />

              <LogoUploadSection 
                logoPreview={logoPreview}
                onLogoUpload={handleLogoUpload}
                onLogoRemove={handleLogoRemove}
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