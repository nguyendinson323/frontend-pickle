import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
              states={states}
            />

            <ClubTypeSection 
              formData={formData}
              onInputChange={handleInputChange}
              clubTypes={clubTypes}
            />

            {/* Club Logo Upload */}
            <CentralizedImageUpload
              uploadType="club-logo"
              value={formData.logoUrl}
              onChange={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
              required={false}
              title="Club Logo"
              color="purple"
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