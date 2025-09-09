import React, { useState, useEffect } from 'react'
import { Tournament } from '../../../store/slices/partnerManagementSlice'

interface TournamentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (tournamentData: Partial<Tournament>) => Promise<any>
  tournament: Tournament | null
  loading: boolean
}

const TournamentModal: React.FC<TournamentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tournament,
  loading
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tournament_type: 'singles' as 'singles' | 'doubles' | 'mixed' | 'junior' | 'senior',
    skill_level: 'open' as 'beginner' | 'intermediate' | 'advanced' | 'open',
    start_date: '',
    end_date: '',
    registration_start: '',
    registration_end: '',
    max_participants: '',
    entry_fee: '',
    prize_pool: '',
    venue_name: '',
    venue_address: '',
    rules: '',
    contact_info: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (tournament) {
      setFormData({
        name: tournament.name,
        description: tournament.description || '',
        tournament_type: tournament.tournament_type,
        skill_level: tournament.skill_level,
        start_date: tournament.start_date.split('T')[0],
        end_date: tournament.end_date.split('T')[0],
        registration_start: tournament.registration_start.split('T')[0],
        registration_end: tournament.registration_end.split('T')[0],
        max_participants: tournament.max_participants?.toString() || '',
        entry_fee: tournament.entry_fee?.toString() || '',
        prize_pool: tournament.prize_pool?.toString() || '',
        venue_name: tournament.venue_name || '',
        venue_address: tournament.venue_address || '',
        rules: tournament.rules || '',
        contact_info: tournament.contact_info || ''
      })
    } else {
      // Set default dates
      const today = new Date()
      const nextMonth = new Date(today)
      nextMonth.setMonth(today.getMonth() + 1)
      const twoWeeksLater = new Date(today)
      twoWeeksLater.setDate(today.getDate() + 14)

      setFormData({
        name: '',
        description: '',
        tournament_type: 'singles',
        skill_level: 'open',
        start_date: nextMonth.toISOString().split('T')[0],
        end_date: nextMonth.toISOString().split('T')[0],
        registration_start: today.toISOString().split('T')[0],
        registration_end: twoWeeksLater.toISOString().split('T')[0],
        max_participants: '',
        entry_fee: '',
        prize_pool: '',
        venue_name: '',
        venue_address: '',
        rules: '',
        contact_info: ''
      })
    }
    setError('')
  }, [tournament, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Tournament name is required')
      return
    }

    // Date validations
    const startDate = new Date(formData.start_date)
    const endDate = new Date(formData.end_date)
    const regStart = new Date(formData.registration_start)
    const regEnd = new Date(formData.registration_end)

    if (endDate < startDate) {
      setError('End date must be after start date')
      return
    }

    if (regEnd < regStart) {
      setError('Registration end date must be after registration start date')
      return
    }

    if (regEnd >= startDate) {
      setError('Registration must end before tournament starts')
      return
    }

    // Numeric validations
    if (formData.max_participants && parseInt(formData.max_participants) < 1) {
      setError('Maximum participants must be at least 1')
      return
    }

    if (formData.entry_fee && parseFloat(formData.entry_fee) < 0) {
      setError('Entry fee cannot be negative')
      return
    }

    if (formData.prize_pool && parseFloat(formData.prize_pool) < 0) {
      setError('Prize pool cannot be negative')
      return
    }

    try {
      const submitData = {
        ...formData,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        entry_fee: formData.entry_fee ? parseFloat(formData.entry_fee) : null,
        prize_pool: formData.prize_pool ? parseFloat(formData.prize_pool) : null,
        description: formData.description || null,
        venue_name: formData.venue_name || null,
        venue_address: formData.venue_address || null,
        rules: formData.rules || null,
        contact_info: formData.contact_info || null
      }

      await onSave(submitData)
    } catch (error) {
      setError('Failed to save tournament. Please try again.')
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-lg font-bold text-gray-900">
            {tournament ? 'Edit Tournament' : 'Create New Tournament'}
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tournament Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Spring Championship"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tournament Type
                  </label>
                  <select
                    value={formData.tournament_type}
                    onChange={(e) => handleInputChange('tournament_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    disabled={loading}
                  >
                    <option value="singles">Singles</option>
                    <option value="doubles">Doubles</option>
                    <option value="mixed">Mixed Doubles</option>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Level
                  </label>
                  <select
                    value={formData.skill_level}
                    onChange={(e) => handleInputChange('skill_level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    disabled={loading}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="open">Open (All Levels)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Tournament description and details"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Tournament Schedule</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Start <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.registration_start}
                    onChange={(e) => handleInputChange('registration_start', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration End <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.registration_end}
                    onChange={(e) => handleInputChange('registration_end', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tournament Start <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tournament End <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Participation & Fees */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Participation & Fees</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Participants
                  </label>
                  <input
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => handleInputChange('max_participants', e.target.value)}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Leave empty for unlimited"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entry Fee ($)
                  </label>
                  <input
                    type="number"
                    value={formData.entry_fee}
                    onChange={(e) => handleInputChange('entry_fee', e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0.00 for free tournament"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prize Pool ($)
                  </label>
                  <input
                    type="number"
                    value={formData.prize_pool}
                    onChange={(e) => handleInputChange('prize_pool', e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Optional"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Venue Information */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Venue Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={formData.venue_name}
                    onChange={(e) => handleInputChange('venue_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Tournament venue name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Address
                  </label>
                  <input
                    type="text"
                    value={formData.venue_address}
                    onChange={(e) => handleInputChange('venue_address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Full address"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Information
                  </label>
                  <input
                    type="text"
                    value={formData.contact_info}
                    onChange={(e) => handleInputChange('contact_info', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Phone or email for inquiries"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Rules */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Tournament Rules</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rules and Regulations
                </label>
                <textarea
                  value={formData.rules}
                  onChange={(e) => handleInputChange('rules', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Tournament rules, format, and regulations"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8 pt-6 border-t gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {tournament ? 'Update Tournament' : 'Create Tournament'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TournamentModal