import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Layout } from '../../components/layout'
import { login } from '../../store/slices/authSlice'
import { LoginRequest } from '../../types'
import { AppDispatch } from '../../store'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.username.trim() || !formData.password.trim()) {
      return
    }

    try {
      const response = await dispatch(login(formData))
      
      // Redirect based on user role
      switch (response.user.role) {
        case 'admin':
          navigate('/admin/dashboard')
          break
        case 'player':
          navigate('/player/dashboard')
          break
        case 'coach':
          navigate('/coach/dashboard')
          break
        case 'club':
          navigate('/club/dashboard')
          break
        case 'partner':
          navigate('/partner/dashboard')
          break
        case 'state':
          navigate('/state/dashboard')
          break
        default:
          navigate('/dashboard')
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
    
  }

  const handleForgotPassword = () => {
    navigate('/forgot-password')
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">PF</span>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Sign in to your account
            </h2>
            <p className="text-gray-300">
              Access your federation dashboard and manage your profile
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username/Email Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username or Email
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 transition-all duration-200"
                    placeholder="Enter your username or email"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-indigo-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={false || !formData.username.trim() || !formData.password.trim()}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {false ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In
                    </>
                  )}
                </button>
              </div>

              {/* Registration Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* User Type Information */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Federation Accounts</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { type: 'Player', desc: 'Individual athletes' },
                { type: 'Coach', desc: 'Certified trainers' },
                { type: 'Club', desc: 'Team organizations' },
                { type: 'Partner', desc: 'Business entities' },
                { type: 'State', desc: 'Regional committees' },
                { type: 'Admin', desc: 'System administrators' }
              ].map((account) => (
                <div key={account.type} className="text-gray-300">
                  <span className="font-medium text-white">{account.type}:</span> {account.desc}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default LoginPage