import React, { useState, useEffect } from 'react'
import { ClubTournament } from '../../../store/slices/clubTournamentsSlice'
import CentralizedImageUpload from '../../common/CentralizedImageUpload'

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

interface EditTournamentModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (tournamentId: number, tournamentData: {
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
  }) => Promise<void>
  tournament: ClubTournament
  loading: boolean
}

const EditTournamentModal: React.FC<EditTournamentModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  tournament,
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

  useEffect(() => {
    if (tournament) {
      setFormData({
        name: tournament.name || '',
        description: tournament.description || '',
        tournament_type: tournament.tournament_type || 'Local',
        venue_name: tournament.venue_name || '',
        venue_address: tournament.venue_address || '',
        start_date: tournament.start_date ? tournament.start_date.split('T')[0] : '',
        end_date: tournament.end_date ? tournament.end_date.split('T')[0] : '',
        registration_start: tournament.registration_start ? tournament.registration_start.split('T')[0] : '',
        registration_end: tournament.registration_end ? tournament.registration_end.split('T')[0] : '',
        entry_fee: tournament.entry_fee ? tournament.entry_fee.toString() : '',
        max_participants: tournament.max_participants ? tournament.max_participants.toString() : '',
        is_ranking: tournament.is_ranking || false,
        ranking_multiplier: tournament.ranking_multiplier ? tournament.ranking_multiplier.toString() : '1.0',
        banner_url: tournament.banner_url || ''
      })
    }
  }, [tournament])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await onUpdate(tournament.id, {
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
        banner_url: formData.banner_url || undefined
      })

      onClose()
    } catch (error) {
      console.error('Error updating tournament:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Edit Tournament</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tournament Banner
              </label>
              <CentralizedImageUpload
                uploadType="tournament-banner"
                value={formData.banner_url}
                onChange={handleBannerChange}
                color="indigo"
                title="Upload Tournament Banner"
              />
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Local">Local</option>
                  <option value="Regional">Regional</option>
                  <option value="State">State</option>
                  <option value="National">National</option>
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
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Venue Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Dates */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

            {/* Tournament Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="flex items-center">
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
                {loading ? 'Updating...' : 'Update Tournament'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditTournamentModal