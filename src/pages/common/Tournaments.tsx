import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchCommonData } from '../../store/slices/commonSlice'
import { fetchTournaments } from '../../store/slices/tournamentsSlice'
import { LoadingSpinner } from '../../components/common'
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
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All Tournaments
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover and register for tournaments across Mexico. Filter by location, type, and skill level.
            </p>
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