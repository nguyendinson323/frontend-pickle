import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout } from '../../components/layout'
import { RootState, AppDispatch } from '../../store'
import { fetchCommonData } from '../../store/slices/commonSlice'
import { LoadingSpinner } from '../../components/common'
import {
  TournamentsHero,
  TournamentsUpcoming,
  TournamentsRecent,
  TournamentsCTA
} from '../../components/common/Tournaments'

const TournamentsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data: commonData, isLoading } = useSelector((state: RootState) => state.common)

  useEffect(() => {
    if (!commonData) {
      dispatch(fetchCommonData())
    }
  }, [dispatch, commonData])

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" message="Loading tournaments..." />
        </div>
      </Layout>
    )
  }

  const upcomingTournaments = commonData?.upcoming_tournaments || []
  const recentTournaments = commonData?.recent_tournaments || []

  return (
    <Layout>
      <TournamentsHero />
      
      <TournamentsUpcoming tournaments={upcomingTournaments} />
      
      <TournamentsRecent tournaments={recentTournaments} />
      
      <TournamentsCTA />
    </Layout>
  )
}

export default TournamentsPage