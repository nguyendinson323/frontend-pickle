import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Layout } from '../../../components/layout'
import { registerState } from '../../../store/slices/authSlice'
import { StateRegisterRequest } from '../../../types'
import { AppDispatch } from '../../../store'
import {
  StateRegisterHeader,
  StateAccountInfoSection,
  StateCommitteeInfoSection,
  StateInstitutionalDetailsSection,
  StateLogoUploadSection,
  StateResponsibilitiesSection,
  StatePrivacyPolicySection,
  StateRegisterActions
} from '../../../components/common/register/StateRegister'

const StateRegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

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

  const [logoPreview, setLogoPreview] = useState<string | null>(null)

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
      
      setFormData(prev => ({ ...prev, committeeLogoUrl: data.secure_url }))
      setLogoPreview(data.secure_url)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await dispatch(registerState(formData))
    navigate('/state/dashboard')
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    setFormData(prev => ({ ...prev, committeeLogoUrl: '' }))
  }

  return (
    <Layout>
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
              />

              <StateInstitutionalDetailsSection
                formData={formData}
                onInputChange={handleInputChange}
              />

              <StateLogoUploadSection
                formData={formData}
                logoPreview={logoPreview}
                onLogoUpload={handleLogoUpload}
                onRemoveLogo={handleRemoveLogo}
              />

              <StateResponsibilitiesSection />

              <StatePrivacyPolicySection
                privacyAccepted={formData.privacyPolicyAccepted}
                onPrivacyAcceptedChange={(accepted) => 
                  setFormData(prev => ({ ...prev, privacyPolicyAccepted: accepted }))
                }
              />

              <StateRegisterActions isLoading={false} />
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default StateRegisterPage