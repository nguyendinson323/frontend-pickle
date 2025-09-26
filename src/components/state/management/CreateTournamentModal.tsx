import React, { useState } from 'react'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import { FiX, FiPlus, FiTrash2, FiAward, FiCalendar, FiMapPin, FiDollarSign } from 'react-icons/fi'

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
    tournament_type: 'State',
    venue_name: '',
    venue_address: '',
    start_date: '',
    end_date: '',
    registration_start: '',
    registration_end: '',
    entry_fee: '',
    max_participants: '',
    is_ranking: true,
    ranking_multiplier: '1.5',
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
        tournament_type: 'State',
        venue_name: '',
        venue_address: '',
        start_date: '',
        end_date: '',
        registration_start: '',
        registration_end: '',
        entry_fee: '',
        max_participants: '',
        is_ranking: true,
        ranking_multiplier: '1.5',
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
        name: `Category ${categories.length + 1}`, // Provide default name
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

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-start justify-center py-8">
      <div className="relative mx-auto p-8 border border-gray-200/50 w-full max-w-5xl shadow-2xl rounded-3xl bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 backdrop-blur-lg">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
                <FiAward className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">Create State Tournament</h3>
                <p className="text-gray-600 mt-1">Set up a new tournament for your state</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-xl transition-colors duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiAward className="w-5 h-5 mr-2 text-blue-600" />
                Basic Information
              </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Tournament Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="tournament_type" className="block text-sm font-medium text-gray-700">
                  Tournament Type
                </label>
                <select
                  id="tournament_type"
                  name="tournament_type"
                  value={formData.tournament_type}
                  onChange={handleInputChange}
                  className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="State">State Championship</option>
                  <option value="Regional">Regional Tournament</option>
                  <option value="Municipal">Municipal Championship</option>
                  <option value="State League">State League</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              />
            </div>
            </div>

            {/* Tournament Banner */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Tournament Banner (Optional)
              </label>
              <SimpleImageUpload
                fieldName="banner"
                fileType="tournament-banner"
                value={formData.banner_url}
                onChange={(url) => setFormData({ ...formData, banner_url: url })}
                title="Upload Tournament Banner"
                className="w-full"
              />
            </div>

            {/* Venue Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiMapPin className="w-5 h-5 mr-2 text-green-600" />
                Venue Information
              </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="venue_name" className="block text-sm font-medium text-gray-700">
                  Venue Name
                </label>
                <input
                  type="text"
                  id="venue_name"
                  name="venue_name"
                  value={formData.venue_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="venue_address" className="block text-sm font-medium text-gray-700">
                  Venue Address
                </label>
                <input
                  type="text"
                  id="venue_address"
                  name="venue_address"
                  value={formData.venue_address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            </div>

            {/* Dates */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiCalendar className="w-5 h-5 mr-2 text-purple-600" />
                Important Dates
              </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="registration_start" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="registration_end" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            </div>

            {/* Tournament Settings */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiDollarSign className="w-5 h-5 mr-2 text-orange-600" />
                Tournament Settings
              </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="entry_fee" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700">
                  Max Participants
                </label>
                <input
                  type="number"
                  id="max_participants"
                  name="max_participants"
                  value={formData.max_participants}
                  onChange={handleInputChange}
                  min="1"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="ranking_multiplier" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center mt-6">
              <input
                id="is_ranking"
                name="is_ranking"
                type="checkbox"
                checked={formData.is_ranking}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_ranking" className="text-sm text-gray-700">
                This is a ranking tournament
              </label>
            </div>
            </div>

            {/* Categories */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">Tournament Categories</h4>
                <button
                  type="button"
                  onClick={addCategory}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Category
                </button>
              </div>

              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-medium text-gray-900">Category {index + 1}</h5>
                      {categories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCategory(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name *</label>
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => updateCategory(index, 'name', e.target.value)}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Men's Singles"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                          value={category.gender}
                          onChange={(e) => updateCategory(index, 'gender', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Mixed">Mixed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Format</label>
                        <select
                          value={category.format}
                          onChange={(e) => updateCategory(index, 'format', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name || !formData.start_date || !formData.end_date || !formData.registration_start || !formData.registration_end}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Tournament'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTournamentModal