import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchCommonData } from '../../store/slices/commonSlice'
import { LoadingSpinner } from '../../components/common'
import {
  HomeHero,
  HomeStats,
  HomeFeatures,
  HomeTournaments,
  HomeCTA
} from '../../components/common/Home'

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data: commonData, isLoading } = useSelector((state: RootState) => state.common)

  useEffect(() => {
    if (!commonData) {
      dispatch(fetchCommonData())
    }
  }, [dispatch, commonData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    )
  }

  return (
    <>
      <HomeHero />
      
      {commonData?.federation_statistics && (
        <HomeStats statistics={commonData.federation_statistics} />
      )}
      
      <HomeFeatures />
      
      {commonData?.upcoming_tournaments && commonData.upcoming_tournaments.length > 0 && (
        <HomeTournaments tournaments={commonData.upcoming_tournaments} />
      )}
      
      <HomeCTA />
    </>
  )
}

export default HomePage