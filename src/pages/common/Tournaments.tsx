import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchCommonData } from '../../store/slices/commonSlice'
import { fetchTournaments } from '../../store/slices/tournamentsSlice'
import {
  TournamentsHero,
  TournamentsFilters,
  TournamentsListing,
  TournamentsCTA
} from '../../components/common/Tournaments'
import { TournamentFilters } from '../../components/common/Tournaments/TournamentsFilters'

const TournamentsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data: commonData } = useSelector((state: RootState) => state.common)
  const { tournaments, isLoading, totalCount } = useSelector((state: RootState) => state.tournaments)
  
  const [currentFilters, setCurrentFilters] = useState<TournamentFilters>({})

  useEffect(() => {
    // Load common data for states in filters
    if (!commonData) {
      dispatch(fetchCommonData())
    }
  }, [dispatch, commonData])

  useEffect(() => {
    // Load tournaments with current filters
    dispatch(fetchTournaments(currentFilters))
  }, [dispatch, currentFilters])

  const handleFiltersChange = (newFilters: TournamentFilters) => {
    setCurrentFilters(newFilters)
  }

  return (
    <>
      <TournamentsHero />

      <section className="py-20 bg-gradient-to-br from-gray-50 to-white opacity-0 animate-fade-in-up">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 opacity-0 animate-fade-in-up [animation-delay:0.2s]">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              All Tournaments
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover and register for tournaments across Mexico. Filter by location, type, and skill level.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <TournamentsFilters onFiltersChange={handleFiltersChange} />

          <TournamentsListing
            tournaments={tournaments}
            isLoading={isLoading}
            totalCount={totalCount}
          />
        </div>
      </section>

      <TournamentsCTA />
    </>
  )
}

export default TournamentsPage