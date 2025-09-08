import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginSuccess } from '../../../store/slices/authSlice'
import { useDispatch as useReduxDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import axios from 'axios'

const BASE_URL = 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
import { ClubRegisterRequest } from '../../../types'
import {
  ClubRegisterHeader,
  AccountInfoSection,
  ClubInfoSection,
  ClubTypeSection,
  LogoUploadSection,
  PrivacyPolicySection,
  ClubRegisterActions
} from '../../../components/common/register/ClubRegister'

const ClubRegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useReduxDispatch<AppDispatch>()

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

  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const mexicanStates = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua',
    'Coahuila', 'Colima', 'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'México',
    'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro',
    'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
    'Veracruz', 'Yucatán', 'Zacatecas', 'Ciudad de México'
  ]

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
      
      setFormData(prev => ({ ...prev, logoUrl: data.secure_url }))
      setLogoPreview(data.secure_url)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const registerData = {
        userData: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'club' as const,
          phone: formData.phoneNumber
        },
        profileData: {
          name: formData.clubName,
          manager_name: formData.managerName,
          manager_title: 'Manager',
          state_id: mexicanStates.indexOf(formData.state) + 1,
          club_type: formData.clubType,
          rfc: formData.rfc,
          logo_url: formData.logoUrl,
          has_courts: false
        }
      }

      const response = await apiClient.post('/api/auth/register', registerData)
      dispatch(loginSuccess(response.data))
      navigate('/club/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  const handleBackToSelect = () => {
    navigate('/register')
  }

  const handleLogoRemove = () => {
    setLogoPreview(null)
    setFormData(prev => ({ ...prev, logoUrl: '' }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClubRegisterHeader />

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-purple-600 text-white p-6">
            <h2 className="text-xl font-semibold mb-2">Complete Your Club Profile</h2>
            <p className="text-purple-100">Unite players and organize club activities</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <AccountInfoSection 
              formData={formData}
              onInputChange={handleInputChange}
            />

            <ClubInfoSection 
              formData={formData}
              onInputChange={handleInputChange}
              mexicanStates={mexicanStates}
            />

            <ClubTypeSection 
              formData={formData}
              onInputChange={handleInputChange}
              clubTypes={clubTypes}
            />

            <LogoUploadSection 
              logoPreview={logoPreview}
              onLogoUpload={handleLogoUpload}
              onLogoRemove={handleLogoRemove}
            />

            <PrivacyPolicySection 
              formData={formData}
              onInputChange={handleInputChange}
            />

            <ClubRegisterActions 
              isLoading={false}
              onBackToSelect={handleBackToSelect}
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ClubRegisterPage