import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiHome, FiUsers, FiStar, FiShield, FiCheck } from 'react-icons/fi'
import { loginSuccess } from '../../../store/slices/authSlice'
import { useDispatch as useReduxDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import api from '../../../services/api'
import CentralizedImageUpload from '../../../components/common/CentralizedImageUpload'
import { ClubRegisterRequest, LoginResponse } from '../../../types'
import {
  ClubRegisterHeader,
  AccountInfoSection,
  ClubInfoSection,
  ClubTypeSection,
  PrivacyPolicySection,
  ClubRegisterActions
} from '../../../components/common/register/ClubRegister'

interface State {
  id: number
  name: string
  short_code: string
}

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

  const [states, setStates] = useState<State[]>([])

  // Fetch states from backend
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get<State[]>('/api/common/states')
        setStates(response.data)
      } catch (error) {
        console.error('Failed to fetch states:', error)
        // Fallback to hardcoded states if API fails
        const fallbackStates = [
          { id: 1, name: 'Aguascalientes', short_code: 'AGS' },
          { id: 2, name: 'Baja California', short_code: 'BC' },
          { id: 3, name: 'Baja California Sur', short_code: 'BCS' },
          { id: 4, name: 'Campeche', short_code: 'CAM' },
          { id: 5, name: 'Chiapas', short_code: 'CHIS' },
          { id: 6, name: 'Chihuahua', short_code: 'CHIH' },
          { id: 7, name: 'Coahuila', short_code: 'COAH' },
          { id: 8, name: 'Colima', short_code: 'COL' },
          { id: 9, name: 'Durango', short_code: 'DGO' },
          { id: 10, name: 'Guanajuato', short_code: 'GTO' },
          { id: 11, name: 'Guerrero', short_code: 'GRO' },
          { id: 12, name: 'Hidalgo', short_code: 'HGO' },
          { id: 13, name: 'Jalisco', short_code: 'JAL' },
          { id: 14, name: 'México', short_code: 'MEX' },
          { id: 15, name: 'Michoacán', short_code: 'MICH' },
          { id: 16, name: 'Morelos', short_code: 'MOR' },
          { id: 17, name: 'Nayarit', short_code: 'NAY' },
          { id: 18, name: 'Nuevo León', short_code: 'NL' },
          { id: 19, name: 'Oaxaca', short_code: 'OAX' },
          { id: 20, name: 'Puebla', short_code: 'PUE' },
          { id: 21, name: 'Querétaro', short_code: 'QRO' },
          { id: 22, name: 'Quintana Roo', short_code: 'QROO' },
          { id: 23, name: 'San Luis Potosí', short_code: 'SLP' },
          { id: 24, name: 'Sinaloa', short_code: 'SIN' },
          { id: 25, name: 'Sonora', short_code: 'SON' },
          { id: 26, name: 'Tabasco', short_code: 'TAB' },
          { id: 27, name: 'Tamaulipas', short_code: 'TAMPS' },
          { id: 28, name: 'Tlaxcala', short_code: 'TLAX' },
          { id: 29, name: 'Veracruz', short_code: 'VER' },
          { id: 30, name: 'Yucatán', short_code: 'YUC' },
          { id: 31, name: 'Zacatecas', short_code: 'ZAC' },
          { id: 32, name: 'Ciudad de México', short_code: 'CDMX' }
        ]
        setStates(fallbackStates)
      }
    }
    
    fetchStates()
  }, [])

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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.privacyPolicyAccepted) {
      alert('Please accept the privacy policy to continue')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      // Find state ID from the states array
      const selectedState = states.find(state => state.name === formData.state)
      if (!selectedState && formData.state) {
        alert('Please select a valid state')
        return
      }

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
          manager_title: 'Manager', // Default title
          state_id: selectedState?.id || null,
          club_type: formData.clubType,
          rfc: formData.rfc || null,
          logo_url: formData.logoUrl || null,
          website: null, // Optional field
          social_media: null, // Optional field
          has_courts: false // Default to false for new clubs
        }
      }

      const response = await api.post<LoginResponse>('/api/auth/register', registerData)
      dispatch(loginSuccess(response.data))
      navigate('/club/dashboard')
    } catch (error: any) {
      console.error('Registration failed:', error)
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
      alert(errorMessage)
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
              <CentralizedImageUpload
                uploadType="club-logo"
                value={formData.logoUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
                required={false}
                title="Club Logo"
                color="purple"
              />
            </div>

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