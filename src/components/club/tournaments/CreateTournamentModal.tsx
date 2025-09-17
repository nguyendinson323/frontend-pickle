import React, { useState } from 'react'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import {
  FiX,
  FiImage,
  FiType,
  FiFileText,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiSliders,
  FiAward,
  FiPlus,
  FiTrash2,
  FiSave
} from 'react-icons/fi'

interface TournamentCategory {
  name: string
  min_age?: number
  max_age?: number
  gender: 'Male' | 'Female' | 'Mixed'
  min_skill_level?: number
  max_skill_level?: number
  format: string
  max_participants?: number
}

interface CreateTournamentModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (tournamentData: {
    name: string
    description?: string
    tournament_type?: string
    venue_name?: string
    venue_address?: string
    start_date: string
    end_date: string
    registration_start: string
    registration_end: string
    entry_fee?: number
    max_participants?: number
    is_ranking?: boolean
    ranking_multiplier?: number
    banner_url?: string
    categories: TournamentCategory[]
  }) => Promise<void>
  loading: boolean
}

const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  loading
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tournament_type: 'Local',
    venue_name: '',
    venue_address: '',
    start_date: '',
    end_date: '',
    registration_start: '',
    registration_end: '',
    entry_fee: '',
    max_participants: '',
    is_ranking: true,
    ranking_multiplier: '1.0',
    banner_url: ''
  })

  const [categories, setCategories] = useState<TournamentCategory[]>([
    {
      name: "Men's Singles",
      gender: 'Male',
      format: 'Round Robin'
    }
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await onCreate({
        name: formData.name,
        description: formData.description || undefined,
        tournament_type: formData.tournament_type || undefined,
        venue_name: formData.venue_name || undefined,
        venue_address: formData.venue_address || undefined,
        start_date: formData.start_date,
        end_date: formData.end_date,
        registration_start: formData.registration_start,
        registration_end: formData.registration_end,
        entry_fee: formData.entry_fee ? parseFloat(formData.entry_fee) : undefined,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : undefined,
        is_ranking: formData.is_ranking,
        ranking_multiplier: parseFloat(formData.ranking_multiplier),
        banner_url: formData.banner_url || undefined,
        categories
      })
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        tournament_type: 'Local',
        venue_name: '',
        venue_address: '',
        start_date: '',
        end_date: '',
        registration_start: '',
        registration_end: '',
        entry_fee: '',
        max_participants: '',
        is_ranking: true,
        ranking_multiplier: '1.0',
        banner_url: ''
      })
      setCategories([{
        name: "Men's Singles",
        gender: 'Male',
        format: 'Round Robin'
      }])
      onClose()
    } catch (error) {
      console.error('Error creating tournament:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        name: '',
        gender: 'Mixed',
        format: 'Round Robin'
      }
    ])
  }

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
  }

  const updateCategory = (index: number, field: keyof TournamentCategory, value: any) => {
    const updatedCategories = [...categories]
    updatedCategories[index] = {
      ...updatedCategories[index],
      [field]: value
    }
    setCategories(updatedCategories)
  }

  const handleBannerChange = (url: string) => {
    setFormData({
      ...formData,
      banner_url: url
    })
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-start justify-center p-4">
      <div className="relative w-full max-w-5xl bg-gradient-to-br from-white to-purple-50 border border-purple-200 rounded-3xl shadow-2xl my-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-8 py-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold flex items-center">
                <FiAward className="h-7 w-7 mr-3" />
                Create New Tournament
              </h3>
              <p className="text-purple-100 font-medium mt-1">Set up your tournament details and categories</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-white hover:text-gray-200 rounded-2xl hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-gradient-to-br from-gray-50 to-white rounded-b-3xl">
            {/* Banner Upload */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
              <label className="block text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiImage className="h-5 w-5 mr-2 text-indigo-600" />
                Tournament Banner
              </label>
              <SimpleImageUpload
                fieldName="banner_url"
                fileType="image"
                value={formData.banner_url}
                onChange={handleBannerChange}
                title="Upload Tournament Banner"
              />
            </div>

            {/* Basic Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <FiType className="h-5 w-5 mr-2 text-blue-600" />
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-3">
                    Tournament Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter tournament name"
                  />
                </div>

                <div>
                  <label htmlFor="tournament_type" className="block text-sm font-bold text-gray-700 mb-3">
                    Tournament Type
                  </label>
                  <select
                    id="tournament_type"
                    name="tournament_type"
                    value={formData.tournament_type}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                  >
                    <option value="Local">Local</option>
                    <option value="Regional">Regional</option>
                    <option value="State">State</option>
                    <option value="National">National</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
              <label htmlFor="description" className="block text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiFileText className="h-5 w-5 mr-2 text-green-600" />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400 resize-none"
                placeholder="Describe your tournament..."
              />
            </div>

            {/* Venue Information */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <FiMapPin className="h-5 w-5 mr-2 text-orange-600" />
                Venue Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="venue_name" className="block text-sm font-bold text-gray-700 mb-3">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    id="venue_name"
                    name="venue_name"
                    value={formData.venue_name}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter venue name"
                  />
                </div>

                <div>
                  <label htmlFor="venue_address" className="block text-sm font-bold text-gray-700 mb-3">
                    Venue Address
                  </label>
                  <input
                    type="text"
                    id="venue_address"
                    name="venue_address"
                    value={formData.venue_address}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter venue address"
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <FiCalendar className="h-5 w-5 mr-2 text-purple-600" />
                Tournament Dates
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-bold text-gray-700 mb-3">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    min={getMinDate()}
                    required
                    className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="end_date" className="block text-sm font-bold text-gray-700 mb-3">
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    min={formData.start_date || getMinDate()}
                    required
                    className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="registration_start" className="block text-sm font-bold text-gray-700 mb-3">
                    Registration Start *
                  </label>
                  <input
                    type="date"
                    id="registration_start"
                    name="registration_start"
                    value={formData.registration_start}
                    onChange={handleInputChange}
                    min={getMinDate()}
                    required
                    className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="registration_end" className="block text-sm font-bold text-gray-700 mb-3">
                    Registration End *
                  </label>
                  <input
                    type="date"
                    id="registration_end"
                    name="registration_end"
                    value={formData.registration_end}
                    onChange={handleInputChange}
                    min={formData.registration_start || getMinDate()}
                    max={formData.start_date || undefined}
                    required
                    className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Tournament Settings */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <FiSliders className="h-5 w-5 mr-2 text-yellow-600" />
                Tournament Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label htmlFor="entry_fee" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <FiDollarSign className="h-4 w-4 mr-2 text-green-500" />
                    Entry Fee ($)
                  </label>
                  <input
                    type="number"
                    id="entry_fee"
                    name="entry_fee"
                    value={formData.entry_fee}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="max_participants" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <FiUsers className="h-4 w-4 mr-2 text-blue-500" />
                    Max Participants
                  </label>
                  <input
                    type="number"
                    id="max_participants"
                    name="max_participants"
                    value={formData.max_participants}
                    onChange={handleInputChange}
                    min="1"
                    className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter max participants"
                  />
                </div>

                <div>
                  <label htmlFor="ranking_multiplier" className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <FiSliders className="h-4 w-4 mr-2 text-purple-500" />
                    Ranking Multiplier
                  </label>
                  <input
                    type="number"
                    id="ranking_multiplier"
                    name="ranking_multiplier"
                    value={formData.ranking_multiplier}
                    onChange={handleInputChange}
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="1.0"
                  />
                </div>
              </div>

              <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-4">
                <input
                  id="is_ranking"
                  name="is_ranking"
                  type="checkbox"
                  checked={formData.is_ranking}
                  onChange={handleInputChange}
                  className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded-lg"
                />
                <label htmlFor="is_ranking" className="text-gray-900 font-bold flex items-center">
                  <FiAward className="h-5 w-5 mr-2 text-yellow-600" />
                  This is a ranking tournament
                </label>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-bold text-gray-900 flex items-center">
                  <FiAward className="h-5 w-5 mr-2 text-teal-600" />
                  Tournament Categories
                </h4>
                <button
                  type="button"
                  onClick={addCategory}
                  className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white px-4 py-2 rounded-2xl text-sm font-bold flex items-center shadow-md hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105"
                >
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add Category
                </button>
              </div>

              <div className="space-y-6">
                {categories.map((category, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h5 className="font-bold text-gray-900 text-lg">Category {index + 1}</h5>
                      {categories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCategory(index)}
                          className="bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white p-2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Name *</label>
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => updateCategory(index, 'name', e.target.value)}
                          required
                          className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 hover:border-gray-400"
                          placeholder="e.g., Men's Singles"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Gender</label>
                        <select
                          value={category.gender}
                          onChange={(e) => updateCategory(index, 'gender', e.target.value)}
                          className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 hover:border-gray-400"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Mixed">Mixed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Format</label>
                        <select
                          value={category.format}
                          onChange={(e) => updateCategory(index, 'format', e.target.value)}
                          className="block w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 hover:border-gray-400"
                        >
                          <option value="Round Robin">Round Robin</option>
                          <option value="Single Elimination">Single Elimination</option>
                          <option value="Double Elimination">Double Elimination</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-6 pt-8 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 border-2 border-gray-300 rounded-2xl text-gray-700 font-bold bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                disabled={loading}
              >
                <FiX className="w-5 h-5 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name || !formData.start_date || !formData.end_date || !formData.registration_start || !formData.registration_end}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 border border-transparent rounded-2xl text-white font-bold hover:from-purple-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5 mr-2" />
                    Create Tournament
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTournamentModal